import { createFormHook } from '@tanstack/react-form';

import { SubmitButton } from '~/components/submit-button';
import { TextField } from '~/components/text-field';
import { fieldContext, formContext } from '~/lib/utils';

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
