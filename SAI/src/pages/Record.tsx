// src/pages/Record.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { exercises } from "../config/exercises";
import FooterNav from "../components/FooterNav";
import Tts from "react-native-tts";
import {
  Camera,
  useCameraDevices,
  CameraDevice,
  CameraDeviceFormat,
} from "react-native-vision-camera";

type Props = StackScreenProps<RootStackParamList, "Record">;

const Record: React.FC<Props> = ({ route, navigation }) => {
  const { exerciseId } = route.params || { exerciseId: exercises[0].id };

  const currentIndex = Math.max(
    0,
    exercises.findIndex((ex) => ex.id === exerciseId)
  );
  const exercise = exercises[currentIndex] ?? exercises[0];

  const [recording, setRecording] = useState(false);
  const [preCountdown, setPreCountdown] = useState<number | null>(null);
  const [exerciseTimer, setExerciseTimer] = useState<number | null>(null);
  const [permission, setPermission] = useState(false);

  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device: CameraDevice | undefined = devices.find(
    (d) => d.position === "back"
  );

  // ✅ Pick format with max height ≤ 480
  const format: CameraDeviceFormat | undefined = device?.formats.find(
    (f) => f.videoHeight <= 480
  );

  // request permissions
  useEffect(() => {
    (async () => {
      const cam = await Camera.requestCameraPermission();
      const mic = await Camera.requestMicrophonePermission();
      setPermission(cam === "granted" && mic === "granted");
    })();
  }, []);

  // 🔊 Safe TTS
  const safeSpeak = async (text: string) => {
    try {
      const status = await Tts.getInitStatus();
      if (status) {
        Tts.stop();
        Tts.setDefaultLanguage("en-US");
        Tts.setDefaultRate(0.5);
        Tts.speak(text);
      }
    } catch (err) {
      console.warn("TTS unavailable:", err);
    }
  };

  const handleRestart = () => {
    navigation.replace("Record", {
      exerciseId: exercise.id,
      exerciseName: exercise.key,
    });
  };

  const handleRecordNext = () => {
    if (recording) {
      Alert.alert("Please stop recording first");
      return;
    }
    if (currentIndex < exercises.length - 1) {
      navigation.replace("Record", {
        exerciseId: exercises[currentIndex + 1].id,
        exerciseName: exercises[currentIndex + 1].key,
      });
    } else {
      navigation.replace("ScoreAnalysis");
    }
  };

  const handleStart = () => {
    if (recording) return;
    setRecording(true);
    setPreCountdown(3);
  };

  // pre-countdown
  useEffect(() => {
    if (preCountdown === null) return;
    if (preCountdown < 0) {
      setPreCountdown(null);
      setExerciseTimer(60);
      startRecording();
      return;
    }

    safeSpeak(preCountdown === 0 ? "Go!" : String(preCountdown));
    const timeout = setTimeout(() => setPreCountdown(preCountdown - 1), 1000);
    return () => clearTimeout(timeout);
  }, [preCountdown]);

  // timer (only UI, no auto-next)
  useEffect(() => {
    if (exerciseTimer === null) return;
    if (exerciseTimer <= 0) {
      stopRecording();
      return;
    }
    const timeout = setTimeout(() => setExerciseTimer(exerciseTimer - 1), 1000);
    return () => clearTimeout(timeout);
  }, [exerciseTimer]);

  // camera recording
  const startRecording = async () => {
    try {
      if (camera.current) {
        await camera.current.startRecording({
          flash: "off",
          onRecordingFinished: (video) => {
            console.log("Video file:", video.path);
            // ✅ Navigate to Processing screen
            navigation.replace("Processing", {
              videoPath: video.path,
              exerciseId: exercise.id,
            });
          },
          onRecordingError: (err) => {
            console.error("Recording error", err);
            setRecording(false);
          },
        });
      }
    } catch (err) {
      console.error("Start recording error:", err);
      setRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      if (camera.current) {
        await camera.current.stopRecording();
      }
    } catch (err) {
      console.error("Stop recording error:", err);
    } finally {
      setRecording(false);
      setExerciseTimer(null);
    }
  };

  if (!device || !permission) {
    return (
      <View style={styles.loading}>
        <Text style={{ color: "#fff" }}>Requesting camera permission…</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fitness Assessment</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Progress */}
        <View style={styles.progressWrapper}>
          <Text style={styles.progressText}>
            Exercise {currentIndex + 1} of {exercises.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentIndex + 1) / exercises.length) * 100}%` },
              ]}
            />
          </View>
        </View>

        {/* Camera preview */}
        <View style={styles.videoBox}>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            format={format} // ✅ ensure 480p (or closest lower)
            isActive={true}
            video={true}
            audio={true}
          />
          <View style={styles.overlay}>
            {preCountdown !== null ? (
              <Text style={styles.countdownText}>
                {preCountdown === 0 ? "GO!" : preCountdown}
              </Text>
            ) : recording ? (
              <Text style={styles.timerText}>
                {exerciseTimer !== null ? `${exerciseTimer}s` : ""}
              </Text>
            ) : (
              <TouchableOpacity
                style={styles.playBtn}
                onPress={handleStart}
                disabled={recording}
              >
                <MaterialIcons name="play-arrow" size={40} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Stop Recording button (separate below camera) */}
        {recording && (
          <TouchableOpacity style={styles.stopBtn} onPress={stopRecording}>
            <Text style={styles.stopBtnText}>⏹ Stop Recording</Text>
          </TouchableOpacity>
        )}

        {/* Exercise Info */}
        <View style={styles.infoBox}>
          <Text style={styles.exerciseTitle}>{exercise.title}</Text>
          <Text style={styles.exerciseDesc}>{exercise.description}</Text>

          {exercise.tutorialUrl && (
            <TouchableOpacity
              style={styles.tutorialBtn}
              onPress={() => Linking.openURL(exercise.tutorialUrl!)}
            >
              <Text style={styles.tutorialBtnText}>▶ Watch Tutorial</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Footer buttons */}
      <View style={styles.footerActions}>
        <TouchableOpacity
          style={[styles.footerBtn, { backgroundColor: "#332938" }]}
          onPress={handleRestart}
        >
          <Text style={styles.footerBtnText}>Restart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.footerBtn, { backgroundColor: "#7817a1" }]}
          onPress={handleRecordNext}
        >
          <Text style={styles.footerBtnText}>
            {currentIndex < exercises.length - 1
              ? "Record Next"
              : "Finish & Analyze"}
          </Text>
        </TouchableOpacity>
      </View>

      <FooterNav navigation={navigation} active="Record" />
    </SafeAreaView>
  );
};

export default Record;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#161117" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
  },
  backBtn: {
    backgroundColor: "#332938",
    borderRadius: 20,
    padding: 8,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  progressWrapper: { paddingHorizontal: 16, marginBottom: 12 },
  progressText: { color: "#fff", fontSize: 14, marginBottom: 6 },
  progressBar: { height: 8, borderRadius: 8, backgroundColor: "#4c3d52" },
  progressFill: {
    height: 8,
    borderRadius: 8,
    backgroundColor: "#7817a1",
  },

  videoBox: {
    margin: 16,
    borderRadius: 16,
    backgroundColor: "#000",
    aspectRatio: 16 / 9,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  countdownText: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#fff",
  },
  timerText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#00ff88",
  },

  stopBtn: {
    alignSelf: "center",
    marginVertical: 12,
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  stopBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  infoBox: { paddingHorizontal: 16 },
  exerciseTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  exerciseDesc: { color: "#bbb", marginTop: 6 },

  tutorialBtn: {
    marginTop: 12,
    backgroundColor: "#332938",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  tutorialBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  footerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#332938",
    backgroundColor: "#161117",
  },
  footerBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  footerBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loading: {
    flex: 1,
    backgroundColor: "#161117",
    alignItems: "center",
    justifyContent: "center",
  },
});