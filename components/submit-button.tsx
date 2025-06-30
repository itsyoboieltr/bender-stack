import type { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { useFormContext } from '~/lib/utils';

interface SubmitButtonProps extends ComponentProps<typeof Button> {
  label?: string;
}

export function SubmitButton({ label, ...props }: SubmitButtonProps) {
  const { t } = useTranslation();
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button loading={isSubmitting} onPress={form.handleSubmit} {...props}>
          <Text>{label ?? t('submit')}</Text>
        </Button>
      )}
    </form.Subscribe>
  );
}
