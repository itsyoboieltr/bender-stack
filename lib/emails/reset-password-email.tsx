import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  render,
  Text,
} from '@react-email/components';
import type { emailOTP } from 'better-auth/plugins';

import { serverEnv } from '~/lib/env/server';
import { otp, type SupportedLanguage } from '~/lib/shared';
import { transporter } from '~/server/email';

type SendVerificationOTP = Parameters<
  typeof emailOTP
>[0]['sendVerificationOTP'];

export const sendResetPasswordEmail: SendVerificationOTP = async (
  data,
  request
) => {
  const lng = 'en';
  await transporter.sendMail({
    from: serverEnv.SMTP_USERNAME,
    to: data.email,
    subject: 'Reset your password',
    html: await render(<ResetPasswordEmail data={data} lng={lng} />),
  });
};

interface ResetPasswordEmailProps {
  data: Parameters<SendVerificationOTP>[0];
  lng: SupportedLanguage;
}

ResetPasswordEmail.PreviewProps = {
  data: {
    email: 'example@example.com',
    otp: '123456',
    type: 'forget-password',
  },
  lng: 'en',
} satisfies ResetPasswordEmailProps;

export default function ResetPasswordEmail({
  data,
  lng,
}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Body>
        <Container>
          <Heading style={heading}>Reset your password</Heading>
          <Text style={text}>
            Someone recently requested a password change for your account. If
            this was you, you can set a new password by entering the following
            code when prompted. This code will expire in {otp.expiresIn / 60}{' '}
            minutes.
          </Text>
          <Text style={code}>{data.otp}</Text>
          <Text style={text}>
            If you do not want to change your password or did not request this,
            just ignore and delete this message.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const text = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  margin: '24px 0',
};

const heading = {
  ...text,
  fontSize: '20px',
  fontWeight: 'bold',
  marginBottom: '15px',
};

const code = {
  ...text,
  fontWeight: 'bold',
  fontSize: '36px',
  margin: '10px 0',
  textAlign: 'center' as const,
};
