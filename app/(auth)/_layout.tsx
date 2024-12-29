import { Slot, Redirect } from 'expo-router';
import { ActivityIndicator } from 'react-native';

import { auth } from '~/lib/utils';

export default function AuthLayout() {
  const session = auth.useSession();

  if (session.isPending) return <ActivityIndicator className={'mt-10'} />;

  if (session.data) return <Redirect href={'/'} />;

  return <Slot />;
}
