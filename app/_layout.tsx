import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "../context/AuthContext";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import "../global.css";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const { colorScheme } = useColorScheme();
  const segments = useSegments();
  const router = useRouter();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    // Only run the "Bouncer" logic once we know the Auth state
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      
      router.replace('/(tabs)/home');
    }

    
    SplashScreen.hideAsync();
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-slate-900">
        <StatusBar style={isDark ? "light" : "dark"} />
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <View className="flex-1 bg-white dark:bg-slate-900">
        <StatusBar style={isDark ? "light" : "dark"} />
        <Stack screenOptions={{ headerShown: false }}>
         
          <Stack.Screen name="(auth)" options={{ animation: 'none' }} />
          <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
        </Stack>
      </View>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
