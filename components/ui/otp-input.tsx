import { OTPInput as InputOTP, type OTPInputProps } from 'input-otp-native';
import { View, Text } from 'react-native';

import { otp } from '~/lib/shared';
import { cn } from '~/lib/utils';

const OTPInput = (props: Partial<OTPInputProps>) => {
  return (
    <InputOTP
      {...props}
      maxLength={otp.otpLength}
      autoComplete={'one-time-code'}
      keyboardType={'numeric'}
      inputMode={'numeric'}
      textContentType={'oneTimeCode'}
      pattern={'[0-9]'}
      render={({ slots }) => (
        <View className={'my-4 flex-row items-center justify-center gap-2'}>
          {slots.map((slot, index) => (
            <View
              key={index}
              className={cn(
                'h-[50px] w-[50px] items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors',
                {
                  'border-2 border-black': slot.isActive,
                  'opacity-50 web:cursor-not-allowed': props.editable === false,
                }
              )}>
              {slot.char !== null && (
                <Text className={'text-2xl font-medium text-gray-900'}>
                  {slot.char}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}
    />
  );
};

OTPInput.displayName = 'OTPInput';

export { OTPInput };
