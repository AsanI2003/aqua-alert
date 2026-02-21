import { Check } from "lucide-react-native";
import React from "react";
import { DimensionValue, SafeAreaView, Text, View } from "react-native";

export default function StatsScreen() {
  const weeklyData: { day: string; h: DimensionValue; label: string }[] = [
    { day: "M", h: "60%", label: "60%" },
    { day: "T", h: "80%", label: "80%" },
    { day: "W", h: "45%", label: "45%" },
    { day: "T", h: "90%", label: "90%" },
    { day: "F", h: "70%", label: "70%" },
    { day: "S", h: "30%", label: "30%" },
    { day: "S", h: "100%", label: "100%" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-6">
        <Text className="text-3xl font-black text-blue-900 mb-4">
          Last 7 days
        </Text>

        {/* 1. CHART PART (Top 50%) */}
        <View className="flex-1 bg-blue-50/50 p-6 rounded-[40px] border border-blue-100 flex-row items-end justify-between">
          {weeklyData.map((data, index) => (
            <View
              key={index}
              className="items-center justify-end h-full w-[12%]"
            >
              {/* The Bar */}
              <View
                style={{ height: data.h }}
                className={`w-full rounded-full mb-2 items-center justify-start pt-2 shadow-sm ${
                  data.h === "100%" ? "bg-blue-500" : "bg-blue-100"
                }`}
              >
                {/* Logic: Show Check if 100%, else show Label */}
                {data.h === "100%" ? (
                  <Check color="white" size={16} strokeWidth={4} />
                ) : (
                  <Text className="text-[10px] text-black font-bold align-middle">
                    {data.label}
                  </Text>
                )}
              </View>

              <Text className="text-blue-900 font-bold text-xs">
                {data.day}
              </Text>
            </View>
          ))}
        </View>

        {/* GAP BETWEEN THEM */}
        <View className="h-4" />

        {/* 2. INFO CARD (Bottom 50%) */}
        <View className="flex-1 bg-blue-600 p-8 rounded-[40px] justify-center shadow-xl">
           <Text className="text-white font-black text-3xl mb-2">
            Weekly Average
          </Text>
          <Text className="text-blue-100 text-lg opacity-90 leading-6">
            You are drinking{" "}
            <Text className="font-bold text-white">15% more</Text> than last
            week! Keep it up, mate!
          </Text>

          <View className="mt-8 pt-6 border-t border-white/10 flex-row justify-between">
            <View>
              <Text className="text-blue-200 text-xs uppercase font-bold tracking-widest">
                Target
              </Text>
              <Text className="text-white text-xl font-bold">3.2L / Day</Text>
            </View>
            <View className="items-end">
              <Text className="text-blue-200 text-xs uppercase font-bold tracking-widest">
                Weekly Status
              </Text>
              <Text className="text-green-300 text-xl font-bold">Great</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
