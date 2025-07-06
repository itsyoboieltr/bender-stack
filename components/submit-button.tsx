import type { ComponentProps } from 'react';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useFormContext } from '~/lib/utils';

interface SubmitButtonProps extends ComponentProps<typeof Button> {
  label?: string;
}

export function SubmitButton({ label, ...props }: SubmitButtonProps) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button loading={isSubmitting} onPress={form.handleSubmit} {...props}>
          {label && <Text>{label}</Text>}
        </Button>
      )}
    </form.Subscribe>
  );
}
