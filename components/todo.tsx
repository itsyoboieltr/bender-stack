import { Pressable, Text, View } from 'react-native';
import { cn, trpc } from 'utils';

interface TodoProps {
  id: string;
  data: string;
}

export default function Todo(props: TodoProps) {
  const todoDelete = trpc.todo.delete.useMutation();
  const todoDeletingDisabled = todoDelete.isPending;
  return (
    <View className={'flex flex-row items-center justify-center gap-4'}>
      <Text>{props.data}</Text>
      <Pressable
        className={cn(
          'flex flex-row items-center justify-center rounded border-2 border-black bg-red-300 px-4 py-1 transition-all web:select-none',
          {
            'bg-red-400': todoDeletingDisabled,
            'hover:bg-red-400 active:bg-red-500': !todoDeletingDisabled,
          }
        )}
        disabled={todoDeletingDisabled}
        onPress={() => todoDelete.mutate({ id: props.id })}>
        <Text>X</Text>
      </Pressable>
    </View>
  );
}
