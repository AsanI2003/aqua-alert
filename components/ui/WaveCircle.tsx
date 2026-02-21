import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { DimensionValue } from 'react-native';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function WaveCircle({ percentage = 0 }) {
  const translateX = useSharedValue(0);

  useEffect(() => {
    // We animate from 0 to -400 (the full width of our double-wave)
    translateX.value = withRepeat(
      withTiming(-400, {
        duration: 4000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const animatedProps = useAnimatedProps(() => {
    // This creates two identical waves side-by-side (Total width 800)
    // M (Move) Q (Curve) T (Smooth continuation)
    const path = "M0 20 Q100 0 200 20 T400 20 T600 20 T800 20 V100 H0 Z";
    return {
      d: path,
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View className="items-center justify-center">
      <View className="w-72 h-72 rounded-full bg-white border-[8px] border-blue-100 overflow-hidden items-center justify-center shadow-2xl">
        
        {/* Animated Water Level Container */}
        <View
          className="absolute bottom-0 w-full bg-blue-500"
          style={{ height: `${percentage}%` as DimensionValue }}
        >
          {/* The Wave SVG Header */}
          <View style={{ position: "absolute", top: -35, width: "100%" }}>
            <Svg height="60" width="100%" viewBox="0 0 400 100" preserveAspectRatio="none">
              <AnimatedPath
                animatedProps={animatedProps}
                fill="#3b82f6"
              />
            </Svg>
          </View>
        </View>

        {/* Text UI */}
        <View className="z-50 items-center">
          <Text className="text-7xl font-black text-blue-900">{percentage}%</Text>
          <Text className="text-blue-400 font-bold uppercase tracking-widest text-xs">
            Hydrated
          </Text>
        </View>
      </View>
    </View>
  );
}