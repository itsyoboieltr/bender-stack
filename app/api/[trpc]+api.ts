import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { appRouter as router } from '~/server';

const handler = (req: Request) =>
  fetchRequestHandler({ endpoint: '/api', req, router });

export const GET = handler;
export const POST = handler;
