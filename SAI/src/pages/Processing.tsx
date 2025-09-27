// src/pages/Processing.tsx
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FooterNav from "../components/FooterNav";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { exercises } from "../config/exercises";

type Props = StackScreenProps<RootStackParamList, "Processing">;

const Processing: React.FC<Props> = ({ navigation, route }) => {
  const { videoPath, exerciseIndex } = route.params;
  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  // animations
  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(pulse, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [spin, pulse]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const pulseWidth = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: ["40%", "80%"],
  });

  // navigation after short delay
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (exerciseIndex < exercises.length - 1) {
        // go to next exercise
        navigation.replace("Record", {
          exerciseId: exercises[exerciseIndex + 1].id,
          exerciseName: exercises[exerciseIndex + 1].key,
        });
      } else {
        // final → show results
        navigation.replace("AssessmentResults", { results: {} });
      }
    }, 3000); // ⏳ 3s delay to show animation

    return () => clearTimeout(timeout);
  }, [exerciseIndex, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Video Processing</Text>
      </View>

      <View style={styles.content}>
        <Animated.View style={[styles.loader, { transform: [{ rotate }] }]} />
        <Text style={styles.title}>Analyzing your performance</Text>
        <Text style={styles.subtitle}>
          Your video is being uploaded and processed. This may take a few
          moments.
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill, { width: pulseWidth }]} />
          </View>
          <Text style={styles.progressText}>Processing...</Text>
        </View>
      </View>

      <FooterNav navigation={navigation} active="Record" />
    </SafeAreaView>
  );
};

export default Processing;

const PRIMARY = "#7717a1";
const BG = "#1c1121";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  header: {
    paddingTop: Platform.OS === "android" ? 12 : 0,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },
  content: { flex: 1, padding: 24, alignItems: "center", justifyContent: "center" },
  loader: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 10,
    borderColor: "rgba(255,255,255,0.08)",
    borderTopColor: PRIMARY,
    marginBottom: 28,
  },
  title: { fontSize: 20, fontWeight: "700", color: "#fff", marginBottom: 8, textAlign: "center" },
  subtitle: { color: "#cfc6da", fontSize: 14, textAlign: "center", marginBottom: 28 },
  progressContainer: { width: "100%", maxWidth: 360, alignItems: "center" },
  progressBar: { width: "100%", height: 10, backgroundColor: "rgba(119,23,161,0.12)", borderRadius: 6, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: PRIMARY, borderRadius: 6 },
  progressText: { marginTop: 10, color: "#bfb7cf", fontSize: 12 },
});