import { hashPassword } from 'better-auth/crypto';
import { count } from 'drizzle-orm';
import { ulid } from 'ulidx';

import { db } from '~/server/db';
import * as schema from '~/server/routers/schema';

const [user] = await db.select({ count: count() }).from(schema.user);

if (!user?.count) {
  console.log('[⣷] No users found, creating a default admin user...');

  const [adminUser] = await db
    .insert(schema.user)
    .values({
      id: ulid(),
      name: 'Admin',
      email: 'admin@admin.com',
      emailVerified: true,
      role: 'admin',
    })
    .returning({ id: schema.user.id });

  if (!adminUser) throw new Error('[⨯] Failed to create default admin user.');

  await db.insert(schema.account).values({
    id: ulid(),
    accountId: ulid(),
    providerId: 'credential',
    userId: adminUser.id,
    password: await hashPassword('admin-password'),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log('[✓] Default admin user successfully created!');
}

console.log('[✓] Seed script completed successfully!');

process.exit();
