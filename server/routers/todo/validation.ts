import { t } from '@lingui/core/macro';
import { createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod/v4';

import { todo } from './table';

export const todoSchema = createSelectSchema(todo, {
  id: (schema) => schema.trim().min(1, { error: t`Id cannot be empty` }),
  data: (schema) => schema.trim().min(1, { error: t`Data cannot be empty` }),
});

export type Todo = z.infer<typeof todoSchema>;

export const todoInsertSchema = todoSchema.omit({ id: true });

export type TodoInsert = z.infer<typeof todoInsertSchema>;

export const createDefaultTodo = (): TodoInsert => ({ data: '' });

export const todoDeleteSchema = todoSchema.pick({ id: true });

export type TodoDelete = z.infer<typeof todoDeleteSchema>;
