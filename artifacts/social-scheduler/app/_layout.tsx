import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_900Black,
} from '@expo-google-fonts/poppins';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Font from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { markOnboardingDone, OnboardingModal, shouldShowOnboarding } from '@/components/OnboardingModal';
import { LibraryProvider } from '@/context/LibraryContext';
import { PostsProvider } from '@/context/PostsContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { ThemeProvider } from '@/context/ThemeContext';

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient();

function RootLayoutNav() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    shouldShowOnboarding().then((should) => {
      if (should) setShowOnboarding(true);
    }).catch(() => {});
  }, []);

  const handleDone = async () => {
    await markOnboardingDone();
    setShowOnboarding(false);
  };

  return (
    <>
      <Stack screenOptions={{ headerShown: false, animation: 'default' }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false, presentation: 'modal', animation: 'slide_from_bottom' }} />
      </Stack>
      {showOnboarding && <OnboardingModal onDone={handleDone} />}
    </>
  );
}

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      Poppins_400Regular,
      Poppins_600SemiBold,
      Poppins_700Bold,
      Poppins_900Black,
    })
      .catch(() => {})
      .finally(() => {
        setReady(true);
        SplashScreen.hideAsync().catch(() => {});
      });
  }, []);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <KeyboardProvider>
                <SettingsProvider>
                  <LibraryProvider>
                    <PostsProvider>
                      <RootLayoutNav />
                    </PostsProvider>
                  </LibraryProvider>
                </SettingsProvider>
              </KeyboardProvider>
            </GestureHandlerRootView>
          </QueryClientProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
