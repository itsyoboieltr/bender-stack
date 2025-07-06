import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import EmailOTPSection from '~/components/email-otp';
import { Text } from '~/components/ui/text';
import { auth } from '~/lib/utils';

export default function VerifyEmail() {
  const { t } = useLingui();
  const session = auth.useSession();
  const verifyEmail = useMutation({
    mutationFn: async (data: Parameters<typeof auth.emailOtp.verifyEmail>[0]) => {
      const response = await auth.emailOtp.verifyEmail(data);
      if (response.error) throw new Error(response.error.message);
    },
    onSuccess: () => {
      // refetch session on email verification
      // workaround for: https://github.com/better-auth/better-auth/issues/1286
      session.refetch();
    },
  });

  const signOut = useMutation({
    mutationFn: async () => {
      const response = await auth.signOut();
      if (response.error) throw new Error(response.error.message);
    },
  });

  if (session.isPending) return <ActivityIndicator className={'mt-10'} />;
  if (!session.data) return <Redirect href={'/sign-in'} />;
  if (session.data.user.emailVerified) return <Redirect href={'/'} />;

  return (
    <View className={'flex flex-col items-center justify-center gap-4 p-4'}>
      <Text className={'font-semibold'}>{t`Verify your email address`}</Text>
      <EmailOTPSection
        onComplete={(otp) => {
          if (!session.data) return;
          verifyEmail.mutate({ email: session.data.user.email, otp });
        }}
      />
      <View className={'flex flex-row items-center justify-center gap-1'}>
        <Text
          className={
            'text-gray-500 transition-colors hover:text-gray-400 active:text-gray-500'
          }
          onPress={() => signOut.mutate()}>
          {t`Back`}
        </Text>
      </View>
    </View>
  );
}
