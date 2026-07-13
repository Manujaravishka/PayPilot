import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: { label: string; onPress: () => void };
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, action }) => (
  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 20, fontFamily: "Inter_700Bold", color: "#111827" }}>{title}</Text>
      {subtitle && (
        <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: "#64748B", marginTop: 2 }}>
          {subtitle}
        </Text>
      )}
    </View>
    {action && (
      <TouchableOpacity onPress={action.onPress} style={{ paddingLeft: 12 }}>
        <Text style={{ fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#00A651" }}>
          {action.label}
        </Text>
      </TouchableOpacity>
    )}
  </View>
);
