import React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { Colors } from "../../theme";

interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
  size?: "small" | "large";
}

export const Loading: React.FC<LoadingProps> = ({
  fullScreen = true,
  message,
  size = "large",
}) => {
  const spinner = (
    <View className="items-center justify-center">
      <ActivityIndicator size={size} color={Colors.primary} />
      {message && (
        <Text className="mt-4 text-base font-inter-regular text-textSecondary-light text-center">
          {message}
        </Text>
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: "#F8FAFC" }}>
        {spinner}
      </View>
    );
  }

  return <View className="items-center justify-center py-8">{spinner}</View>;
};
