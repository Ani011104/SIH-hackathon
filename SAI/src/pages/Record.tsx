// src/pages/Record.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
import i18n from "../i18n";
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

  const format: CameraDeviceFormat | undefined = device?.formats.find(
    (f) => f.videoHeight <= 720
  );

  // Permissions
  useEffect(() => {
    (async () => {
      const cam = await Camera.requestCameraPermission();
      const mic = await Camera.requestMicrophonePermission();
      setPermission(cam === "granted" && mic === "granted");
    })();
  }, []);

  // Text to speech helper
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

  // Restart current exercise
  const handleRestart = () => {
    navigation.replace("Record", {
      exerciseId: exercise.id,
      exerciseName: exercise.key,
    });
  };

  // Go directly to next exercise (no processing)
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
      navigation.replace("AssessmentResults", { results: {} });
    }
  };

  // Start countdown then recording
  const handleStart = () => {
    if (recording) return;
    setRecording(true);
    setPreCountdown(3);
  };

  // Pre-countdown
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

  // Timer
  useEffect(() => {
    if (exerciseTimer === null) return;
    if (exerciseTimer <= 0) {
      stopRecording();
      return;
    }
    const timeout = setTimeout(() => setExerciseTimer(exerciseTimer - 1), 1000);
    return () => clearTimeout(timeout);
  }, [exerciseTimer]);

  // Start recording
  const startRecording = async () => {
    try {
      if (camera.current) {
        await camera.current.startRecording({
          flash: "off",
          onRecordingFinished: (video) => {
            console.log("📹 Video recorded:", video.path);
            // After stop → show processing screen
            navigation.replace("Processing", {
              videoPath: video.path,
              exerciseIndex: String(currentIndex),
            });
          },
          onRecordingError: (err) => {
            console.error("❌ Recording error:", err);
            setRecording(false);
            Alert.alert(
              "Recording Error",
              "Failed to record video. Please try again."
            );
          },
        });
      }
    } catch (err) {
      console.error("❌ Start recording error:", err);
      setRecording(false);
    }
  };

  // Stop recording
  const stopRecording = async () => {
    try {
      if (camera.current) {
        await camera.current.stopRecording();
      }
    } catch (err) {
      console.error("❌ Stop recording error:", err);
    } finally {
      setRecording(false);
      setExerciseTimer(null);
    }
  };

  // Permission not granted
  if (!device || !permission) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#fff" size="large" />
        <Text style={{ color: "#fff", marginTop: 10 }}>
          Requesting camera permission…
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </View>
        </TouchableOpacity> */}
        <Text style={styles.headerTitle}>{i18n.t("Fitness Assessment")}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Progress */}
        <View style={styles.progressWrapper}>
          <Text style={styles.progressText}>
            {i18n.t("Exercise")} {currentIndex + 1} {i18n.t("of")} {exercises.length}
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
            format={format}
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

        {/* Stop Recording */}
        {recording && (
          <TouchableOpacity style={styles.stopBtn} onPress={stopRecording}>
            <Text style={styles.stopBtnText}> Stop Recording</Text>
          </TouchableOpacity>
        )}

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.exerciseTitle}>{exercise.title}</Text>
          <Text style={styles.exerciseDesc}>{exercise.description}</Text>
          <View style={{backgroundColor: '#1E1E1E', padding: 10, borderRadius: 12, marginTop: 10, borderWidth: 1, borderColor: 'rgba(78, 71, 71, 0.6)'}}>
            <Text style={{color: '#ccc'}}>{i18n.t("Instructions")}</Text>
          <Text style={styles.exerciseInstructions}>
            {exercise.instructions}
          </Text>
          </View>

          {exercise.tutorialVideo && (
            <TouchableOpacity
              style={styles.tutorialBtn}
              onPress={() => Linking.openURL(exercise.tutorialVideo!)}
            >
              <Text style={styles.tutorialBtnText}>▶ {i18n.t("Watch Tutorial")}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footerActions}>
        <TouchableOpacity
          style={[styles.footerBtn, { backgroundColor: "#332938" }]}
          onPress={handleRestart}
        >
          <Text style={styles.footerBtnText}>{i18n.t("Restart")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.footerBtn, { backgroundColor: "#7817a1" }]}
          onPress={handleRecordNext}
        >
          <Text style={styles.footerBtnText}>
            {currentIndex < exercises.length - 1
              ? i18n.t("Next Exercise")
              : i18n.t("Finish & Analyze")}
          </Text>
        </TouchableOpacity>
      </View>

      <FooterNav navigation={navigation} active="Record" />
    </SafeAreaView>
  );
};

export default Record;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 4 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
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
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  progressWrapper: { paddingHorizontal: 16, marginBottom: 12 },
  progressText: { color: "#fff", fontSize: 14, marginBottom: 6 },
  progressBar: { height: 8, borderRadius: 8, backgroundColor: "#4c3d52" },
  progressFill: {
    height: 8,
    borderRadius: 8,
    backgroundColor: "#7817a1",
  },
  videoBox: {
    margin: 12,
    borderRadius: 14,
    backgroundColor: "#000",
    aspectRatio: 1 / 1,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginLeft : 28
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
  infoBox: { paddingHorizontal: 16, marginBottom: 24 },
  exerciseTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  exerciseDesc: { color: "#bbb", marginTop: 6 },
  exerciseInstructions: { color: "#ccc", marginTop: 8, marginBottom: 6 },
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
    padding: 12,
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