import { useLingui } from '@lingui/react/macro';
import type { OTPInputProps } from 'input-otp-native';

import { otp } from '~/lib/shared';

import { OTPInput } from './ui/otp-input';
import { Text } from './ui/text';

export default function EmailOTP(props: Partial<OTPInputProps>) {
  const { t } = useLingui();
  return (
    <>
      <Text className={'text-center'}>
        {t`We've sent you a mail. Please check your inbox and enter the ${otp.otpLength} digit code to verify your email.`}
      </Text>
      <OTPInput maxLength={otp.otpLength} {...props} />
    </>
  );
}
