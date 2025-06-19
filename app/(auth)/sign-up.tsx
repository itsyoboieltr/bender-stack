import { useMutation } from '@tanstack/react-query';
import { Link, Redirect } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Text } from '~/components/ui/text';
import { auth } from '~/lib/utils';
import {
  createDefaultUserSignUp,
  userSignUpSchema,
  type UserSignUp,
} from '~/server/routers/auth/schema';

export default function SignUp() {
  const session = auth.useSession();
  const [user, setUser] = useState(createDefaultUserSignUp());

  const signUp = useMutation({
    mutationFn: async (user: UserSignUp) => {
      const response = await auth.signUp.email(user);
      if (response.error) throw new Error(response.error.message);
      return response.data;
    },
    onSuccess: async (data) => {
      await auth.emailOtp.sendVerificationOtp({
        email: data.user.email,
        type: 'email-verification',
      });
    },
  });

  const signUpDisabled =
    signUp.isPending || !userSignUpSchema.safeParse(user).success;

  if (session.isPending) return <ActivityIndicator className={'mt-10'} />;
  if (session.data) return <Redirect href={'/'} />;

  return (
    <View className={'flex flex-col items-center justify-center gap-4 p-4'}>
      <Text className={'font-semibold'}>Sign up</Text>
      <View className={'flex flex-col justify-center gap-1'}>
        <Label>Email</Label>
        <Input
          value={user.email}
          onChangeText={(email) => setUser({ ...user, email })}
        />
      </View>
      <View className={'flex flex-col justify-center gap-1'}>
        <Label>Name</Label>
        <Input
          value={user.name}
          onChangeText={(name) => setUser({ ...user, name })}
        />
      </View>
      <View className={'flex flex-col justify-center gap-1'}>
        <Label>Password</Label>
        <Input
          value={user.password}
          onChangeText={(password) => setUser({ ...user, password })}
          onSubmitEditing={() => {
            if (!signUpDisabled) signUp.mutate(user);
          }}
          secureTextEntry
        />
      </View>
      <Button
        disabled={signUpDisabled}
        loading={signUp.isPending}
        onPress={() => signUp.mutate(user)}>
        <Text>Sign up</Text>
      </Button>
      <View className={'flex flex-row items-center justify-center gap-1'}>
        <Text numberOfLines={1}>Already have an account?</Text>
        <Link href={'/sign-in'} asChild>
          <Text
            className={
              'text-gray-500 transition-colors hover:text-gray-400 active:text-gray-500'
            }>
            Sign in
          </Text>
        </Link>
      </View>
    </View>
  );
}
