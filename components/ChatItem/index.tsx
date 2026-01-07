import { CURR_USER_ID } from "@/constants";
import { usePortal } from "@/portal/PortalHost";
import { ChatItemType } from "@/types";
import Entypo from "@expo/vector-icons/Entypo";
import { useMemo, useRef } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import EmojiReactionPortal from "../EmojiReactionPortal";
import ReplyTo from "../RepyTo";

const { width } = Dimensions.get("window");

const Avatar = ({
  user,
}: {
  user: {
    _id: string;
    name: string;
  };
}) => {
  const avatarName = useMemo(() => {
    const userName = user?.name || "";
    const name = userName.toUpperCase().split(" ");
    if (name.length === 1) return `${name[0].charAt(0)}`;
    else if (name.length > 1) return `${name[0].charAt(0)}${name[1].charAt(0)}`;
    else return "";
  }, [user]);

  return (
    <View style={styles.userAvatar}>
      <Text style={styles.avatarTxt}>{avatarName}</Text>
    </View>
  );
};

export default function ChatItem(props: any) {
  const xTranslation = useSharedValue(0);
  const bubbleRef = useRef<View>(null);

  const portal = usePortal();

  const isMine = props.currentMessage?.user?._id === CURR_USER_ID;

  const { replyToUser, currentMessage, removeEmoji, messages, addReaction } =
    props;

  const pan = Gesture.Pan()
    .onBegin(() => {})
    .onChange((event) => {
      if (event.translationX > 0) xTranslation.value = event.translationX;
    })
    .onFinalize(() => {
      if (xTranslation.value / width > 0.4) {
        runOnJS(replyToUser)(props.currentMessage._id);
      }
      xTranslation.value = withSpring(0);
    });

  const onLongPress = () => {
    // bubbleRef.current?.measureInWindow((x, y, width, height) => {
    //   props.setEmojiUI({
    //     message: props.currentMessage,
    //     layout: { x, y, width, height },
    //   });
    // });
    bubbleRef.current?.measure((x, y, width, height, pageX, pageY) => {
      portal.mount(
        <EmojiReactionPortal
          emojiUI={{
            message: props.currentMessage,
            layout: {
              x: pageX,
              y: pageY,
              width,
              height,
            },
          }}
          onClose={portal.unmount}
          onSelect={(message, emoji) => {
            addReaction(message, emoji);
            portal.unmount();
          }}
        />
      );
    });

    // bubbleRef.current?.measure((x, y, width, height, pageX, pageY) => {
    //   props.setEmojiUI({
    //     message: props.currentMessage,
    //     layout: {
    //       x: pageX,
    //       y: pageY,
    //       width,
    //       height,
    //     },
    //   });
    // });
  };

  const longPress = Gesture.LongPress()
    .minDuration(400)
    .onStart(() => {
      runOnJS(onLongPress)();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: xTranslation.value }],
  }));

  const composed = Gesture.Race(pan, longPress);

  const replyToMessage = messages?.find(
    (message: ChatItemType) => message?._id === currentMessage?.replyTo
  );

  return (
    <GestureDetector gesture={composed}>
      <View ref={bubbleRef} style={styles.chatItemContainer}>
        <Animated.View style={[styles.chatItem, animatedStyle]}>
          <View
            style={{
              flexDirection: "row",
              alignSelf: isMine ? "flex-end" : "flex-start",
            }}
          >
            {!isMine && <Avatar user={currentMessage?.user} />}
            <View
              style={[
                styles.bubbleWrapper,
                isMine ? styles.myBubble : styles.otherBubble,
              ]}
            >
              <View>
                {replyToMessage && (
                  <ReplyTo
                    showCancel={false}
                    message={replyToMessage}
                    onCancel={() => {}}
                  />
                )}
                <Text
                  style={[isMine ? { color: "white" } : { color: "black" }]}
                >
                  {currentMessage.text}
                </Text>
              </View>
              <Text>
                {new Date(currentMessage?.createdAt).toLocaleDateString()}
              </Text>
              {currentMessage?.emoji && (
                <Pressable
                  onPress={() => {
                    removeEmoji(currentMessage?._id);
                  }}
                  style={styles.emoji}
                >
                  <Text>{currentMessage?.emoji}</Text>
                </Pressable>
              )}
            </View>
          </View>
        </Animated.View>
        <View style={styles.reply}>
          <Entypo name="reply" size={24} color="white" />
        </View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  chatItemContainer: {
    position: "relative",
    justifyContent: "center",
    // marginBottom: 20,
  },
  reply: {
    zIndex: 0,
    position: "absolute",
    alignSelf: "center",
    left: 10,
  },
  chatItem: {
    backgroundColor: "black",
    zIndex: 1,
    // flexDirection: "row",
    // gap: 1,
  },
  bubbleWrapper: {
    width: "80%",
    borderRadius: 15,
    flexDirection: "row",
    padding: 10,
    // maxWidth: width,
    // backgroundColor: "red",
    // alignSelf: "flex-start",
  },
  alignEnd: {
    alignSelf: "flex-end",
  },
  myBubble: {
    // alignSelf: "flex-end",
    backgroundColor: "#0084ff",
    justifyContent: "flex-end",
    marginRight: 8,
  },
  otherBubble: {
    // justifyContent: "flex-start",
    marginLeft: 8,
    backgroundColor: "#f0f0f0",
  },
  emoji: {
    position: "absolute",
    bottom: -16,
    right: 0,
  },
  textStyle: {
    color: "white",
    fontSize: 16,
    backgroundColor: "transparent",
    fontWeight: "100",
  },
  userAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 0,
    backgroundColor: "#8e44ad",
  },
  avatarTxt: {
    color: "white",
  },
});
