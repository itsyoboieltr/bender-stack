import { eq } from 'drizzle-orm';

import { todoInsertSchema, todoDeleteSchema } from './schema';
import { todoTable } from './table';
import { db } from '../../db';
import { procedure, router } from '../../trpc';

export const todoRouter = router({
  get: procedure.query(async () => await db.select().from(todoTable)),
  post: procedure.input(todoInsertSchema).mutation(async (req) => {
    await db.insert(todoTable).values(req.input);
  }),
  delete: procedure.input(todoDeleteSchema).mutation(async (req) => {
    await db.delete(todoTable).where(eq(todoTable.id, req.input.id));
  }),
});
