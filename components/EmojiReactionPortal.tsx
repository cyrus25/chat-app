import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const EMOJI_BAR_HEIGHT = 44;

export default function EmojiReactionPortal({
  emojiUI,
  onSelect,
  onClose,
}: any) {
  if (!emojiUI) return null;

  const { x, y, width } = emojiUI.layout;

  const top = Math.max(10, y - EMOJI_BAR_HEIGHT - 8);
  const left = Math.min(x, SCREEN_WIDTH - width - 10);

  return (
    <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
      <View style={[styles.emojiBar, { top, left }]}>
        {["❤️", "😂", "😮", "😢", "🙏"].map((emoji) => (
          <Text
            key={emoji}
            style={styles.emoji}
            onPress={() => onSelect(emojiUI.message, emoji)}
          >
            {emoji}
          </Text>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  emojiBar: {
    position: "absolute",
    flexDirection: "row",
    backgroundColor: "#222",
    borderRadius: 24,
    paddingHorizontal: 10,
    paddingVertical: 6,
    zIndex: 9999,
    elevation: 20,
  },
  emoji: {
    fontSize: 22,
    marginHorizontal: 6,
  },
});
