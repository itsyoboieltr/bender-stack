import path from 'node:path';
import { createRequestHandler } from 'expo-server/adapter/bun';

import { name } from '~/package.json';

const handler = createRequestHandler({
  build: path.join(process.cwd(), 'dist/server'),
  environment: process.env.NODE_ENV,
});

const server = Bun.serve({
  routes: {
    '/_expo/static/*': async (request) => {
      const file = Bun.file(`./dist/client/${new URL(request.url).pathname}`);
      const exists = await file.exists();
      return exists
        ? new Response(file)
        : new Response('Not found', { status: 404 });
    },
    '/*': async (request) => await handler(request),
  },
});

console.log(`${name} server listening on ${server.url}`);
