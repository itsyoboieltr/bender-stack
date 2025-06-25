import type { OTPInputProps } from 'input-otp-native';
import { useTranslation } from 'react-i18next';

import { otp } from '~/lib/shared';

import { OTPInput } from './ui/otp-input';
import { Text } from './ui/text';

export default function EmailOTP(props: Partial<OTPInputProps>) {
  const { t } = useTranslation();
  return (
    <>
      <Text className={'text-center'}>
        {t('OTPText', { count: otp.otpLength })}
      </Text>
      <OTPInput maxLength={otp.otpLength} {...props} />
    </>
  );
}
