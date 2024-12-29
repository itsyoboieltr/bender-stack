import { pgTable, text } from 'drizzle-orm/pg-core';
import { ulid } from 'ulidx';

export const todo = pgTable('todo', {
  id: text().primaryKey().$defaultFn(ulid),
  data: text().notNull(),
});
