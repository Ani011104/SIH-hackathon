// src/pages/Leaderboard.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FooterNav from "../components/FooterNav";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";

type LeaderboardProps = StackScreenProps<RootStackParamList, "Leaderboard">;

const players = [
  { rank: 1, name: "Arjun S.", score: 95, medal: "🏆", color: "#ed6037" },
  { rank: 2, name: "Priya S.", score: 92, medal: "🥈", color: "#e5e5e5" },
  { rank: 3, name: "Rohan V.", score: 90, medal: "🥉", color: "#CD7F32" },
  { rank: 4, name: "Ananya Patel", score: 88 },
  { rank: 5, name: "Vikram Kapoor", score: 85 },
  { rank: 6, name: "Neha Reddy", score: 82 },
  { rank: 7, name: "Aditya Kumar", score: 80 },
  { rank: 8, name: "Shreya Gupta", score: 78 },
  { rank: 9, name: "Ishaan Joshi", score: 75 },
  { rank: 10, name: "Kavya Iyer", score: 72 },
];

// 🔹 Replace with logged-in user
const currentUser = "Kavya Iyer";

const Leaderboard: React.FC<LeaderboardProps> = ({ navigation }) => {
  // Check if current user is in top 10
  const isInTop10 = players.some((p) => p.name === currentUser);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={22} color="#fff" marginTop={12} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Podium Top 3 */}
      <View style={styles.podiumContainer}>
        {players.slice(0, 3).map((p, i) => (
          <View
            key={i}
            style={[
              styles.podiumItem,
              p.name === currentUser && {
                borderColor: "#ed6037",
                borderWidth: 3,
              },
            ]}
          >
            <Text style={styles.medal}>{p.medal}</Text>
            <ImageBackground
              source={{ uri: "https://placehold.co/100x100" }}
              style={[
                styles.avatar,
                {
                  borderColor: p.color || "#fff",
                  borderWidth: p.rank === 1 ? 4 : 2,
                  width: p.rank === 1 ? 80 : 60,
                  height: p.rank === 1 ? 80 : 60,
                },
              ]}
              imageStyle={{ borderRadius: 50 }}
            />
            <View
              style={[
                styles.podiumLabel,
                { backgroundColor: p.color || "rgba(255,255,255,0.2)" },
              ]}
            >
              <Text style={styles.name}>{p.name}</Text>
              <Text style={styles.score}>{p.score}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Rest of Leaderboard */}
      <ScrollView style={styles.list}>
        {players.slice(3).map((p) => (
          <View
            key={p.rank}
            style={[
              styles.row,
              p.name === currentUser && {
                backgroundColor: "rgba(112,33,134,0.6)",
              },
            ]}
          >
            <Text style={styles.rank}>{p.rank}</Text>
            <ImageBackground
              source={{ uri: "https://placehold.co/80x80" }}
              style={styles.rowAvatar}
              imageStyle={{ borderRadius: 25 }}
            />
            <Text style={styles.rowName}>{p.name}</Text>
            <Text style={styles.rowScore}>{p.score}</Text>
          </View>
        ))}

        {/* User not in top 10 */}
        {!isInTop10 && (
          <View
            style={[styles.row, { backgroundColor: "rgba(112,33,134,0.6)" }]}
          >
            <Text style={styles.rank}>15</Text>
            <ImageBackground
              source={{ uri: "https://placehold.co/80x80" }}
              style={styles.rowAvatar}
              imageStyle={{ borderRadius: 25 }}
            />
            <Text style={styles.rowName}>{currentUser}</Text>
            <Text style={styles.rowScore}>65</Text>
          </View>
        )}
      </ScrollView>

      {/* Footer Navigation */}
      <FooterNav navigation={navigation} active="Leaderboard" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#161117" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold",marginTop: 12 },
  podiumContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginVertical: 20,
  },
  podiumItem: { alignItems: "center" },
  medal: { fontSize: 28, marginBottom: 6 },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 2,
  },
  podiumLabel: {
    marginTop: 6,
    padding: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  name: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  score: { color: "#fff", fontSize: 12 },
  list: { flex: 1, paddingHorizontal: 16 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  rank: { color: "#fff", width: 24, fontSize: 14, fontWeight: "bold" },
  rowAvatar: { width: 50, height: 50, marginHorizontal: 12 },
  rowName: { flex: 1, color: "#fff", fontSize: 15 },
  rowScore: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});

export default Leaderboard;
