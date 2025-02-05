import { useMutation } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import EmailOTPSection from '~/components/email-otp-section';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Text } from '~/components/ui/text';
import { auth } from '~/lib/utils';
import {
  type UserResetPassword,
  createDefaultUserResetPassword,
  userResetPasswordSchema,
  userForgotPasswordSchema,
} from '~/server/routers/auth/schema';

export default function ForgotPassword() {
  const [user, setUser] = useState(createDefaultUserResetPassword());

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

interface ForgotPasswordEmailStepProps {
  user: UserResetPassword;
  setUser: (user: UserResetPassword) => void;
}

function ForgotPasswordEmailStep(props: ForgotPasswordEmailStepProps) {
  const disabled = !userForgotPasswordSchema.safeParse(props.user).success;

  return (
    <>
      <View className={'flex flex-col justify-center gap-1'}>
        <Label>Email</Label>
        <Input
          value={props.user.email}
          onChangeText={(email) => props.setUser({ ...props.user, email })}
          onSubmitEditing={() => {
            if (!disabled) props.setUser({ ...props.user, step: 'otp' });
          }}
        />
      </View>
      <Button
        disabled={disabled}
        onPress={() => props.setUser({ ...props.user, step: 'otp' })}>
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

interface ForgotPasswordOTPStepProps {
  user: UserResetPassword;
  setUser: (user: UserResetPassword) => void;
}

function ForgotPasswordOTPStep(props: ForgotPasswordOTPStepProps) {
  return (
    <>
      <EmailOTPSection
        data={{ email: props.user.email, type: 'forget-password' }}
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

interface ForgotPasswordResetStepProps {
  user: UserResetPassword;
  setUser: (user: UserResetPassword) => void;
}

function ForgotPasswordResetStep(props: ForgotPasswordResetStepProps) {
  const resetPassword = useMutation({
    mutationFn: async (
      data: Parameters<typeof auth.emailOtp.resetPassword>[0]
    ) => {
      const response = await auth.emailOtp.resetPassword(data);
      if (response.error) throw new Error(response.error.message);
    },
    onSuccess: async (_, data) => {
      const response = await auth.signIn.email(data);
      if (response.error) throw new Error(response.error.message);
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
