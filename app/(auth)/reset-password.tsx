import { useMutation } from '@tanstack/react-query';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Text } from '~/components/ui/text';
import { auth } from '~/lib/utils';
import {
  createDefaultUserResetPassword,
  userResetPasswordSchema,
  type UserResetPassword,
} from '~/server/routers/auth/schema';

export default function ResetPassword() {
  const router = useRouter();

  const [user, setUser] = useState(createDefaultUserResetPassword());

  const resetPassword = useMutation({
    mutationFn: async (user: UserResetPassword) => {
      const response = await auth.resetPassword(user);
      if (response.error) throw new Error(response.error.message);
    },
    onSuccess: async () => {
      router.push('/sign-in');
    },
  });

  const resetPasswordDisabled =
    resetPassword.isPending || !userResetPasswordSchema.safeParse(user).success;

  return (
    <View className={'flex flex-col items-center justify-center gap-4 p-4'}>
      <Text className={'font-semibold'}>Reset password</Text>
      <View className={'flex flex-col justify-center gap-1'}>
        <Label>New password</Label>
        <Input
          value={user.newPassword}
          onChangeText={(newPassword) => setUser({ ...user, newPassword })}
          secureTextEntry
        />
      </View>
      <View className={'flex flex-col justify-center gap-1'}>
        <Label>Confirm new password</Label>
        <Input
          value={user.newPasswordConfirm}
          onChangeText={(newPasswordConfirm) =>
            setUser({ ...user, newPasswordConfirm })
          }
          onSubmitEditing={() => {
            if (!resetPasswordDisabled) resetPassword.mutate(user);
          }}
          secureTextEntry
        />
      </View>
      <Button
        disabled={resetPasswordDisabled}
        loading={resetPassword.isPending}
        onPress={() => resetPassword.mutate(user)}>
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
