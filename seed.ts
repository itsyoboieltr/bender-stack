import { $ } from 'bun';
import { count, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';

import { serverEnv } from './lib/env/server';
import { auth } from './server/auth';
import * as schema from './server/routers/schema';

const db = drizzle({
  connection: serverEnv.DATABASE_URL,
  schema,
  casing: 'snake_case',
});

const doesTableExist = async (name: string) => {
  const [table] = await db.execute<Record<'exists', boolean>>(sql`
  SELECT EXISTS (
    SELECT FROM
        information_schema.tables
    WHERE
        table_schema LIKE 'public' AND
        table_type LIKE 'BASE TABLE' AND
        table_name = ${name}
    );`);
  return table ? table.exists : false;
};

const userTableExists = await doesTableExist('user');
if (!userTableExists) {
  console.log('🚨 Missing table(s), pushing the db schema...\n');
  await $`bun db:push`;
}

const [user] = await db.select({ count: count() }).from(schema.user);

if (user?.count)
  throw new Error(
    '❌ User table is not empty. Please truncate or drop the user table and re-run the seed script!'
  );

console.log('🚨 No users found, creating a default admin user...');

const authContext = await auth.$context;

const [adminUser] = await db
  .insert(schema.user)
  .values({
    id: authContext.generateId({ model: 'user' }),
    name: 'Admin',
    email: 'admin@admin.com',
    emailVerified: true,
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  .returning({ id: schema.user.id });

if (!adminUser) throw new Error('❌ Failed to create default admin user.');

await db.insert(schema.account).values({
  id: authContext.generateId({ model: 'account' }),
  accountId: authContext.generateId({ model: 'account' }),
  providerId: 'credential',
  userId: adminUser.id,
  password: await authContext.password.hash('admin-password'),
  createdAt: new Date(),
  updatedAt: new Date(),
});

console.log('✅ Default admin user successfully created!\n');
console.log('❗ Please change password immediately after login!\n');

process.exit();
