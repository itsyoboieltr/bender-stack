import { Elysia } from 'elysia';

import { todoRoute } from './todo';

export const app = new Elysia({ prefix: '/api' }).use(todoRoute).compile();

export type App = typeof app;

export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const PATCH = app.handle;
export const DELETE = app.handle;
