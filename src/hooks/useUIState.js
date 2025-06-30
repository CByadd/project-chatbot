import { useState, useCallback } from 'react';

export const useUIState = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [componentPanelOpen, setComponentPanelOpen] = useState(false);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const handleToggleComponentPanel = useCallback(() => {
    setComponentPanelOpen(prev => !prev);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleCloseComponentPanel = useCallback(() => {
    setComponentPanelOpen(false);
  }, []);

  return {
    sidebarOpen,
    componentPanelOpen,
    handleToggleSidebar,
    handleToggleComponentPanel,
    handleCloseSidebar,
    handleCloseComponentPanel
  };
};