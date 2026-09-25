import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKanbanStore } from '@/modules/kanban/hooks/useKanbanStore';
import { KANBAN_STORAGE_KEY } from '@/data/kanban';
import type { TaskDraft } from '@/types/kanban';

const draft = (overrides: Partial<TaskDraft> = {}): TaskDraft => ({
  title: 'Task',
  description: '',
  status: 'todo',
  priority: 'medium',
  progress: { current: 0, target: 0, unit: '' },
  dueDate: '',
  ...overrides,
});

describe('useKanbanStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('starts with an empty board when storage is empty', () => {
    const { result } = renderHook(() => useKanbanStore());
    expect(result.current.tasks).toEqual([]);
  });

  it('addTask inserts a card at the top of its column and persists', () => {
    const { result } = renderHook(() => useKanbanStore());

    act(() => result.current.addTask(draft({ title: 'First' })));
    act(() => result.current.addTask(draft({ title: 'Second' })));

    expect(result.current.tasks).toHaveLength(2);
    // Newest card gets order 0 and is placed first.
    const newest = result.current.tasks.find((t) => t.title === 'Second');
    expect(newest?.order).toBe(0);
    expect(window.localStorage.getItem(KANBAN_STORAGE_KEY)).toContain('Second');
  });

  it('updateTask patches fields and bumps updatedAt', () => {
    const { result } = renderHook(() => useKanbanStore());
    act(() => result.current.addTask(draft({ title: 'Old' })));
    const id = result.current.tasks[0].id;

    act(() => result.current.updateTask(id, draft({ title: 'New' })));

    expect(result.current.tasks[0].title).toBe('New');
  });

  it('deleteTask removes the card', () => {
    const { result } = renderHook(() => useKanbanStore());
    act(() => result.current.addTask(draft({ title: 'Doomed' })));
    const id = result.current.tasks[0].id;

    act(() => result.current.deleteTask(id));

    expect(result.current.tasks).toHaveLength(0);
  });

  it('moveTask moves a card between columns and renumbers order', () => {
    const { result } = renderHook(() => useKanbanStore());
    act(() => result.current.addTask(draft({ title: 'Move me', status: 'todo' })));
    const id = result.current.tasks[0].id;

    act(() => result.current.moveTask(id, 'done'));

    const moved = result.current.tasks.find((t) => t.id === id);
    expect(moved?.status).toBe('done');
    expect(moved?.order).toBe(0);
  });

  it('replaceState rejects invalid data but accepts a valid board', () => {
    const { result } = renderHook(() => useKanbanStore());

    let ok = true;
    act(() => { ok = result.current.replaceState({ not: 'a board' }); });
    expect(ok).toBe(false);

    act(() => {
      ok = result.current.replaceState({
        version: 1,
        tasks: [
          {
            id: 'x1',
            title: 'Imported',
            description: '',
            status: 'backlog',
            priority: 'high',
            progress: { current: 0, target: 0, unit: '' },
            dueDate: '',
            order: 0,
            createdAt: '2025-01-01T00:00:00Z',
            updatedAt: '2025-01-01T00:00:00Z',
          },
        ],
        savedAt: 0,
      });
    });
    expect(ok).toBe(true);
    expect(result.current.tasks[0].title).toBe('Imported');
  });

  it('clearBoard empties the board', () => {
    const { result } = renderHook(() => useKanbanStore());
    act(() => result.current.addTask(draft({ title: 'Gone soon' })));
    act(() => result.current.clearBoard());
    expect(result.current.tasks).toHaveLength(0);
  });

  it('exportJson serializes the current board', () => {
    const { result } = renderHook(() => useKanbanStore());
    act(() => result.current.addTask(draft({ title: 'Exportable' })));
    const parsed = JSON.parse(result.current.exportJson());
    expect(parsed.tasks[0].title).toBe('Exportable');
  });
});
