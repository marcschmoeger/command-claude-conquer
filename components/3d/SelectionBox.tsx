'use client';

import { useStore } from '@/store/useStore';

export function SelectionBox() {
  const selection = useStore((state) => state.selection);

  if (!selection.isSelecting || !selection.selectionStart || !selection.selectionEnd) {
    return null;
  }

  const left = Math.min(selection.selectionStart.x, selection.selectionEnd.x);
  const top = Math.min(selection.selectionStart.y, selection.selectionEnd.y);
  const width = Math.abs(selection.selectionEnd.x - selection.selectionStart.x);
  const height = Math.abs(selection.selectionEnd.y - selection.selectionStart.y);

  return (
    <div
      className="selection-box"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    />
  );
}
