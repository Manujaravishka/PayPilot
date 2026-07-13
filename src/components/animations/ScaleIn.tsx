import React, { useEffect, useRef } from "react";
import { Animated, ViewProps } from "react-native";

interface ScaleInProps extends ViewProps {
  delay?: number;
  duration?: number;
}

export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  delay = 0,
  duration = 400,
  style,
  ...props
}) => {
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: duration / 2,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scale, opacity, duration, delay]);

  return (
    <Animated.View
      style={[{ opacity, transform: [{ scale }] }, style]}
      {...props}
    >
      {children}
    </Animated.View>
  );
};