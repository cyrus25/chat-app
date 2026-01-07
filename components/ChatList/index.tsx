import { useRef } from "react";
import { FlatList, StyleSheet, View } from "react-native";

export default function ChatList({ messages, user, renderMessage }) {
  const flatListRef = useRef(null);

  const scrollToBottom = (isAnimated = false) => {
    if (flatListRef?.current) {
      flatListRef?.current?.scrollToEnd({ animated: true });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-end",
          paddingBottom: 12,
        }}
        onContentSizeChange={() => {
          scrollToBottom(true);
        }}
        onEndReached={() => {
          scrollToBottom();
        }}
        renderItem={renderMessage}
        data={messages}
        ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
