import { Create } from '@sinclair/typebox/value';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { app } from './_layout';
import { todoInsertSchema } from '../server/todo/schema';

import Todo from '~/components/Todo';
import { cn, handleEden, validate } from '~/utils';

export default function App() {
  const [todo, setTodo] = useState(Create(todoInsertSchema));

  const todoQuery = useQuery({
    queryKey: ['todo'],
    queryFn: async () => handleEden(await app.api.todo.get()),
  });

  const todoAdd = useMutation({
    mutationFn: async () => handleEden(await app.api.todo.post(todo)),
    onSuccess: () => setTodo(Create(todoInsertSchema)),
  });

  const todoAddingDisabled =
    todoAdd.isPending || !validate(todoInsertSchema, todo);

  return (
    <View className={'flex flex-col justify-center items-center gap-4 p-4'}>
      <View className={'gap-2'}>
        {todoQuery.data?.map((todo) => (
          <Todo key={todo.id} id={todo.id} data={todo.data} />
        ))}
      </View>
      <View className={'flex flex-row justify-center gap-4'}>
        <TextInput
          className={
            'min-w-40 rounded border-2 border-black px-2 py-1 caret-black'
          }
          value={todo.data}
          onChangeText={(data) => setTodo({ data })}
          onSubmitEditing={() => {
            if (!todoAdd.isPending && validate(todoInsertSchema, todo))
              todoAdd.mutate();
          }}
        />
        <Pressable
          className={cn(
            'rounded border-2 border-black bg-gray-300 px-4 flex flex-row items-center justify-center web:select-none',
            {
              'bg-gray-400': todoAddingDisabled,
              'hover:bg-gray-400 active:bg-gray-500': !todoAddingDisabled,
            },
          )}
          disabled={todoAddingDisabled}
          onPress={() => todoAdd.mutate()}>
          <Text>Submit</Text>
        </Pressable>
      </View>
      <Text>Bun + Elysia + NativeWind + Drizzle + Expo + React Native</Text>
    </View>
  );
}
