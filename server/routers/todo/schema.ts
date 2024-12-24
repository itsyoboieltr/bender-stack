import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { todoTable } from './table';

export const todoSchema = createSelectSchema(todoTable, {
  id: z.string().min(1).trim().default(' '),
  data: z.string().min(1).trim().default(' '),
});
export type Todo = z.infer<typeof todoSchema>;

export const todoInsertSchema = todoSchema.omit({ id: true });
export type TodoInsert = z.infer<typeof todoInsertSchema>;

export const todoDeleteSchema = todoSchema.pick({ id: true });
export type TodoDelete = z.infer<typeof todoDeleteSchema>;
