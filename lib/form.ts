import { createFormHook } from '@tanstack/react-form';

import { TextField } from '~/components/text-field';
import { fieldContext, formContext } from '~/lib/utils';

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
  },
  formComponents: {},
  fieldContext,
  formContext,
});
