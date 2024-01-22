import { useMutation } from '@tanstack/react-query';
import { Pressable, Text, View } from 'react-native';

import { app } from '~/app/_layout';
import { cn, handleEden } from '~/utils';

interface TodoProps {
  id: string;
  data: string;
}

export default function Todo(props: TodoProps) {
  const todoDelete = useMutation({
    mutationFn: async () => handleEden(await app.api.todo[props.id]!.delete()),
  });
  const todoDeletingDisabled = todoDelete.isPending;
  return (
    <View className={'flex flex-row justify-center items-center gap-4'}>
      <Text>{props.data}</Text>
      <Pressable
        className={cn(
          'rounded border-2 border-black bg-red-300 px-4 py-1 flex flex-row items-center justify-center web:select-none',
          {
            'bg-red-400': todoDeletingDisabled,
            'hover:bg-red-400 active:bg-red-500': !todoDeletingDisabled,
          }
        )}
        disabled={todoDeletingDisabled}
        onPress={() => todoDelete.mutate()}>
        <Text>X</Text>
      </Pressable>
    </View>
  );
}
