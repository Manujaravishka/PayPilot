import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Colors } from "../../src/theme";
import { Input } from "../../src/components/ui/Input";
import { Button } from "../../src/components/ui/Button";
import { SocialButton } from "../../src/components/auth/SocialButton";
import { useAuth } from "../../src/auth/useAuth";
import { authConfig } from "../../src/auth/config";
import { loginSchema, LoginFormData } from "../../src/utils/validation";

export default function LoginScreen() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { control, handleSubmit, formState: { errors }, setValue } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data);
      router.replace("/dashboard");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseDemoAccount = async () => {
    setIsLoading(true);
    try {
      await login({ email: "admin@paypilot.com", password: "Admin@123" });
      router.replace("/dashboard");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      if (!authConfig.isFirebaseConfigured) {
        fillDemoCredentials("demo");
        setGoogleLoading(false);
        return;
      }
      const { GoogleAuthProvider, signInWithCredential } = await import("firebase/auth");
      const { auth } = await import("../../src/services/firebase");
      const { GoogleSignin } = await import("@react-native-google-signin/google-signin");
      if (auth) {
        GoogleSignin.configure({
          webClientId: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
        });
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const idToken = userInfo.data?.idToken || (userInfo as any).idToken;
        if (idToken) {
          const credential = GoogleAuthProvider.credential(idToken);
          await signInWithCredential(auth, credential);
          router.replace("/dashboard");
        }
      }
    } catch (err: any) {
      if (err.message?.includes("native module")) {
        fillDemoCredentials("demo");
        Alert.alert("Info", "Google Sign-In native module not available. Demo credentials filled.");
      } else {
        Alert.alert("Error", err.message || "Google Sign-In failed");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const fillDemoCredentials = (type: "demo" | "user") => {
    const creds = {
      demo: { email: "demo@paypilot.com", password: "Demo@123" },
      user: { email: "user@paypilot.com", password: "User@123" },
    };
    const c = creds[type];
    setValue("email", c.email);
    setValue("password", c.password);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <LinearGradient colors={["#0A1628", "#0F172A"]} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 px-6 pt-16">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-2xl items-center justify-center mb-8"
              style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
            >
              <Ionicons name="arrow-back" size={22} color={Colors.white} />
            </TouchableOpacity>

            <View className="mb-10">
              <View className="w-14 h-14 rounded-2xl items-center justify-center mb-6"
                style={{ backgroundColor: "rgba(0, 166, 81, 0.15)" }}
              >
                <Ionicons name="wallet-outline" size={28} color={Colors.primary} />
              </View>
              <Text className="text-[34px] font-inter-extrabold text-white mb-2 tracking-tight">
                Welcome Back
              </Text>
              <Text className="text-base font-inter-regular text-white/50">
                Sign in to continue managing your finances
              </Text>
              {authConfig.isDemoMode && (
                <View className="mt-3 flex-row items-center">
                  <View className="px-3 py-1.5 rounded-full" style={{ backgroundColor: "rgba(245, 158, 11, 0.15)" }}>
                    <Text className="text-xs font-inter-semibold" style={{ color: "#F59E0B" }}>
                      Demo Mode
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  placeholder="you@example.com"
                  leftIcon="mail-outline"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                />
              )}
            />

            <View className="relative">
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Password"
                    placeholder="Enter your password"
                    leftIcon="lock-closed-outline"
                    isPassword
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                  />
                )}
              />
            </View>

            <TouchableOpacity
              onPress={() => router.push("/forgot-password")}
              className="self-end mb-8"
            >
              <Text className="text-sm font-inter-semibold" style={{ color: Colors.primary }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
            />

            {authConfig.isDemoMode && (
              <>
                <View className="flex-row items-center my-6">
                  <View className="flex-1 h-[1px]" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
                  <Text className="mx-4 text-sm font-inter-regular text-white/40">
                    or try demo
                  </Text>
                  <View className="flex-1 h-[1px]" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
                </View>

                <Button
                  title="Use Demo Account (Admin)"
                  onPress={handleUseDemoAccount}
                  loading={isLoading}
                  variant="outline"
                />

                <View className="flex-row justify-center mt-6 gap-3">
                  <TouchableOpacity
                    onPress={() => fillDemoCredentials("demo")}
                    className="px-4 py-2.5 rounded-xl"
                    style={{ backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}
                  >
                    <Text className="text-xs font-inter-medium text-white/50">Demo User</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => fillDemoCredentials("user")}
                    className="px-4 py-2.5 rounded-xl"
                    style={{ backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}
                  >
                    <Text className="text-xs font-inter-medium text-white/50">Test User</Text>
                  </TouchableOpacity>
                </View>

                <View className="mt-4 rounded-xl p-4" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
                  <Text className="text-xs font-inter-regular text-white/40 mb-2">
                    Quick Demo Credentials:
                  </Text>
                  <Text className="text-[11px] font-inter-medium text-white/50">
                    Demo: demo@paypilot.com / Demo@123
                  </Text>
                  <Text className="text-[11px] font-inter-medium text-white/50">
                    User: user@paypilot.com / User@123
                  </Text>
                </View>
              </>
            )}

            <View className="flex-row items-center my-8">
              <View className="flex-1 h-[1px]" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
              <Text className="mx-4 text-sm font-inter-regular text-white/40">
                or continue with
              </Text>
              <View className="flex-1 h-[1px]" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
            </View>

            <SocialButton provider="google" onPress={handleGoogle} loading={googleLoading} />

            <View className="flex-row justify-center mt-8 mb-12">
              <Text className="text-base font-inter-regular text-white/50">
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text className="text-base font-inter-semibold" style={{ color: Colors.primary }}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
