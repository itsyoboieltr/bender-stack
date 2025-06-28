import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { Link, Redirect, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';

import TwoFactorTOTP from '~/components/two-factor-totp';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useAppForm } from '~/lib/form';
import { auth } from '~/lib/utils';
import {
  createDefaultUserSignIn,
  type UserSignIn,
  userSignInSchema,
} from '~/server/routers/auth/validation';

export default function SignIn() {
  const session = auth.useSession();
  const router = useRouter();
  const signIn = useMutation({
    mutationFn: async (data: UserSignIn) => {
      const response = await auth.signIn.email(data);
      if (response.error) throw new Error(response.error.message);
      return response.data;
    },
    onSuccess: async (data) => {
      // when 2FA is enabled, data.user is not returned, so we need to check this
      if (data.user) {
        // send a new verification otp if the user tries to log in and is not verified
        if (!data.user.emailVerified) {
          await auth.emailOtp.sendVerificationOtp({
            email: data.user.email,
            type: 'email-verification',
          });
          router.replace('/verify-email');
        } else {
          // if data.user is returned and the email is verified, 2FA is disabled
          router.replace('/enable-two-factor');
        }
      }
    },
  });

  if (session.data) return <Redirect href={'/'} />;

  return (
    <>
      {signIn.status !== 'success' ? (
        <SignInEmailAndPasswordStep signIn={signIn} session={session} />
      ) : (
        <SignInTwoFactorStep signIn={signIn} session={session} />
      )}
    </>
  );
}

interface SignInStepProps {
  signIn: UseMutationResult<
    ReturnType<typeof auth.signIn.email>,
    Error,
    UserSignIn
  >;
  session: ReturnType<typeof auth.useSession>;
}

function SignInEmailAndPasswordStep(props: SignInStepProps) {
  const { t } = useTranslation();
  const form = useAppForm({
    defaultValues: createDefaultUserSignIn(),
    validators: { onSubmit: userSignInSchema },
    onSubmit: ({ value }) => props.signIn.mutate(value),
  });

  if (props.session.isPending) return <ActivityIndicator className={'mt-10'} />;

  return (
    <View className={'flex flex-col items-center justify-center gap-4 p-4'}>
      <Text className={'font-semibold'}>{t('signIn')}</Text>
      <form.AppField name={'email'} children={(field) => <field.TextField />} />
      <form.AppField
        name={'password'}
        children={(field) => (
          <field.TextField
            onSubmitEditing={form.handleSubmit}
            secureTextEntry
          />
        )}
      />
      <Button
        loading={props.signIn.isPending || props.signIn.isSuccess}
        onPress={form.handleSubmit}>
        <Text>{t('signIn')}</Text>
      </Button>
      <View className={'flex flex-row items-center justify-center gap-1'}>
        <Text numberOfLines={1}>{t('noAccountYet')}</Text>
        <Link href={'/sign-up'} asChild>
          <Text
            className={
              'text-gray-500 transition-colors hover:text-gray-400 active:text-gray-500'
            }>
            {t('signUp')}
          </Text>
        </Link>
      </View>
      <View className={'flex flex-row items-center justify-center gap-1'}>
        <Link href={'/forgot-password'} asChild>
          <Text
            className={
              'text-gray-500 transition-colors hover:text-gray-400 active:text-gray-500'
            }>
            {t('forgotPassword')}
          </Text>
        </Link>
      </View>
    </View>
  );
}

function SignInTwoFactorStep(props: SignInStepProps) {
  const { t } = useTranslation();
  const verifyTotp = useMutation({
    mutationFn: async (
      data: Parameters<typeof auth.twoFactor.verifyTotp>[0]
    ) => {
      const response = await auth.twoFactor.verifyTotp(data);
      if (response.error) throw new Error(response.error.message);
    },
  });

  return (
    <View className={'flex flex-col items-center justify-center gap-4 p-4'}>
      <Text className={'font-semibold'}>{t('signIn')}</Text>
      <TwoFactorTOTP onComplete={(code) => verifyTotp.mutate({ code })} />
      <View className={'flex flex-row items-center justify-center gap-1'}>
        <Text
          className={
            'text-gray-500 transition-colors hover:text-gray-400 active:text-gray-500'
          }
          onPress={() => props.signIn.reset()}>
          {t('back')}
        </Text>
      </View>
    </View>
  );
}
