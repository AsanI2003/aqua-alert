import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator, Platform, StatusBar as RNStatusBar, Switch } from 'react-native';
import { useColorScheme } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import WaveCircle from '../../components/ui/WaveCircle';
import { LogOut, Moon, Sun } from 'lucide-react-native';
import { auth, db } from '@/services/firebase';
import { signOut } from 'firebase/auth';
import * as Notifications from 'expo-notifications';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  Timestamp, 
  serverTimestamp 
} from 'firebase/firestore';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true, 
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function HomeScreen() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [drank, setDrank] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const goal = 3200;

  const percentage = Math.min(Math.round((drank / goal) * 100), 100);

  const setupReminders = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return;
      await Notifications.cancelAllScheduledNotificationsAsync();
      const hours = [8, 10, 12, 14, 16, 18, 20, 22];
      for (const hour of hours) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Hydration Check! 💧",
            body: "Keep going! You haven't hit your 3.2L goal yet.",
            sound: true,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY, 
            hour: hour,
            minute: 0,
          },
        });
      }
    } catch (err) {
      console.error("Notification Setup Error:", err);
    }
  };

  useEffect(() => {
    if (drank >= goal && !hasCelebrated) {
      const celebrate = async () => {
        try {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Goal Achieved! 🎉",
              body: "Amazing! You've reached 3200ml. All reminders cleared for today.",
            },
            trigger: null, 
          });
          await Notifications.cancelAllScheduledNotificationsAsync();
          setHasCelebrated(true);
        } catch (err) {
          console.log(err);
        }
      };
      celebrate();
    } else if (drank < goal && hasCelebrated) {
      setHasCelebrated(false);
      setupReminders();
    }
  }, [drank]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    setupReminders();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startTimestamp = Timestamp.fromDate(startOfToday);
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

  const logWater = async (amount: number) => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      await addDoc(collection(db, 'users', user.uid, 'logs'), {
        amount: amount,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      Alert.alert("Error", "Failed to save data.");
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Logout", 
        style: 'destructive', 
        onPress: async () => {
          await Notifications.cancelAllScheduledNotificationsAsync();
          signOut(auth);
        } 
      }
    ]);
  };

  const confirmAdd = () => {
    Alert.alert("Add Water", "Do you want to add 200ml to your daily intake?", [
      { text: "No", style: "cancel" },
      { text: "Yes, Add", onPress: () => logWater(200) }
    ]);
  };

  return (
    <SafeAreaView 
      className="flex-1 bg-white dark:bg-slate-900" 
      style={{ paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0 }}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6">
        
        <View className="flex-row items-center justify-between mt-4 mb-8 w-full">
          <TouchableOpacity onPress={handleLogout} className="p-2 bg-blue-50 dark:bg-slate-800 rounded-full">
            <LogOut size={20} color={isDark ? "#60A5FA" : "#1e3a8a"} />
          </TouchableOpacity>
          <View className="flex-row items-center space-x-2 bg-blue-50 dark:bg-slate-800 px-3 py-1 rounded-full border border-blue-100 dark:border-slate-700">
            {isDark ? <Moon size={16} color="#60A5FA" /> : <Sun size={16} color="#F59E0B" />}
            <Switch value={isDark} onValueChange={toggleColorScheme} />
          </View>
        </View>

        <View className="items-center">
          <Text className="text-blue-900 dark:text-white text-xl font-bold mb-6">Daily Progress</Text>
          {loading ? (
            <View className="h-64 justify-center"><ActivityIndicator size="large" color="#2563EB" /></View>
          ) : (
            <WaveCircle percentage={percentage} />
          )}

          <View className="mt-16 items-center bg-blue-50 dark:bg-slate-800 p-8 rounded-[40px] w-full border border-blue-100 dark:border-slate-700">
            <Text className="text-blue-400 uppercase tracking-widest font-bold text-xs mb-2">Current Intake</Text>
            <Text className="text-5xl font-black text-blue-900 dark:text-white">
              {drank}<Text className="text-xl text-blue-400"> ml</Text>
            </Text>
            <View className="h-[2px] w-20 bg-blue-200 dark:bg-slate-600 my-4" />
            <View className="flex-row items-center">
              <Text className="text-gray-500 dark:text-gray-400 font-medium">Goal: {goal}ml </Text>
            </View>
          </View>

          <View className="flex-col gap-4 mt-8 w-full">
            <TouchableOpacity 
              onPress={confirmAdd}
              className="w-full bg-blue-600 py-6 rounded-3xl items-center active:bg-blue-700 shadow-lg"
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