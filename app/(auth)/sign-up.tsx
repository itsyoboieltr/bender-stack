import { useMutation } from '@tanstack/react-query';
import { Link, Redirect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useAppForm } from '~/lib/form';
import { auth } from '~/lib/utils';
import {
  createDefaultUserSignUp,
  type UserSignUp,
  userSignUpSchema,
} from '~/server/routers/auth/validation';

export default function SignUp() {
  const { t } = useTranslation();
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
    onSubmit: ({ value }) => signUp.mutate(value),
  });

  if (session.isPending) return <ActivityIndicator className={'mt-10'} />;
  if (session.data) return <Redirect href={'/'} />;

  return (
    <View className={'flex flex-col items-center justify-center gap-4 p-4'}>
      <Text className={'font-semibold'}>{t('signUp')}</Text>
      <form.AppField
        name={'email'}
        children={(field) => <field.TextField label={t('email')} />}
      />
      <form.AppField
        name={'name'}
        children={(field) => <field.TextField label={t('name')} />}
      />
      <form.AppField
        name={'password'}
        children={(field) => (
          <field.TextField
            label={t('password')}
            onSubmitEditing={form.handleSubmit}
            secureTextEntry
          />
        )}
      />
      <Button loading={signUp.isPending} onPress={form.handleSubmit}>
        <Text>{t('signUp')}</Text>
      </Button>
      <View className={'flex flex-row items-center justify-center gap-1'}>
        <Text numberOfLines={1}>{t('alreadyHaveAnAccount')}</Text>
        <Link href={'/sign-in'} asChild>
          <Text
            className={
              'text-gray-500 transition-colors hover:text-gray-400 active:text-gray-500'
            }>
            {t('signIn')}
          </Text>
        </Link>
      </View>
    </View>
  );
}
