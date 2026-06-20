import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export interface PlatformKeys {
  appId: string;
  appSecret: string;
}

export interface ApiKeys {
  facebook: PlatformKeys;
  youtube: PlatformKeys;
  tiktok: PlatformKeys;
}

const EMPTY_KEYS: ApiKeys = {
  facebook: { appId: '', appSecret: '' },
  youtube: { appId: '', appSecret: '' },
  tiktok: { appId: '', appSecret: '' },
};

interface SettingsContextValue {
  apiKeys: ApiKeys;
  setApiKey: (platform: keyof ApiKeys, field: keyof PlatformKeys, value: string) => void;
  savePlatformKeys: (platform: keyof ApiKeys) => Promise<void>;
  clearPlatformKeys: (platform: keyof ApiKeys) => void;
  isPlatformConfigured: (platform: keyof ApiKeys) => boolean;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);
const KEYS_STORAGE_KEY = '@postly_api_keys_v1';

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [apiKeys, setApiKeysState] = useState<ApiKeys>(EMPTY_KEYS);

  useEffect(() => {
    AsyncStorage.getItem(KEYS_STORAGE_KEY)
      .then((v) => { if (v) setApiKeysState(JSON.parse(v)); })
      .catch(() => {});
  }, []);

  const setApiKey = useCallback((platform: keyof ApiKeys, field: keyof PlatformKeys, value: string) => {
    setApiKeysState((prev) => ({
      ...prev,
      [platform]: { ...prev[platform], [field]: value },
    }));
  }, []);

  const savePlatformKeys = useCallback(async (platform: keyof ApiKeys) => {
    const updated = await AsyncStorage.getItem(KEYS_STORAGE_KEY)
      .then((v) => (v ? JSON.parse(v) : EMPTY_KEYS))
      .catch(() => EMPTY_KEYS);
    updated[platform] = apiKeys[platform];
    await AsyncStorage.setItem(KEYS_STORAGE_KEY, JSON.stringify(updated));
  }, [apiKeys]);

  const clearPlatformKeys = useCallback((platform: keyof ApiKeys) => {
    setApiKeysState((prev) => ({ ...prev, [platform]: { appId: '', appSecret: '' } }));
    AsyncStorage.getItem(KEYS_STORAGE_KEY).then((v) => {
      const stored = v ? JSON.parse(v) : EMPTY_KEYS;
      stored[platform] = { appId: '', appSecret: '' };
      return AsyncStorage.setItem(KEYS_STORAGE_KEY, JSON.stringify(stored));
    }).catch(() => {});
  }, []);

  const isPlatformConfigured = useCallback((platform: keyof ApiKeys) => {
    return !!(apiKeys[platform].appId.trim() && apiKeys[platform].appSecret.trim());
  }, [apiKeys]);

  return (
    <SettingsContext.Provider value={{ apiKeys, setApiKey, savePlatformKeys, clearPlatformKeys, isPlatformConfigured }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
