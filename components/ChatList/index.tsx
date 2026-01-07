import { forwardRef, useRef } from "react";
import { FlatList, StyleSheet, View } from "react-native";

const Comp = forwardRef(function Comp({ renderMessage, messages, user }, ref) {
  const flatListRef = useRef(null);

  return (
    <View style={styles.container}>
      <FlatList
        ref={ref}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-end",
          paddingBottom: 20,
        }}
        onContentSizeChange={() => {
          //scrollToBottom(true);
        }}
        onEndReached={() => {
          //  scrollToBottom();
        }}
        renderItem={renderMessage}
        data={messages}
        ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Comp;
