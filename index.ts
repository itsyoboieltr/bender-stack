import { name } from 'package.json';
import path from 'path';

const WebRequest = Request;
const WebResponse = Response;

const { createRequestHandler } = await import('@expo/server/build');
const { ExpoRequest } = await import('@expo/server/build/environment');

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
    const request = new ExpoRequest(url.href, req);
    const response = await handleRequest(request);
    return new Response(await response.text(), response as any); // The any is needed, otherwise it throws type error, but it still works
  },
});

console.log(`${name} server listening on ${server.url}`);
