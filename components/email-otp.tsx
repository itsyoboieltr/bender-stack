import type { OTPInputProps } from 'input-otp-native';

import { otp } from '~/lib/shared';

import { OTPInput } from './ui/otp-input';
import { Text } from './ui/text';

export default function EmailOTP(props: Partial<OTPInputProps>) {
  return (
    <>
      <Text className={'text-center'}>
        We've sent you a mail. Please check your inbox and enter the{' '}
        {otp.otpLength}-digit code to verify your email.
      </Text>
      <OTPInput maxLength={otp.otpLength} {...props} />
    </>
  );
}
