import { useMutation } from '@tanstack/react-query';
import { View } from 'react-native';
import { useTimer } from 'react-timer-hook';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { Mail } from '~/lib/icons/mail';
import { rateLimit } from '~/lib/rate-limit';
import { auth, formatTime, setTimer } from '~/lib/utils';

export default function VerifyEmail() {
  const session = auth.useSession();

  const timer = useTimer({ expiryTimestamp: new Date() });

  const sendVerificationEmail = useMutation({
    mutationFn: async (
      user: Parameters<typeof auth.sendVerificationEmail>[0]
    ) => {
      const response = await auth.sendVerificationEmail({
        ...user,
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
          onSuccess: () => {
            setTimer({
              timer,
              seconds: rateLimit.customRules['/send-verification-email'].window,
            });
          },
        },
      });
      if (response.error) throw new Error(response.error.message);
    },
  });

  if (!session.data) return null;

  return (
    <View className={'flex flex-col items-center justify-center gap-4 p-4'}>
      <Text className={'font-semibold'}>Verify email</Text>
      <Mail size={60} />
      <Text className={'text-center'}>
        We've sent you a mail to{' '}
        <Text className={'font-semibold'}>{session.data.user.email}</Text>.
        Please check your inbox to verify your email.
      </Text>
      <Button
        disabled={timer.totalSeconds !== 0}
        loading={sendVerificationEmail.isPending}
        onPress={() => {
          if (!session.data) return;
          sendVerificationEmail.mutate({ email: session.data.user.email });
        }}>
        <Text>
          Send again{' '}
          {timer.totalSeconds !== 0 &&
            `in ${formatTime(timer.minutes, timer.seconds)}`}
        </Text>
      </Button>
    </View>
  );
}
