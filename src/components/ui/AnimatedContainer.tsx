import React, { useEffect, useRef } from "react";
import { Animated, ViewProps } from "react-native";

interface AnimatedContainerProps extends ViewProps {
  animation?: "fadeIn" | "slideUp" | "scaleIn";
  delay?: number;
  duration?: number;
}

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  animation = "fadeIn",
  delay = 0,
  duration = 400,
  style,
  ...props
}) => {
  const value = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(value, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, [value, duration, delay]);

  const getStyle = () => {
    switch (animation) {
      case "slideUp":
        return {
          opacity: value,
          transform: [
            {
              translateY: value.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        };
      case "scaleIn":
        return {
          opacity: value,
          transform: [
            {
              scale: value.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
              }),
            },
          ],
        };
      default:
        return { opacity: value };
    }
  };

  return (
    <Animated.View style={[getStyle(), style]} {...props}>
      {children}
    </Animated.View>
  );
};
