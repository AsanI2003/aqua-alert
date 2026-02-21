import { Trash2, Droplet } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Reanimated, {
  FadeInRight,
  FadeOutLeft,
  Layout,
} from "react-native-reanimated";

export default function TodayScreen() {
  const [logs, setLogs] = useState([
    { id: "1", amount: 250, time: "2:30 PM" },
    { id: "2", amount: 500, time: "12:15 PM" },
    { id: "3", amount: 250, time: "11:00 AM" },
    { id: "4", amount: 300, time: "9:45 AM" },
    { id: "5", amount: 250, time: "8:30 AM" },
    { id: "6", amount: 250, time: "7:00 AM" },
    { id: "7", amount: 250, time: "6:15 AM" },
    { id: "8", amount: 250, time: "5:30 AM" },
    { id: "9", amount: 250, time: "4:45 AM" },
  ]);

  const confirmDelete = (id: string) => {
    Alert.alert("Delete Log", "Remove this entry?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => setLogs((prev) => prev.filter((l) => l.id !== id)),
        style: "destructive",
      },
    ]);
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
          <Text style={styles.logAmount}>Cup Added</Text>
          <Text style={styles.logTime}>{item.time}</Text>
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

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={renderLogItem}
        showsVerticalScrollIndicator={false}
        // Removed flexGrow: 1 to stop items from stretching
        contentContainerStyle={styles.listPadding}
        // Consistent gap that only exists BETWEEN items
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No logs recorded yet, mate!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { 
    flex: 1, 
    backgroundColor: "#FFFFFF" 
  },
  headerArea: {
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline'
  },
  listTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1E3A8A",
  },
  statsText: {
    color: "#60A5FA",
    fontWeight: "bold",
    fontSize: 14,
  },
  listPadding: { 
    paddingHorizontal: 25, 
    paddingTop: 10, 
    paddingBottom: 100 // Extra room for bottom tabs
  },
  logWrapper: { 
    // No flex: 1 here!
  },
  logCard: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    alignItems: "center",
    // Fixed height ensures gaps stay consistent
    height: 85, 
  },
  logInfo: { 
    flex: 1, 
    paddingLeft: 20 
  },
  logAmount: { 
    color: "#1E3A8A", 
    fontWeight: "bold", 
    fontSize: 18 
  },
  logTime: { 
    color: "#64748B", 
    fontSize: 13, 
    marginTop: 2 
  },
  deleteButton: {
    backgroundColor: "#EF4444",
    height: "100%",
    width: 65,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: { 
    alignItems: "center", 
    justifyContent: "center", 
    marginTop: 100 
  },
  emptyText: { 
    color: "#94A3B8", 
    fontStyle: "italic" 
  },
});