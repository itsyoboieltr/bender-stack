import type { OTPInputProps } from 'input-otp-native';
import { useTranslation } from 'react-i18next';

import { totp } from '~/lib/shared';

import { OTPInput } from './ui/otp-input';
import { Text } from './ui/text';

export default function TwoFactorTOTP(props: Partial<OTPInputProps>) {
  const { t } = useTranslation();
  return (
    <>
      <Text className={'text-center'}>
        {t('TOTPText', { count: totp.digits })}
      </Text>
      <OTPInput maxLength={totp.digits} {...props} />
    </>
  );
}
