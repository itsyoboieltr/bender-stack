import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { Link, Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import TwoFactorTOTP from '~/components/two-factor-totp';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Text } from '~/components/ui/text';
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
  const [user, setUser] = useState(createDefaultUserSignIn());

  const signInDisabled =
    props.signIn.isPending || !userSignInSchema.safeParse(user).success;

  if (props.session.isPending) return <ActivityIndicator className={'mt-10'} />;

  return (
    <View className={'flex flex-col items-center justify-center gap-4 p-4'}>
      <Text className={'font-semibold'}>Sign in</Text>
      <View className={'flex flex-col justify-center gap-1'}>
        <Label>Email</Label>
        <Input
          value={user.email}
          onChangeText={(email) => setUser({ ...user, email })}
        />
      </View>
      <View className={'flex flex-col justify-center gap-1'}>
        <Label>Password</Label>
        <Input
          value={user.password}
          onChangeText={(password) => setUser({ ...user, password })}
          onSubmitEditing={() => {
            if (!signInDisabled) props.signIn.mutate(user);
          }}
          secureTextEntry
        />
      </View>
      <Button
        disabled={signInDisabled}
        loading={props.signIn.isPending || props.signIn.isSuccess}
        onPress={() => props.signIn.mutate(user)}>
        <Text>Sign in</Text>
      </Button>
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
            Forgot password?
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
