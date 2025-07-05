import { useMutation } from '@tanstack/react-query';
import { Link, Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Toast from 'react-native-toast-message';

import EmailOTP from '~/components/email-otp';
import { Text } from '~/components/ui/text';
import { useAppForm } from '~/lib/form';
import { auth } from '~/lib/utils';
import {
  createDefaultUserResetPassword,
  type UserResetPassword,
  userForgotPasswordSchema,
  userResetPasswordSchema,
} from '~/server/routers/auth/validation';

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
    onSuccess: (_, variables) =>
      props.setUser({ ...props.user, email: variables.email, step: 'otp' }),
  });

  const form = useAppForm({
    defaultValues: { email: props.user.email },
    validators: { onSubmit: userForgotPasswordSchema },
    onSubmit: async ({ value }) => {
      try {
        await sendVerificationOtp.mutateAsync({
          email: value.email,
          type: 'forget-password',
        });
      } catch (error) {
        if (Error.isError(error))
          Toast.show({ type: 'error', text1: 'Error', text2: error.message });
      }
    },
  });

  return (
    <>
      <form.AppForm>
        <form.AppField
          name={'email'}
          children={(field) => (
            <field.TextField onSubmitEditing={form.handleSubmit} />
          )}
        />
        <form.SubmitButton label={'Continue'} />
      </form.AppForm>
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

  const form = useAppForm({
    defaultValues: props.user,
    validators: { onSubmit: userResetPasswordSchema },
    onSubmit: async ({ value }) => {
      try {
        await resetPassword.mutateAsync(value);
      } catch (error) {
        if (Error.isError(error))
          Toast.show({ type: 'error', text1: 'Error', text2: error.message });
      }
    },
  });

  return (
    <>
      <form.AppForm>
        <form.AppField
          name={'password'}
          children={(field) => (
            <field.TextField label={'New password'} secureTextEntry />
          )}
        />
        <form.AppField
          name={'passwordConfirm'}
          children={(field) => (
            <field.TextField
              label={'Confirm new password'}
              onSubmitEditing={form.handleSubmit}
              secureTextEntry
            />
          )}
        />
        <form.SubmitButton />
      </form.AppForm>
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
