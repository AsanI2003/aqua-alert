import { Trash2, Droplet } from "lucide-react-native";
import React, { useState, useEffect } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StatusBar as RNStatusBar,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
} from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import Reanimated, {
  FadeInRight,
  FadeOutLeft,
  Layout,
} from "react-native-reanimated";

import { auth, db } from '@/services/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  Timestamp, 
  doc, 
  deleteDoc 
} from 'firebase/firestore';

export default function TodayScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startTimestamp = Timestamp.fromDate(startOfToday);

    const q = query(
      collection(db, 'users', user.uid, 'logs'),
      where('timestamp', '>=', startTimestamp),
      orderBy('timestamp', 'desc') 
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedLogs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLogs(fetchedLogs);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteLog = async (id: string) => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'logs', id));
    } catch (error) {
      Alert.alert("Error", "Could not delete this log.");
    }
  };

  const confirmDelete = (id: string) => {
    Alert.alert("Delete Log", "Remove this entry?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => handleDeleteLog(id),
        style: "destructive",
      },
    ]);
  };

  const formatTime = (ts: any) => {
    if (!ts) return "";
    const date = ts.toDate();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderLogItem = ({ item }: { item: any }) => (
    <Reanimated.View
      entering={FadeInRight}
      exiting={FadeOutLeft}
      layout={Layout.springify()}
    >
      <View className="flex-row bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden items-center h-[85px]">
        <View className="flex-1 pl-5">
          <Text className="text-[#1E3A8A] dark:text-white font-bold text-lg">{item.amount}ml Added</Text>
          <Text className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{formatTime(item.timestamp)}</Text>
        </View>
        <Droplet color="#3B82F6" size={24} className="mr-3" />
        <TouchableOpacity
          onPress={() => confirmDelete(item.id)}
          className="bg-red-500 h-full w-[65px] justify-center items-center"
        >
          <Trash2 color="white" size={20} />
        </TouchableOpacity>
      </View>
    </Reanimated.View>
  );

  return (
    <SafeAreaView 
      className="flex-1 bg-white dark:bg-slate-900"
      style={{ paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0 }}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <View className="px-6 pt-5 pb-2 flex-row justify-between items-baseline">
        <Text className="text-[28px] font-black text-[#1E3A8A] dark:text-white">Today's Logs</Text>
        <Text className="text-[#60A5FA] font-bold text-sm">{logs.length} Entries</Text>
      </View>

      {loading ? (
        <View className="items-center justify-center mt-24">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id}
          renderItem={renderLogItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 25, paddingTop: 10, paddingBottom: 100 }}
          ItemSeparatorComponent={() => <View className="h-3" />}
          ListEmptyComponent={
            <View className="items-center justify-center mt-24">
              <Text className="text-slate-400 dark:text-slate-500 italic">No logs recorded yet, mate!</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}