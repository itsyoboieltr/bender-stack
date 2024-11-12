import { wrap } from '@typeschema/typebox';
import { eq } from 'drizzle-orm';

import { todoInsertSchema, todoDeleteSchema } from './schema';
import { todo } from './table';
import { db } from '../../db';
import { procedure, router } from '../../trpc';

export const todoRouter = router({
  get: procedure.query(async () => await db.select().from(todo)),
  post: procedure.input(wrap(todoInsertSchema)).mutation(async (req) => {
    await db.insert(todo).values(req.input);
  }),
  delete: procedure.input(wrap(todoDeleteSchema)).mutation(async (req) => {
    await db.delete(todo).where(eq(todo.id, req.input.id));
  }),
});
