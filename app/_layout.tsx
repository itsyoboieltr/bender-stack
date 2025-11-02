import { i18n } from '@lingui/core';
import { t } from '@lingui/core/macro';
import { I18nProvider } from '@lingui/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from '@react-navigation/native';
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { Slot, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { StrictMode, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { Text } from '~/components/ui/text';
import { clientEnv } from '~/lib/env/client';
import { messages } from '~/lib/shared';
import {
  auth,
  DARK_THEME,
  getLocale,
  LIGHT_THEME,
  setLocale,
  TRPCProvider,
  useColorScheme,
} from '~/lib/utils';
import type { AppRouter } from '~/server';
import '@formatjs/intl-locale/polyfill-force';
import '@formatjs/intl-pluralrules/polyfill-force';
import '../global.css';

i18n.load(messages);

setLocale(getLocale());

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
            Toast.show({ type: 'error', text1: t`Error`, text2: t`${e.message}` }),
        }),
        mutationCache: new MutationCache({
          onError: (e) =>
            Toast.show({ type: 'error', text1: t`Error`, text2: t`${e.message}` }),
        }),
      })
  );

  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: new URL('api/trpc', clientEnv.EXPO_PUBLIC_HOST_URL),
          headers() {
            if (Platform.OS === 'web') return {};
            const headers = new Map<string, string>();
            const cookies = auth.getCookie();
            if (cookies) {
              headers.set('Cookie', cookies);
            }
            return Object.fromEntries(headers);
          },
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
    initialize();
  }, [colorScheme, setColorScheme]);

  if (!isColorSchemeLoaded) return null;

  return (
    <StrictMode>
      <I18nProvider i18n={i18n} defaultComponent={Text}>
        <ThemeProvider value={colorScheme === 'dark' ? DARK_THEME : LIGHT_THEME}>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <QueryClientProvider client={queryClient}>
            <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
              <SafeAreaView
                style={{ flex: 1 }}
                className={'bg-background'}
                edges={['top', 'right', 'left']}>
                <Slot />
                <Toast position={'bottom'} />
              </SafeAreaView>
            </TRPCProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </I18nProvider>
    </StrictMode>
  );
}
