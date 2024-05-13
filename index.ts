import { name } from 'package.json';
import path from 'path';

const WebRequest = Request;
const WebResponse = Response;

const { createRequestHandler } = await import('@expo/server/build');

// Expo overrides the global Request and Response, so we need to override them back
global.Request = WebRequest;
global.Response = WebResponse;

const handleRequest = createRequestHandler(
  path.join(import.meta.dir, 'dist/server')
);

const server = Bun.serve({
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname.includes('/_expo/static')) {
      const file = Bun.file(`dist/client${url.pathname}`);
      return new Response(file);
    }
    return await handleRequest(req);
  },
});

console.log(`${name} server listening on ${server.url}`);
