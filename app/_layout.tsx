import '../global.css';
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { Slot } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { trpc } from '~/utils';
import { clientEnv } from '~/utils/env/client';

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
        mutationCache: new MutationCache({
          onSuccess: async () => {
            await queryClient.invalidateQueries();
          },
        }),
      })
  );
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({ url: new URL('api', clientEnv.EXPO_PUBLIC_HOST_URL) }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'right', 'left']}>
          <Slot />
        </SafeAreaView>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
