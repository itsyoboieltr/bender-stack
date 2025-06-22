import { useMutation } from '@tanstack/react-query';
import { Link, Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Toast from 'react-native-toast-message';

import EmailOTP from '~/components/email-otp';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Text } from '~/components/ui/text';
import { auth } from '~/lib/utils';
import {
  createDefaultUserResetPassword,
  type UserResetPassword,
  userForgotPasswordSchema,
  userResetPasswordSchema,
} from '~/server/routers/auth/schema';

export default function ForgotPassword() {
  const session = auth.useSession();
  const [user, setUser] = useState(createDefaultUserResetPassword());

  if (session.isPending) return <ActivityIndicator className={'mt-10'} />;
  if (session.data) return <Redirect href={'/'} />;

  return (
    <View className={'flex flex-col items-center justify-center gap-4 p-4'}>
      <Text className={'font-semibold'}>Forgot password</Text>
      {user.step === 'email' ? (
        <ForgotPasswordEmailStep user={user} setUser={setUser} />
      ) : user.step === 'otp' ? (
        <ForgotPasswordOTPStep user={user} setUser={setUser} />
      ) : (
        <ForgotPasswordResetStep user={user} setUser={setUser} />
      )}
    </View>
  );
}

interface ForgotPasswordStepProps {
  user: UserResetPassword;
  setUser: (user: UserResetPassword) => void;
}

function ForgotPasswordEmailStep(props: ForgotPasswordStepProps) {
  const sendVerificationOtp = useMutation({
    mutationFn: async (
      data: Parameters<typeof auth.emailOtp.sendVerificationOtp>[0]
    ) => {
      const response = await auth.emailOtp.sendVerificationOtp(data);
      if (response.error) throw new Error(response.error.message);
    },
    onSuccess: () => props.setUser({ ...props.user, step: 'otp' }),
  });

  const disabled = !userForgotPasswordSchema.safeParse(props.user).success;

  return (
    <>
      <View className={'flex flex-col justify-center gap-1'}>
        <Label>Email</Label>
        <Input
          value={props.user.email}
          onChangeText={(email) => props.setUser({ ...props.user, email })}
          onSubmitEditing={() => {
            if (!disabled)
              sendVerificationOtp.mutate({
                email: props.user.email,
                type: 'forget-password',
              });
          }}
        />
      </View>
      <Button
        disabled={disabled}
        loading={sendVerificationOtp.isPending}
        onPress={() =>
          sendVerificationOtp.mutate({
            email: props.user.email,
            type: 'forget-password',
          })
        }>
        <Text>Continue</Text>
      </Button>
      <View className={'flex flex-row items-center justify-center gap-1'}>
        <Link href={'/sign-in'} asChild>
          <Text
            className={
              'text-gray-500 transition-colors hover:text-gray-400 active:text-gray-500'
            }>
            Back
          </Text>
        </Link>
      </View>
    </>
  );
}

function ForgotPasswordOTPStep(props: ForgotPasswordStepProps) {
  return (
    <>
      <EmailOTP
        onComplete={(otp) =>
          props.setUser({ ...props.user, step: 'reset', otp })
        }
      />
      <View className={'flex flex-row items-center justify-center gap-1'}>
        <Text
          className={
            'text-gray-500 transition-colors hover:text-gray-400 active:text-gray-500'
          }
          onPress={() => props.setUser({ ...props.user, step: 'email' })}>
          Back
        </Text>
      </View>
    </>
  );
}

function ForgotPasswordResetStep(props: ForgotPasswordStepProps) {
  const router = useRouter();
  const resetPassword = useMutation({
    mutationFn: async (
      data: Parameters<typeof auth.emailOtp.resetPassword>[0]
    ) => {
      const response = await auth.emailOtp.resetPassword(data);
      if (response.error) throw new Error(response.error.message);
    },
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Your password was successfully reset',
      });
      router.replace('/sign-in');
    },
  });

  const resetPasswordDisabled =
    resetPassword.isPending ||
    !userResetPasswordSchema.safeParse(props.user).success;

  return (
    <>
      <View className={'flex flex-col justify-center gap-1'}>
        <Label>New password</Label>
        <Input
          value={props.user.password}
          onChangeText={(password) =>
            props.setUser({ ...props.user, password })
          }
          secureTextEntry
        />
      </View>
      <View className={'flex flex-col justify-center gap-1'}>
        <Label>Confirm new password</Label>
        <Input
          value={props.user.passwordConfirm}
          onChangeText={(passwordConfirm) =>
            props.setUser({ ...props.user, passwordConfirm })
          }
          onSubmitEditing={() => {
            if (!resetPasswordDisabled) resetPassword.mutate(props.user);
          }}
          secureTextEntry
        />
      </View>
      <Button
        disabled={resetPasswordDisabled}
        loading={resetPassword.isPending}
        onPress={() => resetPassword.mutate(props.user)}>
        <Text>Submit</Text>
      </Button>
      <View className={'flex flex-row items-center justify-center gap-1'}>
        <Text
          className={
            'text-gray-500 transition-colors hover:text-gray-400 active:text-gray-500'
          }
          onPress={() => props.setUser({ ...props.user, step: 'otp' })}>
          Back
        </Text>
      </View>
    </>
  );
}
