import { useMutation } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import { Redirect } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import QRCode from 'react-qr-code';

import TwoFactorTOTPSection from '~/components/two-factor-totp';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Text } from '~/components/ui/text';
import { auth, cn } from '~/lib/utils';
import {
  userEnableTwoFactorSchema,
  type UserEnableTwoFactor,
  createDefaultUserEnableTwoFactor,
} from '~/server/routers/auth/schema';

export default function EnableTwoFactor() {
  const session = auth.useSession();
  const [user, setUser] = useState(createDefaultUserEnableTwoFactor());

  if (session.isPending) return <ActivityIndicator className={'mt-10'} />;
  if (!session.data) return <Redirect href={'/sign-in'} />;
  if (!session.data.user.emailVerified)
    return <Redirect href={'/verify-email'} />;
  if (session.data.user.twoFactorEnabled) return <Redirect href={'/'} />;

  return (
    <View className={'flex flex-col items-center justify-center gap-4 p-4'}>
      <Text className={'font-semibold'}>Enable Two-Factor Authentication</Text>
      {user.step === 'password' ? (
        <EnableTwoFactorPasswordStep user={user} setUser={setUser} />
      ) : user.step === 'scan' ? (
        <EnableTwoFactorScanStep user={user} setUser={setUser} />
      ) : (
        <EnableTwoFactorVerifyStep user={user} setUser={setUser} />
      )}
    </View>
  );
}

interface EnableTwoFactorStepProps {
  user: UserEnableTwoFactor;
  setUser: (user: UserEnableTwoFactor) => void;
}

function EnableTwoFactorPasswordStep(props: EnableTwoFactorStepProps) {
  const enableTwoFactor = useMutation({
    mutationFn: async (data: Parameters<typeof auth.twoFactor.enable>[0]) => {
      const response = await auth.twoFactor.enable(data);
      if (response.error) throw new Error(response.error.message);
      return response.data;
    },
    onSuccess: (data) => {
      props.setUser({ ...props.user, step: 'scan', ...data });
    },
  });

  const enableTwoFactorDisabled = !userEnableTwoFactorSchema.safeParse(
    props.user
  ).success;

  const signOut = useMutation({
    mutationFn: async () => {
      const response = await auth.signOut();
      if (response.error) throw new Error(response.error.message);
    },
  });

  return (
    <>
      <View className={'flex flex-col justify-center gap-1'}>
        <Label>Password</Label>
        <Input
          value={props.user.password}
          onChangeText={(password) =>
            props.setUser({ ...props.user, password })
          }
          onSubmitEditing={() => {
            if (!enableTwoFactorDisabled) enableTwoFactor.mutate(props.user);
          }}
          secureTextEntry
        />
      </View>
      <Button
        disabled={enableTwoFactorDisabled}
        loading={enableTwoFactor.isPending}
        onPress={() => enableTwoFactor.mutate(props.user)}>
        <Text>Continue</Text>
      </Button>
      <View className={'flex flex-row items-center justify-center gap-1'}>
        <Text
          className={
            'text-gray-500 transition-colors hover:text-gray-400 active:text-gray-500'
          }
          onPress={() => signOut.mutate()}>
          Back
        </Text>
      </View>
    </>
  );
}

function EnableTwoFactorScanStep(props: EnableTwoFactorStepProps) {
  const copyToClipboard = useMutation({
    mutationFn: async (data: string) => {
      await Clipboard.setStringAsync(data);
    },
    onSuccess: () => {
      setTimeout(() => {
        copyToClipboard.reset();
      }, 1500);
    },
  });

  return (
    <>
      <Text className={'text-center'}>
        Open your authenticator app and scan the QR code to set up two-factor
        authentication on your device.
      </Text>
      <QRCode value={props.user.totpURI} />
      <Button
        variant={'ghost'}
        disabled={copyToClipboard.status === 'success'}
        onPress={() => copyToClipboard.mutate(props.user.totpURI)}>
        <View className={'relative flex items-center justify-center'}>
          <Text
            className={cn('transition-opacity', {
              'opacity-0': copyToClipboard.status === 'success',
            })}>
            Copy setup key
          </Text>
          <Text
            className={cn('absolute text-lg opacity-0 transition-opacity', {
              'opacity-100': copyToClipboard.status === 'success',
            })}>
            ✓
          </Text>
        </View>
      </Button>
      <Text className={'text-center'}>
        Once it’s all set up, click the button below to verify that everything
        works.
      </Text>
      <Button onPress={() => props.setUser({ ...props.user, step: 'verify' })}>
        <Text>Continue</Text>
      </Button>
      <View className={'flex flex-row items-center justify-center gap-1'}>
        <Text
          className={
            'text-gray-500 transition-colors hover:text-gray-400 active:text-gray-500'
          }
          onPress={() => props.setUser({ ...props.user, step: 'password' })}>
          Back
        </Text>
      </View>
    </>
  );
}

function EnableTwoFactorVerifyStep(props: EnableTwoFactorStepProps) {
  const verifyTotp = useMutation({
    mutationFn: async (
      data: Parameters<typeof auth.twoFactor.verifyTotp>[0]
    ) => {
      const response = await auth.twoFactor.verifyTotp(data);
      if (response.error) throw new Error(response.error.message);
    },
  });

  return (
    <>
      <TwoFactorTOTPSection
        onComplete={(code) => verifyTotp.mutate({ code })}
      />
      <View className={'flex flex-row items-center justify-center gap-1'}>
        <Text
          className={
            'text-gray-500 transition-colors hover:text-gray-400 active:text-gray-500'
          }
          onPress={() => props.setUser({ ...props.user, step: 'scan' })}>
          Back
        </Text>
      </View>
    </>
  );
}
