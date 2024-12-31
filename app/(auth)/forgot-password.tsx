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
  createDefaultUserForgotPassword,
  userForgotPasswordSchema,
  type UserForgotPassword,
} from '~/server/routers/auth/schema';

export default function ForgotPassword() {
  const [user, setUser] = useState(createDefaultUserForgotPassword());

  const forgetPassword = useMutation({
    mutationFn: async (user: UserForgotPassword) => {
      const response = await auth.forgetPassword(user);
      if (response.error) throw new Error(response.error.message);
    },
  });

  const forgetPasswordDisabled =
    forgetPassword.isPending ||
    !userForgotPasswordSchema.safeParse(user).success;

  return (
    <View className={'flex flex-col items-center justify-center gap-4 p-4'}>
      <Text className={'font-semibold'}>Forgot password</Text>
      <View className={'flex flex-col justify-center gap-1'}>
        <Label>Email</Label>
        <Input
          value={user.email}
          onChangeText={(email) => setUser({ ...user, email })}
        />
      </View>
      <Button
        disabled={forgetPasswordDisabled}
        loading={forgetPassword.isPending}
        onPress={() => forgetPassword.mutate(user)}>
        <Text>Submit</Text>
      </Button>
      <View className={'flex flex-row items-center justify-center gap-1'}>
        <Text numberOfLines={1}>Remember your password?</Text>
        <Link href={'/sign-in'} asChild>
          <Text
            className={
              'text-gray-500 transition-all hover:text-gray-400 active:text-gray-500'
            }>
            Sign in
          </Text>
        </Link>
      </View>
    </View>
  );
}
