import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  // We show a loader just in case there's a split-second gap
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#2563EB" />
    </View>
  );
}