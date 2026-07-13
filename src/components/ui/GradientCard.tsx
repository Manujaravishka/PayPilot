import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, Radius } from "../../theme";

interface GradientCardProps {
  colors?: readonly [string, string];
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

export const GradientCard: React.FC<GradientCardProps> = ({
  colors = Colors.primaryGradient,
  title,
  subtitle,
  children,
  className,
}) => {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className={className}
      style={{ borderRadius: Radius.xxl, padding: 24 }}
    >
      {title && (
        <Text className="text-xl font-inter-bold text-white mb-1">
          {title}
        </Text>
      )}
      {subtitle && (
        <Text className="text-sm font-inter-regular text-white/70">
          {subtitle}
        </Text>
      )}
      {children}
    </LinearGradient>
  );
};
