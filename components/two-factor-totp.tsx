import type { OTPInputProps } from 'input-otp-native';

import { totp } from '~/lib/shared';

import { OTPInput } from './ui/otp-input';
import { Text } from './ui/text';

export default function TwoFactorTOTP(props: Partial<OTPInputProps>) {
  return (
    <>
      <Text className={'text-center'}>
        Please enter the {totp.digits} digit code from your authenticator app.
      </Text>
      <OTPInput maxLength={totp.digits} {...props} />
    </>
  );
}
