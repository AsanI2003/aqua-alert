import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from '../context/AuthContext'; 
import "../global.css";

// Prevent auto-hide so we can control it with Firebase
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

useEffect(() => {
  if (loading) return;

  // 1. Get the top-level segment
  const rootSegment = segments[0] as string;

  // 2. Determine where the user is
  const isAuthGroup = rootSegment === '(auth)';
  const isIndex = rootSegment === 'index' || !rootSegment;

  // 3. Logic:
  if (!user && !isAuthGroup) {
    // Force to login if not authenticated and not in auth screens
    router.replace('/login');
  } 
  else if (user && (isAuthGroup || isIndex)) {
    // Force to home if authenticated but trying to see login/register
    router.replace('/(tabs)/home');
  }

  SplashScreen.hideAsync();
}, [user, loading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
     
      <Stack.Screen name="(auth)" /> 
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}