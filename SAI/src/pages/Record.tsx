import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Image,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { exercises } from "../config/exercises";

type RecordProps = StackScreenProps<RootStackParamList, "Record">;

const Record: React.FC<RecordProps> = ({ route, navigation }) => {
  const { exerciseId } = route.params as RootStackParamList["Record"];
  const currentIndex = Math.max(0, exercises.findIndex((ex) => ex.id === exerciseId));
  const exercise = currentIndex >= 0 ? exercises[currentIndex] : exercises[0];

  const DEFAULT_DURATION_SECONDS = 60;
  const [timer, setTimer] = useState(DEFAULT_DURATION_SECONDS);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isRunning && timer > 0) {
      interval = setInterval(() => setTimer((previous: number) => previous - 1), 1000);
    } else if (timer === 0) {
      Alert.alert("Time's up!", "Move to the next exercise.");
      setIsRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timer]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fitness Assessment</Text>
        <View style={{ width: 48 }} />
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <Text style={styles.exerciseText}>Exercise {currentIndex + 1} of {exercises.length}</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentIndex + 1) / exercises.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Video Placeholder */}
      <View style={styles.videoBox}>
        <Image
          source={{ uri: "https://placehold.co/600x400" }}
          style={{ width: "100%", height: "100%", borderRadius: 16 }}
        />
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.playBtn}
            onPress={() => setIsRunning(true)}
          >
            <MaterialIcons name="play-arrow" size={40} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Exercise Info */}
      <Text style={styles.exerciseName}>{exercise.description ? exercise.title : exercise.title}</Text>
      <Text style={styles.description}>{exercise.description}</Text>
      <Text style={styles.timer}>Time Remaining: {timer}s</Text>

      {/* Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#7817a1" }]}
          onPress={() => {
            const nextIndex = currentIndex + 1;
            const nextEx = exercises[nextIndex];
            if (nextEx) {
              navigation.replace("Record", { exerciseId: nextEx.id, exerciseName: nextEx.key } as RootStackParamList["Record"]);
            } else {
              Alert.alert("Completed!", "All exercises done.");
              navigation.replace("Dashboard");
            }
          }}
        >
          <Text style={styles.btnText}>Record Next Exercise</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#1F1A21" }]}
          onPress={() => {
            setTimer(DEFAULT_DURATION_SECONDS);
            setIsRunning(false);
          }}
        >
          <Text style={styles.btnText}>Restart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#100D11", padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  backBtn: { width: 48, height: 48, alignItems: "center", justifyContent: "center" },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  progressContainer: { marginBottom: 12 },
  exerciseText: { color: "#D4C3DA", fontSize: 14, marginBottom: 6 },
  progressBar: { height: 8, borderRadius: 8, backgroundColor: "#1F1A21" },
  progressFill: { height: 8, borderRadius: 8, backgroundColor: "#7817a1" },

  videoBox: { width: "100%", aspectRatio: 16 / 9, marginVertical: 12 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  exerciseName: { fontSize: 20, fontWeight: "bold", color: "#fff", marginTop: 12 },
  description: { fontSize: 14, color: "#D4C3DA", marginVertical: 6 },
  timer: { fontSize: 16, fontWeight: "600", color: "#fff", marginVertical: 8 },

  actions: { flexDirection: "column", gap: 12, marginTop: 16 },
  btn: { padding: 14, borderRadius: 24, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "bold" },
});

export default Record;
