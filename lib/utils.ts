import { Theme, DefaultTheme } from '@react-navigation/native';
import { createTRPCReact } from '@trpc/react-query';
import { adminClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { clsx, type ClassValue } from 'clsx';
import { useColorScheme as useNativewindColorScheme } from 'nativewind';
import type { TimerResult } from 'react-timer-hook';
import { twMerge } from 'tailwind-merge';

import { clientEnv } from '~/lib/env/client';
import type { AppRouter } from '~/server';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } =
    useNativewindColorScheme();
  return {
    colorScheme: colorScheme ?? 'dark',
    setColorScheme,
    toggleColorScheme,
  };
}

export const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    background: 'hsl(0 0% 100%)',
    border: 'hsl(240 5.9% 90%)',
    card: 'hsl(0 0% 100%)',
    notification: 'hsl(0 84.2% 60.2%)',
    primary: 'hsl(240 5.9% 10%)',
    text: 'hsl(240 10% 3.9%)',
  },
};

export const DARK_THEME: Theme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    background: 'hsl(240 10% 3.9%)',
    border: 'hsl(240 3.7% 15.9%)',
    card: 'hsl(240 10% 3.9%)',
    notification: 'hsl(0 72% 51%)',
    primary: 'hsl(0 0% 98%)',
    text: 'hsl(0 0% 98%)',
  },
};

export const auth = createAuthClient({
  baseURL: clientEnv.EXPO_PUBLIC_HOST_URL,
  plugins: [adminClient()],
});

export const trpc = createTRPCReact<AppRouter>();

export const setTimer = ({
  timer,
  seconds,
}: {
  timer: TimerResult;
  seconds: number;
}) => {
  const time = new Date();
  time.setSeconds(time.getSeconds() + seconds);
  timer.restart(time);
};

export const formatTime = (minutes: number, seconds: number) => {
  const paddedMinutes = minutes.toString().padStart(2, '0');
  const paddedSeconds = seconds.toString().padStart(2, '0');
  return `${paddedMinutes}:${paddedSeconds}`;
};
