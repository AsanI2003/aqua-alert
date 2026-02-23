import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../services/firebase';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !name) return Alert.alert("Error", "Please fill in all fields");

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      // Update the user's profile with their name
      await updateProfile(userCredential.user, { displayName: name });
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900 p-8 justify-center">
      <Text className="text-4xl font-bold text-blue-900 mb-2">Join Us</Text>
      <Text className="text-gray-400 text-lg mb-10">Start your hydration journey</Text>

      <View className="gap-5">
        <TextInput 
          placeholder="Full Name" 
          value={name}
          onChangeText={setName}
          className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 text-blue-900" 
        />
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
          onPress={handleRegister} 
          disabled={loading}
          className="bg-blue-600 py-5 rounded-2xl shadow-lg shadow-blue-400 mt-4 items-center"
        >
          {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Sign Up</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-center text-gray-500">
            Already a member? <Text className="text-blue-600 font-bold">Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}