import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { Link, Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { Text } from '~/components/ui/text';
import { useAppForm } from '~/lib/form';
import { auth } from '~/lib/utils';
import {
  createDefaultUserSignUp,
  type UserSignUp,
  userSignUpSchema,
} from '~/server/routers/auth/validation';

export default function SignUp() {
  const { t } = useLingui();
  const session = auth.useSession();

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

  const form = useAppForm({
    defaultValues: createDefaultUserSignUp(),
    validators: { onSubmit: userSignUpSchema },
    onSubmit: async ({ value }) => {
      try {
        await signUp.mutateAsync(value);
      } catch (error) {
        if (Error.isError(error))
          Toast.show({ type: 'error', text1: t`Error`, text2: t`${error.message}` });
      }
    },
  });

  if (session.isPending) return <ActivityIndicator className={'mt-10'} />;
  if (session.data) return <Redirect href={'/'} />;

  return (
    <View className={'flex flex-col items-center justify-center gap-4 p-4'}>
      <Text className={'font-semibold'}>{t`Sign up`}</Text>
      <form.AppForm>
        <form.AppField
          name={'email'}
          children={(field) => <field.TextField label={t`Email`} />}
        />
        <form.AppField
          name={'name'}
          children={(field) => <field.TextField label={t`Name`} />}
        />
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
        <form.SubmitButton label={t`Sign up`} />
      </form.AppForm>
      <View className={'flex flex-row items-center justify-center gap-1'}>
        <Text numberOfLines={1}>{t`Already have an account?`}</Text>
        <Link href={'/sign-in'} asChild>
          <Text
            className={
              'text-gray-500 transition-colors hover:text-gray-400 active:text-gray-500'
            }>
            {t`Sign in`}
          </Text>
        </Link>
      </View>
    </View>
  );
}
