import React, { useEffect, useRef } from "react";
import { Animated, Text, TextStyle } from "react-native";

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
  style?: any;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  prefix = "$",
  suffix = "",
  decimals = 0,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [value]);

  return (
    <Animated.Text style={style}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </Animated.Text>
  );
};