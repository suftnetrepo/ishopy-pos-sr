import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from "react-native";

const { width } = Dimensions.get("window");

/**
 * Animated Drawer Component (No Reanimated)
 * @param {boolean} isOpen
 * @param {function} onClose
 * @param {"left" | "right"} direction
 * @param {ReactNode} children
 */
export default function Drawer({
  isOpen,
  onClose,
  direction = "right",
  children,
}) {
  const drawerWidth = width * 0.30; // 55% width like POS
  const slideAnim = useRef(new Animated.Value(0)).current; // 0 = closed, 1 = open

  // open or close animation effect
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  // calculate horizontal translation
  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange:
      direction === "right"
        ? [drawerWidth, 0] // slide from right
        : [-drawerWidth, 0], // slide from left
  });

  // background dimming
  const backdropOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={isOpen ? "auto" : "none"}>
      {/* BACKDROP */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[
            styles.backdrop,
            { opacity: backdropOpacity },
          ]}
        />
      </TouchableWithoutFeedback>

      {/* DRAWER PANEL */}
      <Animated.View
        style={[
          styles.drawer,
          {
            width: drawerWidth,
            transform: [{ translateX }],
            [direction]: 0, // dynamic: left:0 or right:0
          },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  drawer: {
    position: "absolute",
    top: -5,
    bottom: -5,
    right: -5,
    backgroundColor: "#111",
    borderRadius: 8,
    
  },
});
