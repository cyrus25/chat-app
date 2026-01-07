import { createContext, ReactNode, useContext, useState } from "react";
import { StyleSheet, View } from "react-native";

type PortalContextType = {
  mount: (node: ReactNode) => void;
  unmount: () => void;
};

const PortalContext = createContext<PortalContextType | null>(null);

export function usePortal() {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error("usePortal must be used within PortalHost");
  return ctx;
}

export function PortalHost({ children }: { children: ReactNode }) {
  const [node, setNode] = useState<ReactNode | null>(null);

  return (
    <PortalContext.Provider
      value={{
        mount: setNode,
        unmount: () => setNode(null),
      }}
    >
      <View style={styles.container}>
        {children}
        {node}
      </View>
    </PortalContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
