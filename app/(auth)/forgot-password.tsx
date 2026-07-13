import React, { useState } from "react";
import {
  View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Colors } from "../../src/theme";
import { Input } from "../../src/components/ui/Input";
import { Button } from "../../src/components/ui/Button";
import { useAuth } from "../../src/auth/useAuth";
import { forgotPasswordSchema, ForgotPasswordFormData } from "../../src/utils/validation";

export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await resetPassword(data.email);
      setSent(true);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to send reset email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
      <LinearGradient colors={["#0A1628", "#0F172A"]} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 px-8 pt-20">
            <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-2xl items-center justify-center mb-8" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
              <Ionicons name="arrow-back" size={22} color={Colors.white} />
            </TouchableOpacity>
            <View className="w-16 h-16 rounded-2xl items-center justify-center mb-6" style={{ backgroundColor: "rgba(245, 158, 11, 0.15)" }}>
              <Ionicons name="lock-open-outline" size={32} color={Colors.warning} />
            </View>
            <Text className="text-[32px] font-inter-extrabold text-white mb-2 tracking-tight">Reset Password</Text>
            <Text className="text-base font-inter-regular text-white/50 mb-10">
              Enter your email and we'll send you reset instructions.
            </Text>

            {sent ? (
              <View className="items-center py-8">
                <View className="w-20 h-20 rounded-full items-center justify-center mb-6" style={{ backgroundColor: "rgba(34, 197, 94, 0.15)" }}>
                  <Ionicons name="checkmark-circle-outline" size={44} color={Colors.success} />
                </View>
                <Text className="text-xl font-inter-bold text-white text-center mb-2">Email Sent</Text>
                <Text className="text-base font-inter-regular text-white/50 text-center mb-8">
                  Check your inbox for instructions.
                </Text>
                <Button title="Back to Sign In" onPress={() => router.push("/login")} />
              </View>
            ) : (
              <>
                <Controller control={control} name="email" render={({ field: { onChange, onBlur, value } }) => (
                  <Input label="Email" placeholder="you@example.com" leftIcon="mail-outline" keyboardType="email-address" autoCapitalize="none" autoComplete="email" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.email?.message} />
                )} />
                <Button title="Send Reset Link" onPress={handleSubmit(onSubmit)} loading={isLoading} />
                <View className="flex-row justify-center mt-8">
                  <TouchableOpacity onPress={() => router.push("/login")}>
                    <Text className="text-base font-inter-semibold" style={{ color: Colors.primary }}>Back to Sign In</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
