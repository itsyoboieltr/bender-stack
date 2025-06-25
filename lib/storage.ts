import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const storage = {
  set: (key: string, value: string) => {
    if (Platform.OS === 'web') localStorage.setItem(key, value);
    else SecureStore.setItem(key, value);
  },
  get: (key: string) => {
    if (Platform.OS === 'web') return localStorage.getItem(key);
    return SecureStore.getItem(key);
  },
};
