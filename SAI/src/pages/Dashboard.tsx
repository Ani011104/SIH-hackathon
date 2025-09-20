// src/pages/Dashboard.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FooterNav from "../components/FooterNav";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { exercises } from "../config/exercises";

// ✅ Import local storage score
import { getOverallScore } from "../services/storage";
import { getFinalResult } from "../services";

type DashboardProps = StackScreenProps<RootStackParamList, "Dashboard">;

const MOCK_MODE = true; // ✅ Toggle ON for offline testing

const Dashboard: React.FC<DashboardProps> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [overallScore, setOverallScore] = useState<number>(0);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        if (MOCK_MODE) {
          console.log("✅ MOCK: Fetching dashboard score...");

          // ✅ Try getting saved score from storage first
          const saved = await getOverallScore();
          setTimeout(() => {
            setOverallScore(saved ?? 85); // fallback to 85 if no saved score
            setLoading(false);
          }, 800);
          return;
        }

        // ✅ Real backend fetch
        const res = await getFinalResult();
        console.log("Dashboard result:", res);

        if (res && res.total_score) {
          setOverallScore(res.total_score);
        } else if (typeof res === "number") {
          setOverallScore(res);
        } else {
          setOverallScore(0);
        }
      } catch (err) {
        console.error(err);
        setOverallScore(0);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener("focus", fetchScore);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 48 }} />
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialIcons name="settings" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={[styles.quickBtn, { backgroundColor: "#7817a1" }]}
              onPress={() =>
                navigation.navigate("Record", {
                  exerciseId: exercises[0].id,
                  exerciseName: exercises[0].key,
                })
              }
            >
              <MaterialIcons name="videocam" size={28} color="#fff" />
              <Text style={styles.quickBtnText}>Record Test</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickBtn, { backgroundColor: "#1E1E1E" }]}
              onPress={() => navigation.navigate("Leaderboard")}
            >
              <MaterialIcons name="leaderboard" size={28} color="#fff" />
              <Text style={styles.quickBtnText}>Leaderboard</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Personal Score */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Score</Text>
          <View style={styles.card}>
            {loading ? (
              <ActivityIndicator color="#7817a1" size="large" />
            ) : (
              <View style={{ flex: 1 }}>
                <Text style={styles.muted}>Overall Score</Text>
                <Text style={styles.score}>
                  {overallScore ? `${overallScore}` : "No score yet"}
                </Text>
                <Text style={styles.muted}>
                  Based on your last assessment
                </Text>
              </View>
            )}
            <View style={styles.scoreAvatar} />
          </View>
          <TouchableOpacity style={styles.detailsBtn}>
            <Text style={styles.detailsText}>View Details</Text>
            <MaterialIcons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {exercises.slice(0, 3).map((ex) => (
            <View key={ex.id} style={styles.activityCard}>
              <View style={styles.activityIcon}>
                <MaterialIcons name="fitness-center" size={22} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.activityTitle}>{ex.title}</Text>
                <Text style={styles.activityDate}>2025-09-18</Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color="#aaa" />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer Navigation */}
      <FooterNav navigation={navigation} active="Dashboard" />
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  iconBtn: { width: 48, height: 48, alignItems: "center", justifyContent: "center" },
  scrollContent: { padding: 16, paddingBottom: 100 },

  section: { marginBottom: 24 },
  sectionTitle: { color: "#fff", fontSize: 20, fontWeight: "bold", marginBottom: 12 },

  quickActions: { flexDirection: "row", gap: 12 },
  quickBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 6,
  },
  quickBtnText: { color: "#fff", fontWeight: "600" },

  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  muted: { color: "#bbb", fontSize: 12 },
  score: { color: "#fff", fontSize: 36, fontWeight: "bold" },
  scoreAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "#7817a1",
    backgroundColor: "#333",
  },
  detailsBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 10,
  },
  detailsText: { color: "#fff", fontSize: 14 },

  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  activityTitle: { color: "#fff", fontWeight: "600" },
  activityDate: { color: "#bbb", fontSize: 12 },
});