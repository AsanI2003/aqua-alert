import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../../services/firebase"; 

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password)
      return Alert.alert("Error", "Please fill in all fields");

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // RootLayout will handle redirecting to (tabs) automatically
    } catch (error: any) {
      Alert.alert("Login Failed please check your credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900 p-8 justify-center">
      <Text className="text-4xl font-bold text-blue-900 mb-2">Welcome</Text>
      <Text className="text-gray-400 text-lg mb-10">
        Sign in to stay hydrated
      </Text>

      <View className="gap-5">
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 text-blue-900"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 text-blue-900"
        />

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className="bg-blue-600 py-5 rounded-2xl shadow-lg shadow-blue-400 mt-4 items-center"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text className="text-center text-gray-500">
            New here?{" "}
            <Text className="text-blue-600 font-bold">Create Account</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
