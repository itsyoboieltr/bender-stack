import { useMutation } from '@tanstack/react-query';
import { View } from 'react-native';

import EmailOTPSection from '~/components/email-otp-section';
import { Text } from '~/components/ui/text';
import { auth } from '~/lib/utils';

export default function VerifyEmail() {
  const session = auth.useSession();

  const verifyEmail = useMutation({
    mutationFn: async (
      data: Parameters<typeof auth.emailOtp.verifyEmail>[0]
    ) => {
      const response = await auth.emailOtp.verifyEmail(data);
      if (response.error) throw new Error(response.error.message);
    },
    onSuccess: () => {
      // needed to refresh the session with the new user status
      location.reload();
    },
  });

  const signOut = useMutation({
    mutationFn: async () => {
      const response = await auth.signOut();
      if (response.error) throw new Error(response.error.message);
    },
  });

  if (!session.data) return null;

  return (
    <View className={'flex flex-col items-center justify-center gap-4 p-4'}>
      <Text className={'font-semibold'}>Verify your email address</Text>
      <EmailOTPSection
        data={{ email: session.data.user.email, type: 'email-verification' }}
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
          Back
        </Text>
      </View>
    </View>
  );
}
