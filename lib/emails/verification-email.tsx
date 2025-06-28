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
import i18n from 'i18next';

import { serverEnv } from '~/lib/env/server';
import { otp, type SupportedLanguage } from '~/lib/shared';
import { transporter } from '~/server/email';
import { getLanguageFromRequest } from '~/server/i18n';

type SendVerificationOTP = Parameters<
  typeof emailOTP
>[0]['sendVerificationOTP'];

export const sendVerificationEmail: SendVerificationOTP = async (
  data,
  request
) => {
  const lng = getLanguageFromRequest(request);
  await transporter.sendMail({
    from: serverEnv.SMTP_USERNAME,
    to: data.email,
    subject: i18n.t('verifyEmail', { lng }),
    html: await render(<VerificationEmail data={data} lng={lng} />),
  });
};

interface VerificationEmailProps {
  data: Parameters<SendVerificationOTP>[0];
  lng: SupportedLanguage;
}

VerificationEmail.PreviewProps = {
  data: {
    email: 'example@example.com',
    otp: '123456',
    type: 'email-verification',
  },
  lng: 'en',
} satisfies VerificationEmailProps;

export default function VerificationEmail({
  data,
  lng,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{i18n.t('verifyEmail', { lng })}</Preview>
      <Body>
        <Container>
          <Heading style={heading}>{i18n.t('verifyEmail', { lng })}</Heading>
          <Text style={text}>
            {i18n.t('verifyEmailText', { count: otp.expiresIn / 60, lng })}
          </Text>
          <Text style={code}>{data.otp}</Text>
          <Text style={text}>
            {i18n.t('ifYouDoNotWantToVerifyYourEmail', { lng })}
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
