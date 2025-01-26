import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  render,
} from '@react-email/components';
import type { BetterAuthOptions } from 'better-auth';

import { serverEnv } from '../env/server';

import { transporter } from '~/server/email';

type SendResetPassword = NonNullable<
  NonNullable<BetterAuthOptions['emailAndPassword']>['sendResetPassword']
>;

export const sendResetPassword: SendResetPassword = async (data) => {
  await transporter.sendMail({
    from: serverEnv.SMTP_USERNAME,
    to: data.user.email,
    subject: 'Reset your password',
    html: await render(<ResetPasswordEmail data={data} />),
  });
};

interface ResetPasswordEmailProps {
  data: Parameters<SendResetPassword>[0];
}

ResetPasswordEmail.PreviewProps = {
  data: {
    user: {
      name: 'John Doe',
    },
    url: 'https://example.com',
  },
} as ResetPasswordEmailProps;

export default function ResetPasswordEmail(props: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Body>
        <Container>
          <Heading style={heading}>Reset your password</Heading>
          <Text style={{ ...text, marginBottom: '14px' }}>
            Hey {props.data.user.name},
          </Text>
          <Text style={text}>
            Someone recently requested a password change for your account. If
            this was you, you can set a new password by clicking the button
            below.
          </Text>
          <Button style={button} href={props.data.url}>
            Reset
          </Button>
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

const button = {
  ...text,
  borderRadius: '3px',
  fontWeight: '600',
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '11px 23px',
};
