import { useMutation } from '@tanstack/react-query';
import { Mail } from 'lucide-react-native';
import { useTimer } from 'react-timer-hook';

import { Button } from './ui/button';
import { OTPInput } from './ui/otp-input';
import { Text } from './ui/text';

import { rateLimit } from '~/lib/shared';
import { formatTime, auth, setTimer } from '~/lib/utils';

interface OTPSectionProps {
  data: Parameters<typeof auth.emailOtp.sendVerificationOtp>[0];
  onComplete: (otp: string) => void;
}

export default function EmailOTPSection(props: OTPSectionProps) {
  const timer = useTimer({ expiryTimestamp: new Date() });

  const sendVerificationOtp = useMutation({
    mutationFn: async (
      data: Parameters<typeof auth.emailOtp.sendVerificationOtp>[0]
    ) => {
      const response = await auth.emailOtp.sendVerificationOtp({
        ...data,
        fetchOptions: {
          onError: (context) => {
            // HTTP 429 - Too Many Requests
            if (context.response.status !== 429) return;
            const retryAfter = parseInt(
              context.response.headers.get('X-Retry-After') ?? '0',
              10
            );
            setTimer({ timer, seconds: retryAfter });
          },
        },
      });
      if (response.error) throw new Error(response.error.message);
    },
    onSuccess: () => {
      setTimer({
        timer,
        seconds:
          rateLimit.customRules['/email-otp/send-verification-otp'].window,
      });
    },
  });

  return (
    <>
      <Mail size={60} />
      <Text className={'text-center'}>
        Click the button below to send a verification code to{' '}
        <Text className={'font-semibold'}>{props.data.email}</Text>. Once you
        receive the mail, enter the code to verify your email.
      </Text>
      <OTPInput
        editable={!sendVerificationOtp.isPending}
        onComplete={props.onComplete}
      />
      <Button
        disabled={timer.totalSeconds !== 0}
        loading={sendVerificationOtp.isPending}
        onPress={() => sendVerificationOtp.mutate(props.data)}>
        <Text>
          Send{' '}
          {timer.totalSeconds !== 0 &&
            `again in ${formatTime(timer.minutes, timer.seconds)}`}
        </Text>
      </Button>
    </>
  );
}
