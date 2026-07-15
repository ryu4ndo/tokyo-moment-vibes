import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ConciergeContext = createContext(null);

export function ConciergeProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [seedMessage, setSeedMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState('HOME');
  const [detailSpotId, setDetailSpotId] = useState(null);

  const openConcierge = useCallback((message) => {
    if (message) setSeedMessage(message);
    setIsOpen(true);
  }, []);

  const closeConcierge = useCallback(() => {
    setIsOpen(false);
    setSeedMessage(null);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      seedMessage,
      currentPage,
      detailSpotId,
      setCurrentPage,
      setDetailSpotId,
      openConcierge,
      closeConcierge,
    }),
    [isOpen, seedMessage, currentPage, detailSpotId, openConcierge, closeConcierge],
  );

  return <ConciergeContext.Provider value={value}>{children}</ConciergeContext.Provider>;
}

export function useConcierge() {
  const ctx = useContext(ConciergeContext);
  if (!ctx) throw new Error('useConcierge must be used within ConciergeProvider');
  return ctx;
}
