import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import Todo from '~/components/todo';
import { todoInsertSchema } from '~/server/routers/todo/schema';
import { trpc, cn, createFromSchema } from '~/utils';

export default function App() {
  const [todo, setTodo] = useState(createFromSchema(todoInsertSchema));

  const todoQuery = trpc.todo.get.useQuery();

  const todoAdd = trpc.todo.post.useMutation({
    onSuccess: () => setTodo(createFromSchema(todoInsertSchema)),
  });

  const todoAddingDisabled =
    todoAdd.isPending || !todoInsertSchema.safeParse(todo).success;

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
            if (!todoAddingDisabled) todoAdd.mutate(todo);
          }}
        />
        <Pressable
          className={cn(
            'rounded border-2 border-black bg-gray-300 px-4 transition-all flex flex-row items-center justify-center web:select-none',
            {
              'bg-gray-400': todoAddingDisabled,
              'hover:bg-gray-400 active:bg-gray-500': !todoAddingDisabled,
            }
          )}
          disabled={todoAddingDisabled}
          onPress={() => todoAdd.mutate(todo)}>
          <Text>Submit</Text>
        </Pressable>
      </View>
      <Text>Bun + tRPC + NativeWind + Drizzle + Expo + React Native</Text>
    </View>
  );
}
