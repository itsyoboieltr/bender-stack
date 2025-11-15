import { createTransport } from 'nodemailer';

import { serverEnv } from '~/lib/env/server';

export const transporter = createTransport({
  host: serverEnv.SMTP_HOST,
  port: serverEnv.SMTP_PORT,
  secure: serverEnv.SMTP_SSL,
  auth: {
    user: serverEnv.SMTP_USERNAME,
    pass: serverEnv.SMTP_PASSWORD,
  },
});
