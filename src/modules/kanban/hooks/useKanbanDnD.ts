/**
 * useKanbanDnD — a tiny, dependency-free drag-and-drop controller built on the
 * native HTML5 Drag and Drop API.
 *
 * We deliberately avoid a DnD library: HTML5 DnD covers the board use case
 * (drag a card, drop it into/between columns) with zero bundle cost, and it
 * works with mouse + most touch browsers. The hook exposes a flat API of
 * handlers that columns/cards spread onto their elements plus derived "drop
 * indicator" state for rendering the insertion line.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { DragEvent } from "react";
import type { KanbanStatus } from "@/types/kanban";

interface UseKanbanDnDOptions {
  onMove: (id: string, toStatus: KanbanStatus, beforeId?: string | null) => void;
}

export interface KanbanDnD {
  /** id of the card currently being dragged (null when idle). */
  draggingId: string | null;
  /** Column the pointer is currently over (null when idle). */
  overStatus: KanbanStatus | null;
  /** Card the pointer would insert *before* within the hovered column. */
  overBeforeId: string | null;
  /** Handlers to spread on a draggable card. */
  getCardHandlers: (id: string) => {
    draggable: true;
    onDragStart: (e: DragEvent<HTMLElement>) => void;
    onDragEnd: () => void;
  };
  /** Handlers to spread on a column drop zone. */
  getColumnHandlers: (status: KanbanStatus) => {
    onDragOver: (e: DragEvent<HTMLElement>) => void;
    onDragLeave: (e: DragEvent<HTMLElement>) => void;
    onDrop: (e: DragEvent<HTMLElement>) => void;
  };
  /**
   * Handlers for the thin gap between two cards — lets the user drop *between*
   * cards to choose an exact insertion point.
   */
  getGapHandlers: (status: KanbanStatus, beforeId: string | null) => {
    onDragOver: (e: DragEvent<HTMLElement>) => void;
    onDrop: (e: DragEvent<HTMLElement>) => void;
  };
}

const DND_MIME = "application/x-kanban-task";

export function useKanbanDnD({ onMove }: UseKanbanDnDOptions): KanbanDnD {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overStatus, setOverStatus] = useState<KanbanStatus | null>(null);
  const [overBeforeId, setOverBeforeId] = useState<string | null>(null);
  // Keep the id in a ref too: drag events can fire after React state batches.
  const draggingRef = useRef<string | null>(null);
  // Latest drop anchor, kept in a ref so the handler identity stays stable
  // (avoids re-creating every column's handlers on each dragover tick).
  const overBeforeRef = useRef<string | null>(null);
  // Latest onMove, so the handlers never need to depend on the callback prop.
  const onMoveRef = useRef(onMove);
  useEffect(() => {
    onMoveRef.current = onMove;
  }, [onMove]);

  const reset = useCallback(() => {
    draggingRef.current = null;
    overBeforeRef.current = null;
    setDraggingId(null);
    setOverStatus(null);
    setOverBeforeId(null);
  }, []);

  const getCardHandlers = useCallback(
    (id: string) => ({
      draggable: true as const,
      onDragStart: (e: DragEvent<HTMLElement>) => {
        draggingRef.current = id;
        setDraggingId(id);
        e.dataTransfer.effectAllowed = "move";
        // Some browsers require setData for the drag to actually start.
        e.dataTransfer.setData(DND_MIME, id);
        e.dataTransfer.setData("text/plain", id);
      },
      onDragEnd: reset,
    }),
    [reset]
  );

  const getColumnHandlers = useCallback(
    (status: KanbanStatus) => {
      const setAnchor = (beforeId: string | null) => {
        overBeforeRef.current = beforeId;
        setOverBeforeId(beforeId);
      };
      return {
        onDragOver: (e: DragEvent<HTMLElement>) => {
          if (!draggingRef.current) return;
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
          setOverStatus(status);
          // Pointer over the column body (not a gap) → append at the end.
          if (overBeforeRef.current !== null) setAnchor(null);
        },
        onDragLeave: (e: DragEvent<HTMLElement>) => {
          // Only clear when the pointer leaves the column entirely (not a child).
          if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
          setOverStatus((prev) => (prev === status ? null : prev));
          setAnchor(null);
        },
        onDrop: (e: DragEvent<HTMLElement>) => {
          e.preventDefault();
          const id = draggingRef.current ?? e.dataTransfer.getData(DND_MIME);
          if (id) onMoveRef.current(id, status, overBeforeRef.current);
          reset();
        },
      };
    },
    [reset]
  );

  const getGapHandlers = useCallback(
    (status: KanbanStatus, beforeId: string | null) => ({
      onDragOver: (e: DragEvent<HTMLElement>) => {
        if (!draggingRef.current) return;
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = "move";
        setOverStatus(status);
        overBeforeRef.current = beforeId;
        setOverBeforeId(beforeId);
      },
      onDrop: (e: DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const id = draggingRef.current ?? e.dataTransfer.getData(DND_MIME);
        if (id) onMoveRef.current(id, status, beforeId);
        reset();
      },
    }),
    [reset]
  );

  return useMemo(
    () => ({
      draggingId,
      overStatus,
      overBeforeId,
      getCardHandlers,
      getColumnHandlers,
      getGapHandlers,
    }),
    [
      draggingId,
      overStatus,
      overBeforeId,
      getCardHandlers,
      getColumnHandlers,
      getGapHandlers,
    ]
  );
}
