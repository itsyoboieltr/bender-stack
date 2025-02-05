import { useMutation } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Text } from '~/components/ui/text';
import { auth } from '~/lib/utils';
import {
  createDefaultUserSignIn,
  userSignInSchema,
  type UserSignIn,
} from '~/server/routers/auth/schema';

export default function SignIn() {
  const [user, setUser] = useState(createDefaultUserSignIn());

  const signIn = useMutation({
    mutationFn: async (user: UserSignIn) => {
      const response = await auth.signIn.email(user);
      if (response.error) throw new Error(response.error.message);
    },
  });

  const signInDisabled =
    signIn.isPending || !userSignInSchema.safeParse(user).success;

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
            if (!signInDisabled) signIn.mutate(user);
          }}
          secureTextEntry
        />
      </View>
      <Button
        disabled={signInDisabled}
        loading={signIn.isPending}
        onPress={() => signIn.mutate(user)}>
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
