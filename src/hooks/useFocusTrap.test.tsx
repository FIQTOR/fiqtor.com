import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { useFocusTrap } from '@/hooks/useFocusTrap';

/** Minimal component that traps focus inside a dialog-like container. */
function Dialog({ active, onClose }: { active: boolean; onClose: () => void }) {
  const ref = useFocusTrap<HTMLDivElement>(active, onClose);
  return (
    <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true">
      <button>First</button>
      <button>Last</button>
    </div>
  );
}

describe('useFocusTrap', () => {
  it('closes on Escape when active', () => {
    const onClose = vi.fn();
    render(<Dialog active onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('does not close on Escape when inactive', () => {
    const onClose = vi.fn();
    render(<Dialog active={false} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });
});
