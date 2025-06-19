import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Redirect } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';

import Todo from '~/components/todo';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { auth, useTRPC } from '~/lib/utils';
import {
  createDefaultTodo,
  todoInsertSchema,
} from '~/server/routers/todo/schema';

export default function App() {
  const session = auth.useSession();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const todoQuery = useQuery(
    trpc.todo.get.queryOptions(undefined, { enabled: !!session.data })
  );

  const [todo, setTodo] = useState(createDefaultTodo());

  const todoAdd = useMutation(
    trpc.todo.post.mutationOptions({
      onSuccess: async () => {
        setTodo(createDefaultTodo());
        await queryClient.invalidateQueries(trpc.todo.get.queryFilter());
      },
    })
  );

  const todoAddingDisabled =
    todoAdd.isPending || !todoInsertSchema.safeParse(todo).success;

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
        <Input
          value={todo.data}
          onChangeText={(data) => setTodo({ data })}
          blurOnSubmit={Platform.OS === 'android' || Platform.OS === 'ios'}
          onSubmitEditing={() => {
            if (!todoAddingDisabled) todoAdd.mutate(todo);
          }}
        />
        <Button
          disabled={todoAddingDisabled}
          loading={todoAdd.isPending}
          onPress={() => todoAdd.mutate(todo)}>
          <Text>Submit</Text>
        </Button>
      </View>
      <Text>Bun + tRPC + NativeWind + Drizzle + Expo + React Native</Text>
      <Button loading={signOut.isPending} onPress={() => signOut.mutate()}>
        <Text>Sign out</Text>
      </Button>
    </View>
  );
}
