import { auth } from '~/server/auth';

const handler = auth.handler;

export { handler as GET, handler as POST };
