'use client';

import { useEffect, useCallback } from 'react';
import { useStore } from '@/store/useStore';

export function useKeyboardShortcuts() {
  const clearSelection = useStore((state) => state.clearSelection);
  const selectAgents = useStore((state) => state.selectAgents);
  const agents = useStore((state) => state.agents);
  const selectedAgentIds = useStore((state) => state.selection.selectedAgentIds);
  const setControlGroup = useStore((state) => state.setControlGroup);
  const recallControlGroup = useStore((state) => state.recallControlGroup);
  const resetCamera = useStore((state) => state.resetCamera);
  const toggleMinimap = useStore((state) => state.toggleMinimap);
  const toggleShortcuts = useStore((state) => state.toggleShortcuts);
  const toggleSidebar = useStore((state) => state.toggleSidebar);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      // Escape - Clear selection
      if (key === 'escape') {
        clearSelection();
        return;
      }

      // Space - Reset camera
      if (key === ' ') {
        e.preventDefault();
        resetCamera();
        return;
      }

      // Tab - Toggle minimap
      if (key === 'tab') {
        e.preventDefault();
        toggleMinimap();
        return;
      }

      // ? - Toggle shortcuts help
      if (key === '?') {
        toggleShortcuts();
        return;
      }

      // B - Toggle sidebar
      if (key === 'b') {
        toggleSidebar();
        return;
      }

      // Ctrl+A - Select all idle agents
      if ((e.ctrlKey || e.metaKey) && key === 'a') {
        e.preventDefault();
        const idleAgents = agents.filter((a) => a.status === 'idle');
        selectAgents(idleAgents.map((a) => a.id));
        return;
      }

      // Control groups (1-9)
      if (/^[1-9]$/.test(key)) {
        const groupNum = parseInt(key);

        if (e.ctrlKey || e.metaKey) {
          // Ctrl+1-9: Set control group
          if (selectedAgentIds.length > 0) {
            setControlGroup(groupNum, selectedAgentIds);
          }
        } else {
          // 1-9: Recall control group
          recallControlGroup(groupNum);
        }
        return;
      }
    },
    [
      agents,
      selectedAgentIds,
      clearSelection,
      selectAgents,
      setControlGroup,
      recallControlGroup,
      resetCamera,
      toggleMinimap,
      toggleShortcuts,
      toggleSidebar,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
