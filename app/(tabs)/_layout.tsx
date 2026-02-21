import { Tabs } from 'expo-router';
import { Home, ClipboardList, BarChart3 } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#2563eb', // Blue-600
      tabBarInactiveTintColor: '#94a3b8', // Slate-400
      tabBarStyle: { height: 70, paddingBottom: 10, paddingTop: 10 },
      headerShown: false, // Hide top header for a cleaner look
    }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="today"
        options={{
          title: 'Today',
          tabBarIcon: ({ color }) => <ClipboardList size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Weekly',
          tabBarIcon: ({ color }) => <BarChart3 size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}