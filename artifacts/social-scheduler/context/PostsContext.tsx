import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Account, MOCK_ACCOUNTS, MOCK_POSTS, Post } from '@/types';

interface PostsContextValue {
  posts: Post[];
  accounts: Account[];
  addPost: (post: Omit<Post, 'id' | 'createdAt'>) => void;
  deletePost: (id: string) => void;
  toggleAccount: (id: string) => void;
}

const PostsContext = createContext<PostsContextValue | null>(null);

const POSTS_KEY = '@postly_posts';
const ACCOUNTS_KEY = '@postly_accounts';

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [storedPosts, storedAccounts] = await Promise.all([
          AsyncStorage.getItem(POSTS_KEY),
          AsyncStorage.getItem(ACCOUNTS_KEY),
        ]);
        setPosts(storedPosts ? JSON.parse(storedPosts) : MOCK_POSTS);
        setAccounts(storedAccounts ? JSON.parse(storedAccounts) : MOCK_ACCOUNTS);
      } catch {
        setPosts(MOCK_POSTS);
        setAccounts(MOCK_ACCOUNTS);
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

  const toggleAccount = useCallback((id: string) => {
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, connected: !a.connected } : a))
    );
  }, []);

  return (
    <PostsContext.Provider value={{ posts, accounts, addPost, deletePost, toggleAccount }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts(): PostsContextValue {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error('usePosts must be used within PostsProvider');
  return ctx;
}
