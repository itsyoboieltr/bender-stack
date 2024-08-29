import { treaty } from '@elysiajs/eden';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { App } from '~/server';
import { client } from '~/utils/env/client';
import { server } from '~/utils/env/server';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const { api } = treaty<App>(
  typeof window === 'undefined'
    ? 'http://localhost:3000'
    : window.location.origin
);

export const env = { client, server };
