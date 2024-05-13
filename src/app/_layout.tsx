import '../global.css';
import { treaty } from '@elysiajs/eden';
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { App } from '../server';

import { clientEnv } from '~/utils/env/client';

export const { api } = treaty<App>(clientEnv.HOST_URL);

export default function Layout() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        placeholderData: (previousData: unknown) => previousData,
      },
    },
    mutationCache: new MutationCache({
      onSuccess: async () => {
        await queryClient.invalidateQueries();
      },
    }),
  });
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'right', 'left']}>
        <Slot />
      </SafeAreaView>
    </QueryClientProvider>
  );
}
