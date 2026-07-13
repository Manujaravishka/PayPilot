import React from "react";
import { View, Text } from "react-native";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: "sm" | "md";
}

const VARIANT_STYLES: Record<BadgeVariant, { bg: string; text: string }> = {
  success: { bg: "#22C55E20", text: "#22C55E" },
  warning: { bg: "#F59E0B20", text: "#F59E0B" },
  danger: { bg: "#EF444420", text: "#EF4444" },
  info: { bg: "#00A65120", text: "#00A651" },
  neutral: { bg: "#64748B20", text: "#64748B" },
};

export const Badge: React.FC<BadgeProps> = ({ label, variant = "neutral", size = "sm" }) => {
  const s = VARIANT_STYLES[variant];
  const isSmall = size === "sm";
  return (
    <View
      style={{
        backgroundColor: s.bg,
        paddingHorizontal: isSmall ? 8 : 12,
        paddingVertical: isSmall ? 3 : 5,
        borderRadius: 100,
        alignSelf: "flex-start",
      }}
    >
      <Text
        style={{
          color: s.text,
          fontSize: isSmall ? 11 : 13,
          fontFamily: "Inter_600SemiBold",
        }}
      >
        {label}
      </Text>
    </View>
  );
};
