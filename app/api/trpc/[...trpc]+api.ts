import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { appRouter as router } from '~/server';
import { createContext } from '~/server/trpc';

const handler = (req: Request) =>
  fetchRequestHandler({ endpoint: '/api/trpc', req, router, createContext });

export { handler as GET, handler as POST };
