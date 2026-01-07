import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const FEEDBACK_CHIPS = ["Inaccurate", "Too Vague", "Too Long"];

export default function Feedback({ onLike, onDislike, currentMessage }) {
  const [selected, setSelected] = useState<"like" | "dislike" | null>(null);
  const [selectedChip, setSelectedChip] = useState<string | null>(null);

  const expand = useSharedValue(0);

  const chipsStyle = useAnimatedStyle(() => ({
    height: expand.value,
    opacity: expand.value === 0 ? 0 : 1,
  }));

  const onPressLike = () => {
    setSelected("like");
    expand.value = withTiming(0);
    onLike(currentMessage?._id);
  };

  const onPressDislike = () => {
    setSelected("dislike");
    expand.value = withTiming(48, { duration: 250 });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Was this helpful?</Text>

      <View style={styles.actions}>
        <ActionButton
          label="👍 Like"
          active={selected === "like"}
          onPress={onPressLike}
        />
        <ActionButton
          label="👎 Dislike"
          active={selected === "dislike"}
          onPress={onPressDislike}
        />
      </View>

      <Animated.View style={[styles.chipsContainer, chipsStyle]}>
        <View style={styles.chipsRow}>
          {FEEDBACK_CHIPS.map((chip) => (
            <FeedbackChip
              key={chip}
              label={chip}
              selected={selectedChip === chip}
              onPress={() => {
                setSelectedChip(chip);
                onDislike(currentMessage?._id, chip);
              }}
            />
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

function ActionButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.actionButton, active && styles.actionButtonActive]}
    >
      <Text style={styles.actionText}>{label}</Text>
    </Pressable>
  );
}

function FeedbackChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#F7F7F7",
    borderRadius: 12,
  },

  title: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
  },

  actions: {
    flexDirection: "row",
    gap: 12,
  },

  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#EAEAEA",
  },

  actionButtonActive: {
    backgroundColor: "#D6E4FF",
  },

  actionText: {
    fontSize: 14,
  },

  chipsContainer: {
    overflow: "hidden",
    marginTop: 8,
  },

  chipsRow: {
    flexDirection: "row",
    gap: 8,
  },

  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#2C2C2C",
  },

  chipSelected: {
    backgroundColor: "#4F46E5",
  },

  chipText: {
    fontSize: 12,
    color: "#EAEAEA",
  },

  chipTextSelected: {
    color: "#FFFFFF",
  },
});
