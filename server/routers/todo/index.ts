import { eq } from 'drizzle-orm';

import { todoInsertSchema, todoDeleteSchema } from './schema';
import { todo } from './table';
import { db } from '../../db';
import { protectedProcedure, router } from '../../trpc';

export const todoRouter = router({
  get: protectedProcedure.query(async () => await db.select().from(todo)),
  post: protectedProcedure.input(todoInsertSchema).mutation(async (req) => {
    await db.insert(todo).values(req.input);
  }),
  delete: protectedProcedure.input(todoDeleteSchema).mutation(async (req) => {
    await db.delete(todo).where(eq(todo.id, req.input.id));
  }),
});
