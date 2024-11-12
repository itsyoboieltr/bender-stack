import { Type as t } from '@sinclair/typebox';
import { createSelectSchema } from 'drizzle-typebox';

import { todo } from '../table';

export const todoSelectSchema = createSelectSchema(todo, {
  data: t.String({ minLength: 1, default: '' }),
});
export type Todo = typeof todoSelectSchema.static;

export const todoInsertSchema = t.Omit(todoSelectSchema, ['id']);
export const todoDeleteSchema = t.Pick(todoSelectSchema, ['id']);
