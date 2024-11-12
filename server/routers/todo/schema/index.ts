import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { todo } from '../table';

export const todoSelectSchema = createSelectSchema(todo, {
  id: z.string().min(1).trim().default(' '),
  data: z.string().min(1).trim().default(' '),
});
export type Todo = z.infer<typeof todoSelectSchema>;

export const todoInsertSchema = todoSelectSchema.omit({ id: true });
export const todoDeleteSchema = todoSelectSchema.pick({ id: true });
