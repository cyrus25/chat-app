import ChatItem from "@/components/ChatItem";
import ChatList from "@/components/ChatList";
import { EndChatOverlay } from "@/components/EndChatOverlay";
import Feedback from "@/components/Feedback";
import ReplyTo from "@/components/RepyTo";
import { CURR_USER_ID } from "@/constants";
import { chats } from "@/data";
import { ChatItemType } from "@/types";
import { useRef, useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function Page() {
  const [replyTo, setReplyingTo] = useState<ChatItemType | undefined>();
  const [inputTxt, setInputTxt] = useState("");
  const flatListRef = useRef(null);

  const [showOverlay, setShowOverlay] = useState(false);
  const [messages, setMessages] = useState<ChatItemType[]>(() => {
    return chats.map((chat) => {
      return {
        _id: chat.id,
        text: chat.text,
        createdAt: chat.timestamp,
        type: chat.type,
        feedbackType: chat?.feedbackType,
        hasFeedback: chat?.hasFeedback,
        replyTo: chat?.replyTo,
        user: {
          _id: chat.sender === "user" ? CURR_USER_ID : chat.id,
          name: chat.sender,
        },
      };
    });
  });

  const insets = useSafeAreaInsets();

  const keyboardTopToolbarHeight = Platform.select({ ios: 44, default: 0 });
  const keyboardVerticalOffset = insets.bottom + +keyboardTopToolbarHeight;

  const replyToUser = (id: string) => {
    const selectedMessage = messages?.find((message) => message._id === id);
    setReplyingTo(selectedMessage);
  };

  const onCancelReply = () => {
    setReplyingTo(undefined);
  };

  const addReaction = (message: ChatItemType, emoji: string) => {
    const id = message._id;
    setMessages((messages) => {
      return messages.map((message) => {
        if (message._id === id) {
          return { ...message, emoji: emoji };
        } else return message;
      });
    });
  };

  const removeEmoji = (id: string) => {
    setMessages((messages) => {
      return messages.map((message) => {
        if (message._id === id) {
          return { ...message, emoji: undefined };
        } else return message;
      });
    });
  };

  const scrollToBottom = () => {
    if (flatListRef?.current) {
      flatListRef?.current?.scrollToEnd({ animated: true });
    }
  };

  const onSend = () => {
    const newMessage: ChatItemType = {
      _id: messages.length.toString(),
      text: inputTxt,
      createdAt: Date.now(),
      type: "text",
      feedbackType: undefined,
      hasFeedback: false,
      replyTo: replyTo?._id,
      user: {
        _id: CURR_USER_ID,
        name: "user",
      },
    };
    setInputTxt("");
    setReplyingTo(undefined);
    setMessages((messages) => [...messages, newMessage]);
    requestAnimationFrame(() => {
      scrollToBottom();
    });
  };

  const onLike = (id: string) => {
    setMessages((messages) => {
      return messages.map((message) => {
        if (message._id === id) {
          return { ...message, hasFeedback: true, feedbackType: "liked" };
        } else return message;
      });
    });
  };

  const onChange = (text: string) => {
    setInputTxt(text);
  };

  const onDislike = (id: string, reason: string) => {
    setMessages((messages) => {
      return messages.map((message) => {
        if (message._id === id) {
          return {
            ...message,
            hasFeedback: true,
            feedbackType: "disliked",
            reason,
          };
        } else return message;
      });
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.astrologerName}>{messages[0]?.user?.name}</Text>
          <Pressable onPress={() => setShowOverlay(true)}>
            <Text style={styles.endChatBtn}>End Chat</Text>
          </Pressable>
        </View>
        <ChatList
          ref={flatListRef}
          user={{
            _id: CURR_USER_ID,
          }}
          renderMessage={({ item }: { item: ChatItemType }) => {
            return (
              <>
                <ChatItem
                  messages={messages}
                  replyToUser={replyToUser}
                  addReaction={addReaction}
                  removeEmoji={removeEmoji}
                  currentMessage={item}
                />
                {item?.user?.name === "ai_astrologer" && (
                  <Feedback
                    currentMessage={item}
                    onDislike={onDislike}
                    onLike={onLike}
                  />
                )}
              </>
            );
          }}
          messages={messages}
        />
        {replyTo && (
          <ReplyTo
            showCancel={true}
            onCancel={onCancelReply}
            message={replyTo}
          />
        )}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            value={inputTxt}
            style={{
              color: "white",
              padding: 20,
              flex: 1,
            }}
            placeholderTextColor={"white"}
            placeholder="Type here..."
            onChangeText={onChange}
          />
          <Button onPress={onSend} title="Send"></Button>
        </View>

        <EndChatOverlay
          visible={showOverlay}
          onClose={() => setShowOverlay(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  chatItem: {
    padding: 20,
    marginTop: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "white",
  },
  emojiBar: {
    position: "absolute",
    flexDirection: "row",
    backgroundColor: "#222",
    borderRadius: 24,
    paddingHorizontal: 10,
    paddingVertical: 6,
    justifyContent: "space-around",
    zIndex: 999,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    padding: 20,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#3A3A3C",
    alignItems: "center",
  },
  endChatBtn: {
    color: "white",
    fontWeight: "bold",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    backgroundColor: "#1abc9c",
  },
  astrologerName: {
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
  },
  emoji: {
    fontSize: 22,
    marginHorizontal: 6,
  },
});
