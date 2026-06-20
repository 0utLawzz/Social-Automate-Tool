import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Account, DEFAULT_ACCOUNTS, Post } from '@/types';

interface PostsContextValue {
  posts: Post[];
  accounts: Account[];
  addPost: (post: Omit<Post, 'id' | 'createdAt'>) => void;
  deletePost: (id: string) => void;
  connectAccount: (id: string, username: string, handle: string, followers: number) => void;
  disconnectAccount: (id: string) => void;
}

const PostsContext = createContext<PostsContextValue | null>(null);

const POSTS_KEY = '@postly_posts_v2';
const ACCOUNTS_KEY = '@postly_accounts_v2';

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [accounts, setAccounts] = useState<Account[]>(DEFAULT_ACCOUNTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [storedPosts, storedAccounts] = await Promise.all([
          AsyncStorage.getItem(POSTS_KEY),
          AsyncStorage.getItem(ACCOUNTS_KEY),
        ]);
        if (storedPosts) setPosts(JSON.parse(storedPosts));
        if (storedAccounts) setAccounts(JSON.parse(storedAccounts));
        else setAccounts(DEFAULT_ACCOUNTS);
      } catch {
        setPosts([]);
        setAccounts(DEFAULT_ACCOUNTS);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(POSTS_KEY, JSON.stringify(posts)).catch(() => {});
  }, [posts, loaded]);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts)).catch(() => {});
  }, [accounts, loaded]);

  const addPost = useCallback((postData: Omit<Post, 'id' | 'createdAt'>) => {
    const newPost: Post = {
      ...postData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setPosts((prev) => [newPost, ...prev]);
  }, []);

  const deletePost = useCallback((id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const connectAccount = useCallback(
    (id: string, username: string, handle: string, followers: number) => {
      setAccounts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, connected: true, username, handle, followers } : a))
      );
    },
    []
  );

  const disconnectAccount = useCallback((id: string) => {
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, connected: false, username: '', handle: '', followers: 0 } : a
      )
    );
  }, []);

  return (
    <PostsContext.Provider value={{ posts, accounts, addPost, deletePost, connectAccount, disconnectAccount }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts(): PostsContextValue {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error('usePosts must be used within PostsProvider');
  return ctx;
}
