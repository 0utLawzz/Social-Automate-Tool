import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { MediaItem } from '@/types';

interface LibraryContextValue {
  mediaItems: MediaItem[];
  addMediaItem: (uri: string, type: 'image' | 'video') => void;
  deleteMediaItem: (id: string) => void;
}

const LibraryContext = createContext<LibraryContextValue | null>(null);
const LIBRARY_KEY = '@postly_library_v2';

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(LIBRARY_KEY).then((v) => {
      if (v) setMediaItems(JSON.parse(v));
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(LIBRARY_KEY, JSON.stringify(mediaItems)).catch(() => {});
  }, [mediaItems, loaded]);

  const addMediaItem = useCallback((uri: string, type: 'image' | 'video') => {
    const item: MediaItem = { id: generateId(), uri, type, addedAt: new Date().toISOString() };
    setMediaItems((prev) => [item, ...prev]);
  }, []);

  const deleteMediaItem = useCallback((id: string) => {
    setMediaItems((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return (
    <LibraryContext.Provider value={{ mediaItems, addMediaItem, deleteMediaItem }}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary(): LibraryContextValue {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be used within LibraryProvider');
  return ctx;
}
