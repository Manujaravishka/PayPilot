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
import { registerSchema, RegisterFormData } from "../../src/utils/validation";

export default function RegisterScreen() {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { displayName: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await register(data);
      router.replace("/dashboard");
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message || "Please try again.");
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
            <View className="w-14 h-14 rounded-2xl items-center justify-center mb-6" style={{ backgroundColor: "rgba(0, 166, 81, 0.15)" }}>
              <Ionicons name="person-add-outline" size={28} color={Colors.primary} />
            </View>
            <Text className="text-[32px] font-inter-extrabold text-white mb-2 tracking-tight">Create Account</Text>
            <Text className="text-base font-inter-regular text-white/50 mb-10">
              Start your journey to financial freedom
            </Text>

            <Controller control={control} name="displayName" render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Full Name" placeholder="John Doe" leftIcon="person-outline" autoCapitalize="words" autoComplete="name" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.displayName?.message} />
            )} />
            <Controller control={control} name="email" render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Email" placeholder="you@example.com" leftIcon="mail-outline" keyboardType="email-address" autoCapitalize="none" autoComplete="email" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.email?.message} />
            )} />
            <Controller control={control} name="password" render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Password" placeholder="Create a password" leftIcon="lock-closed-outline" isPassword value={value} onChangeText={onChange} onBlur={onBlur} error={errors.password?.message} />
            )} />
            <Controller control={control} name="confirmPassword" render={({ field: { onChange, onBlur, value } }) => (
              <Input label="Confirm Password" placeholder="Confirm your password" leftIcon="lock-closed-outline" isPassword value={value} onChangeText={onChange} onBlur={onBlur} error={errors.confirmPassword?.message} />
            )} />

            <Button title="Create Account" onPress={handleSubmit(onSubmit)} loading={isLoading} className="mt-2" />
            <View className="flex-row justify-center mt-8 mb-8">
              <Text className="text-base font-inter-regular text-white/50">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text className="text-base font-inter-semibold" style={{ color: Colors.primary }}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
