import { useMutation } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useTimer } from 'react-timer-hook';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Text } from '~/components/ui/text';
import { rateLimit } from '~/lib/rate-limit';
import { auth, formatTime, setTimer } from '~/lib/utils';
import {
  createDefaultUserForgotPassword,
  userForgotPasswordSchema,
  type UserForgotPassword,
} from '~/server/routers/auth/schema';

export default function ForgotPassword() {
  const [user, setUser] = useState(createDefaultUserForgotPassword());

  const timer = useTimer({ expiryTimestamp: new Date() });

  const forgetPassword = useMutation({
    mutationFn: async (user: UserForgotPassword) => {
      const response = await auth.forgetPassword({
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
              seconds: rateLimit.customRules['/forget-password'].window,
            });
          },
        },
      });
      if (response.error) throw new Error(response.error.message);
    },
    onSuccess: async () => {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Check your mail! We’ve sent you a mail with instructions.',
      });
    },
  });

  const forgetPasswordDisabled =
    forgetPassword.isPending ||
    !userForgotPasswordSchema.safeParse(user).success ||
    timer.totalSeconds !== 0;

  return (
    <View className={'flex flex-col items-center justify-center gap-4 p-4'}>
      <Text className={'font-semibold'}>Forgot password</Text>
      <View className={'flex flex-col justify-center gap-1'}>
        <Label>Email</Label>
        <Input
          value={user.email}
          onChangeText={(email) => setUser({ ...user, email })}
          onSubmitEditing={() => {
            if (!forgetPasswordDisabled) forgetPassword.mutate(user);
          }}
        />
      </View>
      <Button
        disabled={forgetPasswordDisabled}
        loading={forgetPassword.isPending}
        onPress={() => forgetPassword.mutate(user)}>
        <Text>
          Submit{' '}
          {timer.totalSeconds !== 0 &&
            `again in ${formatTime(timer.minutes, timer.seconds)}`}
        </Text>
      </Button>
      <View className={'flex flex-row items-center justify-center gap-1'}>
        <Link href={'/sign-in'} asChild>
          <Text
            className={
              'text-gray-500 transition-all hover:text-gray-400 active:text-gray-500'
            }>
            Back
          </Text>
        </Link>
      </View>
    </View>
  );
}
