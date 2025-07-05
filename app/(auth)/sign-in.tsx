import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { Link, Redirect, useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import Toast from 'react-native-toast-message';

import TwoFactorTOTP from '~/components/two-factor-totp';
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
  const form = useAppForm({
    defaultValues: createDefaultUserSignIn(),
    validators: { onSubmit: userSignInSchema },
    onSubmit: async ({ value }) => {
      try {
        await props.signIn.mutateAsync(value);
      } catch (error) {
        if (Error.isError(error))
          Toast.show({ type: 'error', text1: 'Error', text2: error.message });
      }
    },
  });

  if (props.session.isPending) return <ActivityIndicator className={'mt-10'} />;

  return (
    <View className={'flex flex-col items-center justify-center gap-4 p-4'}>
      <Text className={'font-semibold'}>Sign in</Text>
      <form.AppForm>
        <form.AppField
          name={'email'}
          children={(field) => <field.TextField />}
        />
        <form.AppField
          name={'password'}
          children={(field) => (
            <field.TextField
              onSubmitEditing={form.handleSubmit}
              secureTextEntry
            />
          )}
        />
        <form.SubmitButton label={'Sign in'} />
      </form.AppForm>
      <View className={'flex flex-row items-center justify-center gap-1'}>
        <Text numberOfLines={1}>No account yet?</Text>
        <Link href={'/sign-up'} asChild>
          <Text
            className={
              'text-gray-500 transition-colors hover:text-gray-400 active:text-gray-500'
            }>
            Sign up
          </Text>
        </Link>
      </View>
      <View className={'flex flex-row items-center justify-center gap-1'}>
        <Link href={'/forgot-password'} asChild>
          <Text
            className={
              'text-gray-500 transition-colors hover:text-gray-400 active:text-gray-500'
            }>
            Forgot password
          </Text>
        </Link>
      </View>
    </View>
  );
}

function SignInTwoFactorStep(props: SignInStepProps) {
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
      <Text className={'font-semibold'}>Sign in</Text>
      <TwoFactorTOTP onComplete={(code) => verifyTotp.mutate({ code })} />
      <View className={'flex flex-row items-center justify-center gap-1'}>
        <Text
          className={
            'text-gray-500 transition-colors hover:text-gray-400 active:text-gray-500'
          }
          onPress={() => props.signIn.reset()}>
          Back
        </Text>
      </View>
    </View>
  );
}
