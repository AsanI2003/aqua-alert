import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import WaveCircle from '../../components/ui/WaveCircle';
import { Info, LogOut } from 'lucide-react-native';
import { auth, db } from '@/services/firebase';
import { signOut } from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  Timestamp, 
  serverTimestamp 
} from 'firebase/firestore';

export default function HomeScreen() {
  const [drank, setDrank] = useState(0);
  const [loading, setLoading] = useState(true);
  const goal = 3200;

  const percentage = Math.min(Math.round((drank / goal) * 100), 100);

  // 1. REAL-TIME FETCH: Listen for today's water logs
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // Calculate the start of today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startTimestamp = Timestamp.fromDate(startOfToday);

    // Query: Logs for THIS user where time is >= start of today
    const q = query(
      collection(db, 'users', user.uid, 'logs'),
      where('timestamp', '>=', startTimestamp)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let total = 0;
      snapshot.forEach((doc) => {
        total += doc.data().amount;
      });
      setDrank(total);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Listen Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. SAVE: Log new cup to Firebase
  const logWater = async (amount: number) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await addDoc(collection(db, 'users', user.uid, 'logs'), {
        amount: amount,
        timestamp: serverTimestamp(), // Firebase server handles the exact time
      });
    } catch (error) {
      Alert.alert("Error", "Failed to save data to the cloud.");
      console.error(error);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: 'destructive', onPress: () => signOut(auth) }
    ]);
  };

  const confirmAdd = () => {
    Alert.alert("Add Water", "Do you want to add 200ml to your daily intake?", [
      { text: "No", style: "cancel" },
      { text: "Yes, Add", onPress: () => logWater(200) }
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6">
        
     
        <View className="flex-row items-center justify-between mt-10 mb-8 w-full">
          <TouchableOpacity onPress={handleLogout} className="p-2">
            <LogOut size={24} color="#1e3a8a" />
          </TouchableOpacity>
          <Text className="text-blue-900 text-xl font-bold">Daily Progress</Text>
          <View className="w-10" />
        </View>

      
        <View className="items-center">
          {loading ? (
            <View className="h-64 justify-center"><ActivityIndicator size="large" color="#2563EB" /></View>
          ) : (
            <WaveCircle percentage={percentage} />
          )}

        
          <View className="mt-16 items-center bg-blue-50 p-8 rounded-[40px] w-full border border-blue-100">
            <Text className="text-blue-400 uppercase tracking-widest font-bold text-xs mb-2">Current Intake</Text>
            <Text className="text-5xl font-black text-blue-900">
              {drank}<Text className="text-xl text-blue-400"> ml</Text>
            </Text>
            
            <View className="h-[2px] w-20 bg-blue-200 my-4" />
            
            <View className="flex-row items-center">
              <Text className="text-gray-500 font-medium">Goal: {goal}ml </Text>
            </View>
          </View>

        
          <View className="flex-row gap-4 mt-16 w-full">
            <TouchableOpacity 
              onPress={confirmAdd}
              className="flex-1 bg-blue-600 py-6 rounded-3xl items-center active:bg-blue-700 shadow-lg shadow-blue-200"
            >
              <Text className="text-white font-black text-xl">Add Cup</Text>
              <Text className="text-blue-200 font-bold text-xs uppercase">+200 ml</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}