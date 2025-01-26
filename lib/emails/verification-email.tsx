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

type SendVerificationEmail = NonNullable<
  NonNullable<BetterAuthOptions['emailVerification']>['sendVerificationEmail']
>;

export const sendVerificationEmail: SendVerificationEmail = async (data) => {
  await transporter.sendMail({
    from: serverEnv.SMTP_USERNAME,
    to: data.user.email,
    subject: 'Verify your email address',
    html: await render(<VerificationEmail data={data} />),
  });
};

interface VerificationEmailProps {
  data: Parameters<SendVerificationEmail>[0];
}

VerificationEmail.PreviewProps = {
  data: {
    user: {
      name: 'John Doe',
    },
    url: 'https://example.com',
  },
} as VerificationEmailProps;

export default function VerificationEmail(props: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address</Preview>
      <Body>
        <Container>
          <Heading style={heading}>Verify your email address</Heading>
          <Text style={{ ...text, marginBottom: '14px' }}>
            Hey {props.data.user.name},
          </Text>
          <Text style={text}>
            We want to make sure it is really you. Please verify your email
            address by clicking the button below. Once you confirm, you will be
            redirected to the application.
          </Text>
          <Button style={button} href={props.data.url}>
            Verify
          </Button>
          <Text style={text}>
            If you do not want to verify your email or did not request this,
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
