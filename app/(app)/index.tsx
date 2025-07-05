import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Redirect } from 'expo-router';
import { ActivityIndicator, Platform, View } from 'react-native';
import Toast from 'react-native-toast-message';

import Todo from '~/components/todo';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useAppForm } from '~/lib/form';
import { auth, useTRPC } from '~/lib/utils';
import {
  createDefaultTodo,
  todoInsertSchema,
} from '~/server/routers/todo/validation';

export default function App() {
  const session = auth.useSession();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const todoQuery = useQuery(
    trpc.todo.get.queryOptions(undefined, { enabled: !!session.data })
  );

  const todoAdd = useMutation(
    trpc.todo.post.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.todo.get.queryFilter());
        form.reset();
      },
    })
  );

  const form = useAppForm({
    defaultValues: createDefaultTodo(),
    validators: { onSubmit: todoInsertSchema },
    onSubmit: async ({ value }) => {
      try {
        await todoAdd.mutateAsync(value);
      } catch (error) {
        if (Error.isError(error))
          Toast.show({ type: 'error', text1: 'Error', text2: error.message });
      }
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
  if (!session.data.user.emailVerified)
    return <Redirect href={'/verify-email'} />;
  if (!session.data.user.twoFactorEnabled)
    return <Redirect href={'/enable-two-factor'} />;

  return (
    <View className={'flex flex-col items-center justify-center gap-4 p-4'}>
      <View className={'gap-2'}>
        {todoQuery.data?.map((todo) => (
          <Todo key={todo.id} id={todo.id} data={todo.data} />
        ))}
      </View>
      <View className={'flex flex-row justify-center gap-4'}>
        <form.AppForm>
          <form.AppField
            name={'data'}
            children={(field) => (
              <field.TextField
                showLabel={false}
                onSubmitEditing={form.handleSubmit}
                blurOnSubmit={
                  Platform.OS === 'android' || Platform.OS === 'ios'
                }
              />
            )}
          />
          <form.SubmitButton />
        </form.AppForm>
      </View>
      <Text>Bun + tRPC + NativeWind + Drizzle + Expo + React Native</Text>
      <Button
        loading={signOut.isPending || signOut.isSuccess}
        onPress={() => signOut.mutate()}>
        <Text>Sign out</Text>
      </Button>
    </View>
  );
}
