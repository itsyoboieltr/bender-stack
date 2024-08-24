import { createId } from '@paralleldrive/cuid2';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-typebox';
import { t } from 'elysia';

export const todo = pgTable('todo', {
  id: text('id').primaryKey().$defaultFn(createId),
  data: text('data').notNull(),
});

export const todoSchema = createSelectSchema(todo, {
  data: t.String({ minLength: 1, default: '' }),
});
export type Todo = typeof todoSchema.static;
export const todoInsertSchema = t.Omit(todoSchema, ['id']);
export const todoDeleteSchema = t.Pick(todoSchema, ['id']);
