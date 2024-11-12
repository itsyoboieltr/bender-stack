import { createTRPCReact } from '@trpc/react-query';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Schema, z } from 'zod';

import type { AppRouter } from '../server';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const trpc = createTRPCReact<AppRouter>();

export const createFromSchema = <T extends Schema>(schema: T): z.infer<T> =>
  schema.parse({});
