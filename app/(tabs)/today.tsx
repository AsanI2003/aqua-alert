import { Trash2, Droplet } from "lucide-react-native";
import React, { useState, useEffect } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
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
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // 1. Define the start of today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startTimestamp = Timestamp.fromDate(startOfToday);

    // 2. Build the query
    const q = query(
      collection(db, 'users', user.uid, 'logs'),
      where('timestamp', '>=', startTimestamp),
      orderBy('timestamp', 'desc') // Show newest first
    );

    // 3. Set up real-time listener
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
      // No need to manually update state; onSnapshot handles it
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

  // Helper function to format the Firebase Timestamp
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
      style={styles.logWrapper}
    >
      <View style={styles.logCard}>
        <View style={styles.logInfo}>
          <Text style={styles.logAmount}>{item.amount}ml Added</Text>
          <Text style={styles.logTime}>{formatTime(item.timestamp)}</Text>
        </View>
        <Droplet color="#3B82F6" size={24} style={{ marginRight: 12 }} />
        <TouchableOpacity
          onPress={() => confirmDelete(item.id)}
          style={styles.deleteButton}
        >
          <Trash2 color="white" size={20} />
        </TouchableOpacity>
      </View>
    </Reanimated.View>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.headerArea}>
        <Text style={styles.listTitle}>Today's Logs</Text>
        <Text style={styles.statsText}>{logs.length} Entries</Text>
      </View>

      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id}
          renderItem={renderLogItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listPadding}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No logs recorded yet, mate!</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#FFFFFF" },
  headerArea: { paddingHorizontal: 25, paddingTop: 20, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  listTitle: { fontSize: 28, fontWeight: "900", color: "#1E3A8A" },
  statsText: { color: "#60A5FA", fontWeight: "bold", fontSize: 14 },
  listPadding: { paddingHorizontal: 25, paddingTop: 10, paddingBottom: 100 },
  logWrapper: { },
  logCard: { flexDirection: "row", backgroundColor: "#F8FAFC", borderRadius: 20, borderWidth: 1, borderColor: "#E2E8F0", overflow: "hidden", alignItems: "center", height: 85 },
  logInfo: { flex: 1, paddingLeft: 20 },
  logAmount: { color: "#1E3A8A", fontWeight: "bold", fontSize: 18 },
  logTime: { color: "#64748B", fontSize: 13, marginTop: 2 },
  deleteButton: { backgroundColor: "#EF4444", height: "100%", width: 65, justifyContent: "center", alignItems: "center" },
  emptyContainer: { alignItems: "center", justifyContent: "center", marginTop: 100 },
  emptyText: { color: "#94A3B8", fontStyle: "italic" },
});