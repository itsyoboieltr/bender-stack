import type { TSchema, Static } from '@sinclair/typebox';
import { Errors } from '@sinclair/typebox/errors';
import { Check } from '@sinclair/typebox/value';
import { createTRPCReact } from '@trpc/react-query';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { AppRouter } from '../server';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const trpc = createTRPCReact<AppRouter>();

export const parse = <T extends TSchema>(
  schema: T,
  value: unknown
): Static<T> => {
  const success = Check(schema, value);
  if (!success) throw new Error(Errors(schema, value).First()!.message);
  return value;
};

export const safeParse = <T extends TSchema>(
  schema: T,
  value: unknown
): { success: true; data: Static<T> } | { success: false; error: string } => {
  const success = Check(schema, value);
  if (success) return { success, data: value };
  const error = Errors(schema, value).First()!.message;
  return { success, error };
};
