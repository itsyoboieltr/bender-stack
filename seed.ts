import { count } from 'drizzle-orm';

import { auth } from '~/server/auth';
import { db } from '~/server/db';
import * as schema from '~/server/routers/schema';

const [user] = await db.select({ count: count() }).from(schema.user);

if (!user?.count) {
  console.log('[⣷] No users found, creating a default admin user...');

  const authContext = await auth.$context;

  const [adminUser] = await db
    .insert(schema.user)
    .values({
      id: authContext.generateId({ model: 'user' }),
      name: 'Admin',
      email: 'admin@admin.com',
      emailVerified: true,
      role: 'admin',
    })
    .returning({ id: schema.user.id });

  if (!adminUser) throw new Error('[⨯] Failed to create default admin user.');

  await db.insert(schema.account).values({
    id: authContext.generateId({ model: 'account' }),
    accountId: authContext.generateId({ model: 'account' }),
    providerId: 'credential',
    userId: adminUser.id,
    password: await authContext.password.hash('admin-password'),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log('[✓] Default admin user successfully created!');
}

console.log('[✓] Seed script completed successfully!');

process.exit();
