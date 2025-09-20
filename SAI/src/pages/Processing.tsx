// src/pages/Processing.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { exercises } from "../config/exercises";

type Props = StackScreenProps<RootStackParamList, "Processing">;

const Processing: React.FC<Props> = ({ route, navigation }) => {
  const { videoPath, exerciseId } = route.params;

  const [done, setDone] = useState(false);

  const currentIndex = Math.max(
    0,
    exercises.findIndex((ex) => ex.id === exerciseId)
  );
  const isLast = currentIndex >= exercises.length - 1;

  useEffect(() => {
    console.log("Processing video:", videoPath);
    // Simulate 3 sec delay
    const timer = setTimeout(() => setDone(true), 3000);
    return () => clearTimeout(timer);
  }, [videoPath]);

  const handleRestart = () => {
    navigation.replace("Record", {
      exerciseId: exercises[currentIndex].id,
      exerciseName: exercises[currentIndex].key,
    });
  };

  const handleNext = () => {
    if (!isLast) {
      navigation.replace("Record", {
        exerciseId: exercises[currentIndex + 1].id,
        exerciseName: exercises[currentIndex + 1].key,
      });
    } else {
      navigation.replace("ScoreAnalysis");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {done ? "Processing Complete " : "Analyzing Video..."}
      </Text>
      {!done && (
        <ActivityIndicator
          size="large"
          color="#7817a1"
          style={{ marginTop: 16 }}
        />
      )}

      {done && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: "#332938" }]}
            onPress={handleRestart}
          >
            <Text style={styles.btnText}>Restart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: "#7817a1" }]}
            onPress={handleNext}
          >
            <Text style={styles.btnText}>
              {isLast ? "Finish & Analyze" : "Record Next"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Processing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161117",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: { fontSize: 22, color: "#fff", fontWeight: "bold" },
  actions: {
    marginTop: 32,
    flexDirection: "row",
    gap: 12,
  },
  btn: {
    flex: 1,
    minWidth: 120,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});