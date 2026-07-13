import React from "react";
import { View, Text, Image } from "react-native";

interface AvatarProps {
  name: string;
  size?: number;
  imageUrl?: string | null;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const BG_COLORS = [
  "#00A651", "#5856D6", "#EC4899", "#EF4444",
  "#F59E0B", "#22C55E", "#06B6D4", "#6366F1",
  "#8B5CF6", "#14B8A6",
];

function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return BG_COLORS[Math.abs(hash) % BG_COLORS.length];
}

export const Avatar: React.FC<AvatarProps> = ({ name, size = 44, imageUrl }) => {
  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    );
  }
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: getColor(name),
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          color: "#FFFFFF",
          fontSize: size * 0.36,
          fontFamily: "Inter_600SemiBold",
        }}
      >
        {getInitials(name)}
      </Text>
    </View>
  );
};
