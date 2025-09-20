// src/pages/ScoreAnalysis.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { saveOverallScore } from "../services/storage"; // ✅ to store score locally

type Props = StackScreenProps<RootStackParamList, "ScoreAnalysis">;

const FIXED_SCORE = 85; // 

const ScoreAnalysis: React.FC<Props> = ({ navigation }) => {
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    setOverallScore(FIXED_SCORE);
  }, []);

  const handleSubmitScore = async () => {
    if (overallScore === null) return;

    setLoading(true);
    try {
      // ✅ Save to local storage (later replace with backend call)
      await saveOverallScore(overallScore);

      // simulate delay
      setTimeout(() => {
        setLoading(false);
        navigation.replace("Leaderboard");
      }, 1000);
    } catch (err) {
      console.error("Error submitting score", err);
      setLoading(false);
    }
  };

  if (overallScore === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#7817a1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Final Score</Text>
      <Text style={styles.score}>{overallScore} pts</Text>
      <Text style={styles.subtitle}>
        Great job completing your fitness assessment!
      </Text>

      <TouchableOpacity
        style={styles.finishBtn}
        onPress={handleSubmitScore}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.finishBtnText}>Submit to Leaderboard</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.finishBtn, { backgroundColor: "#332938", marginTop: 12 }]}
        onPress={() => navigation.replace("Dashboard")}
      >
        <Text style={styles.finishBtnText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ScoreAnalysis;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161117",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 8,
  },
  score: {
    fontSize: 48,
    color: "#00ff88",
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#bbb",
    textAlign: "center",
    marginBottom: 24,
  },
  finishBtn: {
    backgroundColor: "#7817a1",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    width: "80%",
  },
  finishBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});