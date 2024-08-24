import { eq } from 'drizzle-orm';
import { Elysia } from 'elysia';

import { todo, todoSchema, todoInsertSchema, todoDeleteSchema } from './schema';
import { db } from '../db';

export const todoRoute = new Elysia({ prefix: '/todo' })
  .model({
    todo: todoSchema,
    todoInsert: todoInsertSchema,
    todoDelete: todoDeleteSchema,
  })
  .get('', async () => await db.select().from(todo))
  .post('', async ({ body }) => await db.insert(todo).values(body), {
    body: 'todoInsert',
  })
  .delete(
    '/:id',
    async ({ params }) => await db.delete(todo).where(eq(todo.id, params.id)),
    { params: 'todoDelete' }
  );
