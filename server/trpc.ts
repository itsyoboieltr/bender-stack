import { initTRPC, TRPCError } from '@trpc/server';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { ZodError } from 'zod/v4';

import { auth } from './auth';

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  const session = await auth.api.getSession({ headers: opts.req.headers });
  return { auth: session };
};

export const { router, procedure, middleware } = initTRPC
  .context<typeof createContext>()
  .create({
    errorFormatter({ shape, error }) {
      return {
        ...shape,
        message:
          error.cause instanceof ZodError
            ? error.cause.issues[0]?.message
            : error.message,
      };
    },
  });

const isAuthed = middleware(({ next, ctx }) => {
  if (!ctx.auth) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You are not authorized to access this resource',
    });
  }
  return next({ ctx: { ...ctx, auth: ctx.auth } });
});

export const protectedProcedure = procedure.use(isAuthed);
