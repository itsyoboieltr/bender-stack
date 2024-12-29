import { View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { trpc } from '~/lib/utils';

interface TodoProps {
  id: string;
  data: string;
}

export default function Todo(props: TodoProps) {
  const utils = trpc.useUtils();

  const todoDelete = trpc.todo.delete.useMutation({
    onSuccess: async () => {
      await utils.todo.get.invalidate();
    },
  });

  const todoDeletingDisabled = todoDelete.isPending;

  return (
    <View className={'flex flex-row items-center justify-center gap-4'}>
      <Text>{props.data}</Text>
      <Button
        variant={'destructive'}
        size={'sm'}
        disabled={todoDeletingDisabled}
        loading={todoDelete.isPending}
        onPress={() => todoDelete.mutate({ id: props.id })}>
        <Text>X</Text>
      </Button>
    </View>
  );
}
