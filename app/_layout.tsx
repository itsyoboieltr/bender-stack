import '../global.css';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from '@react-navigation/native';
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { SplashScreen, Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { StrictMode, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { clientEnv } from '~/lib/env/client';
import { DARK_THEME, LIGHT_THEME, useColorScheme, trpc } from '~/lib/utils';

// https://github.com/nativewind/nativewind/issues/1153#issuecomment-2428123382
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

// https://github.com/calintamas/react-native-toast-message/issues/530
if (typeof document === 'undefined') {
  React.useLayoutEffect = React.useEffect;
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding
// eslint-disable-next-line @typescript-eslint/no-floating-promises
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
            placeholderData: (previousData: unknown) => previousData,
          },
        },
        queryCache: new QueryCache({
          onError: (e) =>
            Toast.show({ type: 'error', text1: 'Error', text2: e.message }),
        }),
        mutationCache: new MutationCache({
          onError: (e) =>
            Toast.show({ type: 'error', text1: 'Error', text2: e.message }),
        }),
      })
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: new URL('api/trpc', clientEnv.EXPO_PUBLIC_HOST_URL),
        }),
      ],
    })
  );

  const { colorScheme, setColorScheme } = useColorScheme();

  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      const theme = await AsyncStorage.getItem('theme');
      if (Platform.OS === 'web') {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add('bg-background');
      }
      if (!theme) {
        await AsyncStorage.setItem('theme', colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === 'dark' ? 'dark' : 'light';
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      setIsColorSchemeLoaded(true);
      await SplashScreen.hideAsync();
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initialize();
  }, []);

  if (!isColorSchemeLoaded) return null;

  return (
    <StrictMode>
      <ThemeProvider value={colorScheme === 'dark' ? DARK_THEME : LIGHT_THEME}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'right', 'left']}>
              <Slot />
              <Toast position={'bottom'} />
            </SafeAreaView>
          </QueryClientProvider>
        </trpc.Provider>
      </ThemeProvider>
    </StrictMode>
  );
}
