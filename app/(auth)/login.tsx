import { Text, View, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white p-8 justify-center">
      <Text className="text-4xl font-bold text-blue-900 mb-2">Welcome</Text>
      <Text className="text-gray-400 text-lg mb-10">Sign in to stay hydrated</Text>

      <View className="gap-5">
        <TextInput placeholder="Email" className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 text-blue-900" />
        <TextInput placeholder="Password" secureTextEntry className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 text-blue-900" />
        
        <TouchableOpacity onPress={() => router.replace('/home')} className="bg-blue-600 py-5 rounded-2xl shadow-lg shadow-blue-400 mt-4">
          <Text className="text-white text-center font-bold text-lg">Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text className="text-center text-gray-500">
            New here? <Text className="text-blue-600 font-bold">Create Account</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}