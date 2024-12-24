import '../global.css';
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { Slot } from 'expo-router';
import { StrictMode, useState } from 'react';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { trpc } from '~/utils';
import { clientEnv } from '~/utils/env/client';

// https://github.com/nativewind/nativewind/issues/1153#issuecomment-2428123382
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

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
        <StrictMode>
          <SafeAreaView style={{ flex: 1 }} edges={['top', 'right', 'left']}>
            <Slot />
          </SafeAreaView>
        </StrictMode>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
