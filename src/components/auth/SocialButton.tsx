import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius } from "../../theme";

interface SocialButtonProps {
  provider: "google" | "apple";
  onPress: () => void;
  loading?: boolean;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  onPress,
  loading = false,
}) => {
  if (provider === "google") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={loading}
        activeOpacity={0.7}
        style={styles.google}
      >
        <Ionicons
          name="logo-google"
          size={22}
          color={Colors.textPrimary.light}
          style={{ marginRight: 10 }}
        />
        <Text className="text-base font-inter-semibold text-textPrimary-light">
          Continue with Google
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.7}
      style={styles.apple}
    >
      <Ionicons
        name="logo-apple"
        size={22}
        color={Colors.white}
        style={{ marginRight: 10 }}
      />
      <Text className="text-base font-inter-semibold text-white">
        Continue with Apple
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  google: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border.light,
    height: 56,
    backgroundColor: Colors.surface.light,
    ...({
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    } as any),
  },
  apple: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.lg,
    height: 56,
    backgroundColor: Colors.black,
  },
});
