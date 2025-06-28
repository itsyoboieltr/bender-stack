import { useMutation, useQueryClient } from '@tanstack/react-query';
import { View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useTRPC } from '~/lib/utils';

interface TodoProps {
  id: string;
  data: string;
}

export default function Todo(props: TodoProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const todoDelete = useMutation(
    trpc.todo.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.todo.get.queryFilter());
      },
    })
  );

  return (
    <View className={'flex flex-row items-center justify-center gap-4'}>
      <Text>{props.data}</Text>
      <Button
        variant={'destructive'}
        size={'sm'}
        loading={todoDelete.isPending}
        onPress={() => todoDelete.mutate({ id: props.id })}>
        <Text>X</Text>
      </Button>
    </View>
  );
}
