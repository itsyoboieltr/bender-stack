import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import { Redirect } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Toast from 'react-native-toast-message';
import QRCode from 'react-qr-code';

import TwoFactorTOTPSection from '~/components/two-factor-totp';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useAppForm } from '~/lib/form';
import { auth, cn } from '~/lib/utils';
import {
  createDefaultUserEnableTwoFactor,
  type UserEnableTwoFactor,
  userEnableTwoFactorSchema,
} from '~/server/routers/auth/validation';

export default function EnableTwoFactor() {
  const { t } = useLingui();
  const session = auth.useSession();
  const [user, setUser] = useState(createDefaultUserEnableTwoFactor());

  if (session.isPending) return <ActivityIndicator className={'mt-10'} />;
  if (!session.data) return <Redirect href={'/sign-in'} />;
  if (!session.data.user.emailVerified) return <Redirect href={'/verify-email'} />;
  if (session.data.user.twoFactorEnabled) return <Redirect href={'/'} />;

  return (
    <View className={'flex flex-col items-center justify-center gap-4 p-4'}>
      <Text className={'font-semibold'}>{t`Enable two-factor authentication`}</Text>
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
  const { t } = useLingui();
  const enableTwoFactor = useMutation({
    mutationFn: async (data: Parameters<typeof auth.twoFactor.enable>[0]) => {
      const response = await auth.twoFactor.enable(data);
      if (response.error) throw new Error(response.error.message);
      return response.data;
    },
    onSuccess: (data) => props.setUser({ ...props.user, step: 'scan', ...data }),
  });

  const form = useAppForm({
    defaultValues: props.user,
    validators: { onSubmit: userEnableTwoFactorSchema },
    onSubmit: async ({ value }) => {
      try {
        await enableTwoFactor.mutateAsync(value);
      } catch (error) {
        if (Error.isError(error))
          Toast.show({ type: 'error', text1: t`Error`, text2: t`${error.message}` });
      }
    },
  });

  const signOut = useMutation({
    mutationFn: async () => {
      const response = await auth.signOut();
      if (response.error) throw new Error(response.error.message);
    },
  });

  return (
    <>
      <form.AppForm>
        <form.AppField
          name={'password'}
          children={(field) => (
            <field.TextField
              label={t`Password`}
              onSubmitEditing={form.handleSubmit}
              secureTextEntry
            />
          )}
        />
        <form.SubmitButton label={t`Continue`} />
      </form.AppForm>
      <View className={'flex flex-row items-center justify-center gap-1'}>
        <Text
          className={
            'text-gray-500 transition-colors hover:text-gray-400 active:text-gray-500'
          }
          onPress={() => signOut.mutate()}>
          {t`Back`}
        </Text>
      </View>
    </>
  );
}

function EnableTwoFactorScanStep(props: EnableTwoFactorStepProps) {
  const { t } = useLingui();
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
        {t`Open your authenticator app and scan the QR code to set up two-factor authentication on your device.`}
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
            {t`Copy setup key`}
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
        {t`Once it’s all set up, click the button below to verify that everything works.`}
      </Text>
      <Button onPress={() => props.setUser({ ...props.user, step: 'verify' })}>
        <Text>{t`Continue`}</Text>
      </Button>
      <View className={'flex flex-row items-center justify-center gap-1'}>
        <Text
          className={
            'text-gray-500 transition-colors hover:text-gray-400 active:text-gray-500'
          }
          onPress={() => props.setUser({ ...props.user, step: 'password' })}>
          {t`Back`}
        </Text>
      </View>
    </>
  );
}

function EnableTwoFactorVerifyStep(props: EnableTwoFactorStepProps) {
  const { t } = useLingui();
  const verifyTotp = useMutation({
    mutationFn: async (data: Parameters<typeof auth.twoFactor.verifyTotp>[0]) => {
      const response = await auth.twoFactor.verifyTotp(data);
      if (response.error) throw new Error(response.error.message);
    },
  });

  return (
    <>
      <TwoFactorTOTPSection onComplete={(code) => verifyTotp.mutate({ code })} />
      <View className={'flex flex-row items-center justify-center gap-1'}>
        <Text
          className={
            'text-gray-500 transition-colors hover:text-gray-400 active:text-gray-500'
          }
          onPress={() => props.setUser({ ...props.user, step: 'scan' })}>
          {t`Back`}
        </Text>
      </View>
    </>
  );
}
