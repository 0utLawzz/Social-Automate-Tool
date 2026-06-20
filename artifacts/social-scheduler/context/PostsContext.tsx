import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Account, CaptionTemplate, DEFAULT_ACCOUNTS, DEFAULT_TEMPLATES, Post } from '@/types';

interface PostsContextValue {
  posts: Post[];
  accounts: Account[];
  captionTemplates: CaptionTemplate[];
  campaigns: string[];
  addPost: (post: Omit<Post, 'id' | 'createdAt'>) => void;
  deletePost: (id: string) => void;
  connectAccount: (id: string, username: string, handle: string, followers: number) => void;
  disconnectAccount: (id: string) => void;
  addCaptionTemplate: (name: string, text: string) => void;
  deleteCaptionTemplate: (id: string) => void;
}

const PostsContext = createContext<PostsContextValue | null>(null);

const POSTS_KEY = '@postly_posts_v3';
const ACCOUNTS_KEY = '@postly_accounts_v3';
const TEMPLATES_KEY = '@postly_templates_v1';

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [accounts, setAccounts] = useState<Account[]>(DEFAULT_ACCOUNTS);
  const [captionTemplates, setCaptionTemplates] = useState<CaptionTemplate[]>(DEFAULT_TEMPLATES);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [sp, sa, st] = await Promise.all([
          AsyncStorage.getItem(POSTS_KEY),
          AsyncStorage.getItem(ACCOUNTS_KEY),
          AsyncStorage.getItem(TEMPLATES_KEY),
        ]);
        if (sp) setPosts(JSON.parse(sp));
        setAccounts(sa ? JSON.parse(sa) : DEFAULT_ACCOUNTS);
        setCaptionTemplates(st ? JSON.parse(st) : DEFAULT_TEMPLATES);
      } catch {
        setAccounts(DEFAULT_ACCOUNTS);
        setCaptionTemplates(DEFAULT_TEMPLATES);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => { if (loaded) AsyncStorage.setItem(POSTS_KEY, JSON.stringify(posts)).catch(() => {}); }, [posts, loaded]);
  useEffect(() => { if (loaded) AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts)).catch(() => {}); }, [accounts, loaded]);
  useEffect(() => { if (loaded) AsyncStorage.setItem(TEMPLATES_KEY, JSON.stringify(captionTemplates)).catch(() => {}); }, [captionTemplates, loaded]);

  const campaigns = useMemo(() => {
    const names = posts.map((p) => p.campaignName).filter((n): n is string => !!n && n.trim() !== '');
    return Array.from(new Set(names));
  }, [posts]);

  const addPost = useCallback((postData: Omit<Post, 'id' | 'createdAt'>) => {
    setPosts((prev) => [{ ...postData, id: generateId(), createdAt: new Date().toISOString() }, ...prev]);
  }, []);

  const deletePost = useCallback((id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const connectAccount = useCallback((id: string, username: string, handle: string, followers: number) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, connected: true, username, handle, followers } : a)));
  }, []);

  const disconnectAccount = useCallback((id: string) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, connected: false, username: '', handle: '', followers: 0 } : a)));
  }, []);

  const addCaptionTemplate = useCallback((name: string, text: string) => {
    setCaptionTemplates((prev) => [{ id: generateId(), name, text }, ...prev]);
  }, []);

  const deleteCaptionTemplate = useCallback((id: string) => {
    setCaptionTemplates((prev) => prev.filter((t) => t.id !== id && !t.isDefault));
  }, []);

  return (
    <PostsContext.Provider value={{ posts, accounts, captionTemplates, campaigns, addPost, deletePost, connectAccount, disconnectAccount, addCaptionTemplate, deleteCaptionTemplate }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts(): PostsContextValue {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error('usePosts must be used within PostsProvider');
  return ctx;
}
