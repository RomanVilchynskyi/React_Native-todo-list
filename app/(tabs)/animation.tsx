import React from "react";
import { View, Button, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";

export default function App() {
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 50, 100],
      ["#ff4d4d", "#ffd93d", "#6bcb77"]
    );

    return {
      width: `${progress.value}%`,
      backgroundColor,
    };
  });

  const handleNext = () => {
    if (progress.value >= 100) {
      progress.value = withTiming(0, { duration: 500 });
    } else {
      progress.value = withTiming(progress.value + 25, { duration: 500 });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <Animated.View style={[styles.fill, animatedStyle]} />
      </View>

      <Button title="Next" onPress={handleNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  progressBar: {
    height: 30,
    width: "100%",
    backgroundColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
    width: "0%",
    borderRadius: 10,
  },
});