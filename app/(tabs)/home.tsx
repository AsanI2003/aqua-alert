import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import WaveCircle from '../../components/ui/WaveCircle';
import { Info, LogOut } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const [drank, setDrank] = useState(320);
  const goal = 3200;

  const percentage = Math.min(Math.round((drank / goal) * 100), 100);

  // LOGIC: Logout Confirmation
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => router.replace('/login'), style: 'destructive' }
    ]);
  };

  // LOGIC: Info Popup
  const showGoalInfo = () => {
    Alert.alert(
      "Why 3200ml?",
      "This fixed goal is based on global health averages to ensure optimal physical and cognitive performance.",
      [{ text: "OK", style: "cancel" }]
    );
  };

  // NEW LOGIC: Add Cup Confirmation
  const confirmAdd = () => {
    Alert.alert(
      "Add Water", 
      "Do you want to add cup to your daily intake?",
      [
        { text: "No", style: "cancel" },
        { text: "Yes, Add", onPress: () => setDrank(d => d + 250) }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6">
        
        {/* HEADER */}
        <View className="flex-row items-center justify-between mt-10 mb-8 w-full">
          <TouchableOpacity onPress={handleLogout} className="p-2">
            <LogOut size={24} color="#1e3a8a" />
          </TouchableOpacity>
          <Text className="text-blue-900 text-xl font-bold">Daily Progress</Text>
          <View className="w-10" />
        </View>

        {/* MAIN CONTENT */}
        <View className="items-center">
          <WaveCircle percentage={percentage} />

          {/* INTAKE CARD */}
          <View className="mt-16 items-center bg-blue-50 p-8 rounded-[40px] w-full border border-blue-100">
            <Text className="text-blue-400 uppercase tracking-widest font-bold text-xs mb-2">Current Intake</Text>
            <Text className="text-5xl font-black text-blue-900">
              {drank}<Text className="text-xl text-blue-400"> ml</Text>
            </Text>
            
            <View className="h-[2px] w-20 bg-blue-200 my-4" />
            
            <TouchableOpacity onPress={showGoalInfo} className="flex-row items-center">
              <Text className="text-gray-500 font-medium">Goal: 3200ml </Text>
              <Info size={16} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* ACTION BUTTON */}
          <View className="flex-row gap-4 mt-16 w-full">
            <TouchableOpacity 
              onPress={confirmAdd} // Changed from direct setDrank to the confirm function
              className="flex-1 bg-blue-600 py-6 rounded-3xl items-center active:bg-blue-700 shadow-lg shadow-blue-200"
            >
              <Text className="text-white font-black text-xl">Add Cup</Text>
              <Text className="text-blue-200 font-bold text-xs uppercase">+250 ml</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}