import { ChatItemType } from "@/types";
import Entypo from "@expo/vector-icons/Entypo";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ReplyTo({
  message,
  onCancel,
  showCancel = true,
}: {
  message: ChatItemType;
  onCancel: () => void;
  showCancel: boolean;
}) {
  return (
    <View
      style={[
        styles.replyToContainer,
        {
          marginBottom: !showCancel ? 10 : 0,
        },
      ]}
    >
      <View style={[styles.replyToInfo]}>
        <Text style={styles.name}>{message?.user?.name}</Text>
        <Text style={styles.text}>{message?.text}</Text>
      </View>
      {showCancel && (
        <Pressable style={styles.cancelBtn} onPress={onCancel}>
          <Entypo name="cross" size={24} color="white" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  replyToContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderLeftWidth: 4,
    paddingHorizontal: 15,
    borderColor: "orange",
  },
  replyToInfo: {
    // flex: 1,
    width: "90%",
  },
  name: {
    color: "white",
    fontWeight: "bold",
  },
  cancelBtn: {},
  text: {
    color: "white",
    marginTop: 4,
  },
});
