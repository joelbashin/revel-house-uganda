import React, { createContext, useContext } from 'react';
import { useMediaContent } from '../hooks/useMediaContent';

interface MediaContextValue {
  getImage: (sectionKey: string, fallback: string) => string;
  refresh: () => void;
}

const MediaContext = createContext<MediaContextValue>({
  getImage: (_key, fallback) => fallback,
  refresh: () => {},
});

export const useMedia = () => useContext(MediaContext);

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const { getImage, refresh } = useMediaContent();
  return (
    <MediaContext.Provider value={{ getImage, refresh }}>
      {children}
    </MediaContext.Provider>
  );
}
