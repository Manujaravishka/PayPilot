import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius } from "../../theme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  isPassword = false,
  style,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-inter-medium text-textSecondary-light dark:text-textSecondary-dark mb-2">
          {label}
        </Text>
      )}
      <View
        style={[
          styles.container,
          isFocused && styles.focused,
          !!error && styles.errorBorder,
          style as any,
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={isFocused ? Colors.primary : Colors.textSecondary.light}
            style={{ marginRight: 12 }}
          />
        )}
        <TextInput
          className="flex-1 text-base font-inter-regular text-textPrimary-light dark:text-textPrimary-dark"
          placeholderTextColor={Colors.textSecondary.light}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={Colors.textSecondary.light}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text className="text-xs font-inter-regular text-error mt-1.5 ml-1">
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border.light,
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: Colors.surface.light,
  },
  focused: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  errorBorder: {
    borderColor: Colors.error,
  },
});
