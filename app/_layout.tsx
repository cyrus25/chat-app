import { PortalHost } from "@/portal/PortalHost";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <PortalHost>
        <Slot />
      </PortalHost>
    </GestureHandlerRootView>
  );
}
