import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const DOC_PATH = 'media/__videos';
const VIDEOS_KIND = 'videos';

export interface MediaVideos {
  urls: string[];
  updatedAt?: unknown;
}

export async function getMediaVideos(): Promise<string[]> {
  const snap = await getDoc(doc(db, DOC_PATH));
  if (!snap.exists()) return [];
  const data = snap.data() as { urls?: unknown; kind?: unknown };
  if (data.kind !== VIDEOS_KIND || !Array.isArray(data.urls)) return [];
  return data.urls.filter((u): u is string => typeof u === 'string');
}

export async function setMediaVideos(urls: string[]): Promise<void> {
  await setDoc(doc(db, DOC_PATH), {
    kind: VIDEOS_KIND,
    urls,
    updatedAt: serverTimestamp(),
  });
}

let cached: string[] | null = null;
let promise: Promise<string[]> | null = null;

export function loadMediaVideos(): Promise<string[]> {
  if (cached) return Promise.resolve(cached);
  if (promise) return promise;
  promise = getMediaVideos()
    .then((urls) => {
      cached = urls;
      promise = null;
      return urls;
    })
    .catch(() => {
      cached = [];
      promise = null;
      return cached;
    });
  return promise;
}