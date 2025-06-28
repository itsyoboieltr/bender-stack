import type { ComponentProps } from 'react';
import { View } from 'react-native';

import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Text } from '~/components/ui/text';
import { cn, useFieldContext } from '~/lib/utils';

interface TextFieldProps extends ComponentProps<typeof Input> {
  label?: string;
}

export function TextField({ label, ...props }: TextFieldProps) {
  const field = useFieldContext<string>();
  return (
    <View className={'flex flex-col gap-1 w-60'}>
      {label && <Label>{label}</Label>}
      <Input
        className={cn({
          'border-red-400 web:focus-visible:ring-red-300':
            !field.state.meta.isValid,
        })}
        value={field.state.value}
        onChangeText={field.handleChange}
        {...props}
      />
      {!field.state.meta.isValid && (
        <Text className={'text-sm text-red-400'}>
          {field.state.meta.errors[0]?.message}
        </Text>
      )}
    </View>
  );
}
