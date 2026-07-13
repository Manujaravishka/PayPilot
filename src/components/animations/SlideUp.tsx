import React, { useEffect, useRef } from "react";
import { Animated, ViewProps } from "react-native";

interface SlideUpProps extends ViewProps {
  delay?: number;
  duration?: number;
  distance?: number;
}

export const SlideUp: React.FC<SlideUpProps> = ({
  children,
  delay = 0,
  duration = 500,
  distance = 40,
  style,
  ...props
}) => {
  const translateY = useRef(new Animated.Value(distance)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateY, opacity, duration, delay]);

  return (
    <Animated.View
      style={[{ opacity, transform: [{ translateY }] }, style]}
      {...props}
    >
      {children}
    </Animated.View>
  );
};