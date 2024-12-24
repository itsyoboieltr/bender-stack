import { pgTable, text } from 'drizzle-orm/pg-core';
import { ulid } from 'ulidx';

export const todoTable = pgTable('todo', {
  id: text().primaryKey().$defaultFn(ulid),
  data: text().notNull(),
});
