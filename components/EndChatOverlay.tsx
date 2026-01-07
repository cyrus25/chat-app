import { BlurView } from "expo-blur";
import React from "react";
import { Dimensions, Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

export function EndChatOverlay({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  React.useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withTiming(1, { duration: 200 });
    } else {
      opacity.value = withTiming(0);
      scale.value = withTiming(0.95);
    }
  }, [visible]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, containerStyle]}>
      <BlurView
        intensity={70}
        tint="systemMaterialDark"
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.card, cardStyle]}>
        <Text style={styles.title}>Rate your session</Text>

        <Text style={styles.stars}>⭐ ⭐ ⭐ ⭐ ⭐</Text>

        <Text style={styles.thankYou}>Thank you for chatting!</Text>

        <Pressable style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Done</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    width,
    height,
    zIndex: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "80%",
    padding: 20,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },

  stars: {
    fontSize: 24,
    marginVertical: 12,
  },

  thankYou: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },

  button: {
    marginTop: 8,
    backgroundColor: "#4F46E5",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 24,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
