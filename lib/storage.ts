import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const storage = {
  set: (key: string, value: string) => {
    if (Platform.OS === 'web' && typeof window !== 'undefined')
      localStorage.setItem(key, value);
    else SecureStore.setItem(key, value);
  },
  get: (key: string) => {
    if (Platform.OS === 'web')
      return typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    return SecureStore.getItem(key);
  },
};
