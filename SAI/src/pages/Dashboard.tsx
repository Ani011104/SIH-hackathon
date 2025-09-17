import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FooterNav from "../components/FooterNav";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { exercises } from "../config/exercises";

type DashboardProps = StackScreenProps<RootStackParamList, "Dashboard">;

const Dashboard: React.FC<DashboardProps> = ({ navigation }) => {
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
            <View style={{ flex: 1 }}>
              <Text style={styles.muted}>Overall Score</Text>
              <Text style={styles.score}>85</Text>
              <Text style={styles.muted}>
                Based on your last assessment
              </Text>
            </View>
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
                <Text style={styles.activityDate}>2024-01-15</Text>
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

export default Dashboard;
