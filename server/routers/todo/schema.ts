import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { todo } from './table';

export const todoSchema = createSelectSchema(todo, {
  id: z.string().trim().min(1),
  data: z.string().trim().min(1),
});

export type Todo = z.infer<typeof todoSchema>;

export const todoInsertSchema = todoSchema.omit({ id: true });

export type TodoInsert = z.infer<typeof todoInsertSchema>;

export const createDefaultTodo = (): TodoInsert => ({ data: '' });

export const todoDeleteSchema = todoSchema.pick({ id: true });

export type TodoDelete = z.infer<typeof todoDeleteSchema>;
