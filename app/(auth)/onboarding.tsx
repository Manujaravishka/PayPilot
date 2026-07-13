import React, { useRef, useState } from "react";
import { View, Text, Dimensions, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "../../src/theme";
import { ONBOARDING_PAGES } from "../../src/constants";
import { Button } from "../../src/components/ui/Button";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const isLast = currentIndex === ONBOARDING_PAGES.length - 1;

  const handleNext = () => {
    if (isLast) {
      router.replace("/login");
    } else {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  const handleSkip = () => router.replace("/login");

  return (
    <View className="flex-1" style={{ backgroundColor: "#0F172A" }}>
      <LinearGradient colors={["#0A1628", "#0F172A"]} className="flex-1">
        <View className="flex-row justify-end px-6 pt-16">
          {!isLast && (
            <Text
              onPress={handleSkip}
              className="text-base font-inter-semibold text-white/50"
            >
              Skip
            </Text>
          )}
        </View>

        <FlatList
          ref={flatListRef}
          data={ONBOARDING_PAGES}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) =>
            setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))
          }
          scrollEventThrottle={16}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ width, paddingHorizontal: 32 }}>
              <View className="flex-1 items-center justify-center">
                <View
                  className="w-28 h-28 rounded-3xl items-center justify-center mb-12"
                  style={{
                    backgroundColor: "rgba(0, 166, 81, 0.15)",
                    shadowColor: Colors.primary,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.3,
                    shadowRadius: 24,
                    elevation: 10,
                  }}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={52}
                    color={Colors.primary}
                  />
                </View>
                <Text className="text-[34px] font-inter-extrabold text-white text-center mb-4 leading-tight tracking-tight">
                  {item.title}
                </Text>
                <Text className="text-base font-inter-regular text-white/50 text-center leading-7 max-w-sm">
                  {item.description}
                </Text>
              </View>
            </View>
          )}
        />

        <View className="px-8 pb-14">
          <View className="flex-row justify-center mb-8 gap-2">
            {ONBOARDING_PAGES.map((_, i) => (
              <View
                key={i}
                className={`h-2 rounded-full ${
                  i === currentIndex ? "w-8" : "w-2"
                }`}
                style={{
                  backgroundColor: i === currentIndex ? Colors.primary : "rgba(255,255,255,0.15)",
                }}
              />
            ))}
          </View>
          <Button title={isLast ? "Get Started" : "Next"} onPress={handleNext} />
        </View>
      </LinearGradient>
    </View>
  );
}
