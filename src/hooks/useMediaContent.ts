import { useEffect, useState } from 'react';
import { getAllMediaContent, MediaContent } from '../services/mediaContentService';

let cached: Map<string, string> | null = null;
let promise: Promise<Map<string, string>> | null = null;

function fetchAll(): Promise<Map<string, string>> {
  if (cached) return Promise.resolve(cached);
  if (promise) return promise;
  promise = getAllMediaContent()
    .then((items) => {
      const map = new Map<string, string>();
      for (const item of items) {
        map.set(item.sectionKey, item.imageUrl);
      }
      cached = map;
      promise = null;
      return map;
    })
    .catch(() => {
      const map = new Map<string, string>();
      cached = map;
      promise = null;
      return map;
    });
  return promise;
}

export function useMediaContent() {
  const [map, setMap] = useState<Map<string, string>>(cached || new Map());

  useEffect(() => {
    let cancelled = false;
    fetchAll().then((m) => {
      if (!cancelled) setMap(m);
    });
    return () => { cancelled = true; };
  }, []);

  const getImage = (sectionKey: string, fallback: string): string => {
    return map.get(sectionKey) || fallback;
  };

  const refresh = () => {
    cached = null;
    promise = null;
    fetchAll().then((m) => setMap(m));
  };

  return { map, getImage, refresh };
}
