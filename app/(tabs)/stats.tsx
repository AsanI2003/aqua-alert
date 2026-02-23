import { Check } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { DimensionValue, SafeAreaView, Text, View, ActivityIndicator } from "react-native";
import { auth, db } from '@/services/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, // Real-time!
  Timestamp, 
  limit, 
  getDocs 
} from 'firebase/firestore';

export default function StatsScreen() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any[]>([]);
  const [weeklyAvg, setWeeklyAvg] = useState(0);
  const [comparison, setComparison] = useState<number | null>(null);
  const [hasHistory, setHasHistory] = useState(false);
  const [hasCurrentLogs, setHasCurrentLogs] = useState(false);
  
  const GOAL = 3200;

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // 1. One-time check for history 
    const checkHistory = async () => {
      const historyQuery = query(collection(db, 'users', user.uid, 'logs'), limit(1));
      const historySnap = await getDocs(historyQuery);
      setHasHistory(!historySnap.empty);
    };
    checkHistory();

    // 2. Setup Real-time Listener for the last 14 days
    const now = new Date();
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(now.getDate() - 13);
    fourteenDaysAgo.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, 'users', user.uid, 'logs'),
      where('timestamp', '>=', Timestamp.fromDate(fourteenDaysAgo))
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allLogs = snapshot.docs.map(doc => doc.data());
      setHasCurrentLogs(allLogs.length > 0);

      // Process Daily Totals
      const dailyTotals: { [key: string]: number } = {};
      const todayKey = new Date().toDateString();

      // Initialize all 14 days
      for (let i = 0; i < 14; i++) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        dailyTotals[d.toDateString()] = 0;
      }

      allLogs.forEach(log => {
        const dateKey = log.timestamp.toDate().toDateString();
        if (dailyTotals[dateKey] !== undefined) {
          dailyTotals[dateKey] += log.amount;
        }
      });

      // Prepare Chart Data (Last 7 Days)
      let thisWeekSum = 0;
      const chartData = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const total = dailyTotals[d.toDateString()] || 0;
        thisWeekSum += total;
        
        const perc = Math.min(Math.round((total / GOAL) * 100), 100);
        chartData.unshift({
          day: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
          h: `${perc}%` as DimensionValue,
          label: `${perc}%`,
          isToday: d.toDateString() === todayKey // Check for highlight today
        });
      }

      // Calculate Last Week
      let lastWeekSum = 0;
      for (let i = 7; i < 14; i++) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        lastWeekSum += dailyTotals[d.toDateString()] || 0;
      }

      const thisAvg = thisWeekSum / 7;
      const lastAvg = lastWeekSum / 7;

      setStats(chartData);
      setWeeklyAvg(Math.round(thisAvg));

      if (thisWeekSum > 0 && lastWeekSum > 0) {
        setComparison(Math.round(((thisAvg - lastAvg) / lastAvg) * 100));
      } else {
        setComparison(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getStatus = () => {
    if (comparison === null && !hasCurrentLogs && !hasHistory) return { text: "Pending", color: "text-blue-200" };
    if (comparison === null) return { text: "Pending", color: "text-blue-200" };
    
    const avgPerc = (weeklyAvg / GOAL) * 100;
    if (avgPerc >= 75) return { text: "Excellent", color: "text-green-300" };
    if (avgPerc >= 50) return { text: "Good", color: "text-blue-200" };
    return { text: "Bad", color: "text-red-300" };
  };

  const status = getStatus();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-6">
        <Text className="text-3xl font-black text-blue-900 mb-4">Last 7 days</Text>

        <View className="flex-1 bg-blue-50/50 p-6 rounded-[40px] border border-blue-100 flex-row items-end justify-between">
          {stats.map((data, index) => (
            <View key={index} className="items-center justify-end h-full w-[12%]">
              <View
                style={{ height: data.h }}
                className={`w-full rounded-full mb-2 items-center justify-start pt-2 shadow-sm ${
                  data.h === "100%" ? "bg-blue-500" : "bg-blue-200"
                }`}
              >
                {data.h === "100%" ? <Check color="white" size={16} strokeWidth={4} /> : 
                <Text className="text-[10px] text-blue-900 font-bold">{data.label}</Text>}
              </View>
              
              {/* Highlight today's date */}
              <View className={`${data.isToday ? 'bg-blue-600 w-6 h-6 rounded-full items-center justify-center' : ''}`}>
                 <Text className={`${data.isToday ? 'text-white' : 'text-blue-900'} font-bold text-xs`}>
                    {data.day}
                 </Text>
              </View>
            </View>
          ))}
        </View>

        <View className="h-4" />

        <View className="flex-1 bg-blue-600 p-8 rounded-[40px] justify-center shadow-xl">
          <Text className="text-white font-black text-3xl mb-2">Weekly Average</Text>
          <Text className="text-blue-100 text-lg opacity-90 leading-6">
            {comparison !== null ? (
              <>You are drinking <Text className="font-bold text-white">{comparison >= 0 ? `${comparison}% more` : `${Math.abs(comparison)}% less`}</Text> than last week!</>
            ) : (
              "You need to continue your journey to get this"
            )}
          </Text>

          <View className="mt-8 pt-6 border-t border-white/10 flex-row justify-between">
            <View>
              <Text className="text-blue-200 text-xs uppercase font-bold tracking-widest">Target</Text>
              <Text className="text-white text-xl font-bold">3.2L / Day</Text>
            </View>
            <View className="items-end">
              <Text className="text-blue-200 text-xs uppercase font-bold tracking-widest">Weekly Status</Text>
              <Text className={`${status.color} text-xl font-bold`}>{status.text}</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}