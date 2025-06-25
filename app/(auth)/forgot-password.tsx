import { useMutation } from '@tanstack/react-query';
import { Link, Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
} from '~/server/routers/auth/validation';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const session = auth.useSession();
  const [user, setUser] = useState(createDefaultUserResetPassword());

  if (session.isPending) return <ActivityIndicator className={'mt-10'} />;
  if (session.data) return <Redirect href={'/'} />;

  return (
    <View className={'flex flex-col items-center justify-center gap-4 p-4'}>
      <Text className={'font-semibold'}>{t('forgotPassword')}</Text>
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
  const { t } = useTranslation();
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
        <Label>{t('email')}</Label>
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
        <Text>{t('continue')}</Text>
      </Button>
      <View className={'flex flex-row items-center justify-center gap-1'}>
        <Link href={'/sign-in'} asChild>
          <Text
            className={
              'text-gray-500 transition-colors hover:text-gray-400 active:text-gray-500'
            }>
            {t('back')}
          </Text>
        </Link>
      </View>
    </>
  );
}

function ForgotPasswordOTPStep(props: ForgotPasswordStepProps) {
  const { t } = useTranslation();
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
          {t('back')}
        </Text>
      </View>
    </>
  );
}

function ForgotPasswordResetStep(props: ForgotPasswordStepProps) {
  const { t } = useTranslation();
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
        text1: t('success'),
        text2: t('yourPasswordWasSuccessfullyReset'),
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
        <Label>{t('newPassword')}</Label>
        <Input
          value={props.user.password}
          onChangeText={(password) =>
            props.setUser({ ...props.user, password })
          }
          secureTextEntry
        />
      </View>
      <View className={'flex flex-col justify-center gap-1'}>
        <Label>{t('confirmNewPassword')}</Label>
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
        <Text>{t('submit')}</Text>
      </Button>
      <View className={'flex flex-row items-center justify-center gap-1'}>
        <Text
          className={
            'text-gray-500 transition-colors hover:text-gray-400 active:text-gray-500'
          }
          onPress={() => props.setUser({ ...props.user, step: 'otp' })}>
          {t('back')}
        </Text>
      </View>
    </>
  );
}
