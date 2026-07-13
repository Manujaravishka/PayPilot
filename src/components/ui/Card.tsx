import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors, Radius, Shadow } from "../../theme";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: any;
}

export const Card: React.FC<CardProps> = ({ children, className, style }) => {
  return (
    <View style={[styles.card, style]} className={className}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface.light,
    borderRadius: Radius.xl,
    padding: 20,
    ...Shadow.md,
  },
});
