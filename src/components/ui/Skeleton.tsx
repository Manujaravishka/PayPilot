import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        { width: width as any, height, borderRadius, backgroundColor: "#1E293B", opacity },
        style,
      ]}
    />
  );
};

export const SkeletonCard: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <View style={{ backgroundColor: "#1E293B", borderRadius: 16, padding: 20, marginBottom: 12 }}>
    <Skeleton width="40%" height={14} style={{ marginBottom: 16 }} />
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        width={`${Math.random() * 40 + 50}%`}
        height={12}
        style={{ marginBottom: 8 }}
      />
    ))}
  </View>
);
