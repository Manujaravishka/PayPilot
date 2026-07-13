import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../theme";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "wallet-outline",
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center mb-6">
        <Ionicons name={icon} size={36} color={Colors.primary} />
      </View>
      <Text className="text-xl font-inter-bold text-textPrimary-light dark:text-textPrimary-dark text-center mb-2">
        {title}
      </Text>
      {description && (
        <Text className="text-base font-inter-regular text-textSecondary-light dark:text-textSecondary-dark text-center leading-6">
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <View className="mt-8 w-full">
          <Button title={actionLabel} onPress={onAction} />
        </View>
      )}
    </View>
  );
};
