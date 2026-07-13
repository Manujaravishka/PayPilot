import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  StyleSheet,
  TouchableOpacityProps,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, Radius } from "../../theme";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  size = "lg",
  loading = false,
  disabled,
  icon,
  style,
  ...props
}) => {
  const isDisabled = disabled || loading;
  const sizeStyle = sizes[size];
  const textSize = textSizes[size];

  if (variant === "primary") {
    return (
      <TouchableOpacity
        disabled={isDisabled}
        activeOpacity={0.8}
        {...props}
      >
        <LinearGradient
          colors={Colors.primaryGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.base,
            sizeStyle,
            isDisabled && styles.disabled,
            style,
          ]}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} size="small" />
          ) : (
            <View className="flex-row items-center gap-2">
              {icon}
              <Text style={[styles.text, { fontSize: textSize }]}>
                {title}
              </Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === "outline") {
    return (
      <TouchableOpacity
        disabled={isDisabled}
        activeOpacity={0.7}
        style={[
          styles.base,
          styles.outline,
          sizeStyle,
          isDisabled && styles.disabled,
          style as any,
        ]}
        {...props}
      >
        {loading ? (
          <ActivityIndicator color={Colors.primary} size="small" />
        ) : (
          <View className="flex-row items-center gap-2">
            {icon}
            <Text style={[styles.outlineText, { fontSize: textSize }]}>
              {title}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.base,
        sizeStyle,
        isDisabled && styles.disabled,
        variant === "secondary" && { backgroundColor: Colors.secondary },
        style as any,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "secondary" ? Colors.white : Colors.primary}
          size="small"
        />
      ) : (
        <View className="flex-row items-center gap-2">
          {icon}
          <Text
            style={[
              styles.text,
              {
                fontSize: textSize,
                color: variant === "secondary" ? Colors.white : Colors.primary,
              },
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const sizes = {
  sm: { paddingVertical: 10, paddingHorizontal: 16 } as const,
  md: { paddingVertical: 14, paddingHorizontal: 20 } as const,
  lg: { paddingVertical: 16, paddingHorizontal: 24 } as const,
};

const textSizes = {
  sm: 13,
  md: 15,
  lg: 15,
};

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.lg,
  },
  text: {
    fontFamily: "Inter_600SemiBold",
    color: Colors.white,
  },
  outline: {
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.transparent,
  },
  outlineText: {
    fontFamily: "Inter_600SemiBold",
    color: Colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
});
