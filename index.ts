import path from 'node:path';
import { createRequestHandler } from '@expo/server';
import { name } from 'package.json';

const handler = createRequestHandler(path.join(import.meta.dir, 'dist/server'));

const server = Bun.serve({
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname.includes('/_expo/static')) {
      const file = Bun.file(`dist/client${url.pathname}`);
      return new Response(file);
    }
    return await handler(req);
  },
});

console.log(`${name} server listening on ${server.url}`);
