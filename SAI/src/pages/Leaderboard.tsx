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
import { currentUser } from "../config/user";

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

const Leaderboard: React.FC<LeaderboardProps> = ({ navigation }) => {
  const isInTop10 = players.some((p) => p.name === currentUser.name);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Podium */}
      <View style={styles.podiumContainer}>
        {players.slice(0, 3).map((p) => (
          <View
            key={p.rank}
            style={[
              styles.podiumItem,
              p.name === currentUser.name && {
                borderColor: "#ed6037",
                borderWidth: 3,
              },
            ]}
          >
            <Text style={styles.medal}>{p.medal}</Text>
            <ImageBackground
              source={{ uri: currentUser.avatar }}
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

      {/* Leaderboard List */}
      <ScrollView style={styles.list}>
        {players.slice(3).map((p) => (
          <View
            key={p.rank}
            style={[
              styles.row,
              p.name === currentUser.name && {
                backgroundColor: "rgba(112,33,134,0.6)",
              },
            ]}
          >
            <Text style={styles.rank}>{p.rank}</Text>
            <ImageBackground
              source={{ uri: currentUser.avatar }}
              style={styles.rowAvatar}
              imageStyle={{ borderRadius: 25 }}
            />
            <Text style={styles.rowName}>{p.name}</Text>
            <Text style={styles.rowScore}>{p.score}</Text>
          </View>
        ))}

        {/* If user not in top 10 */}
        {!isInTop10 && (
          <View style={[styles.row, { backgroundColor: "rgba(112,33,134,0.6)" }]}>
            <Text style={styles.rank}>15</Text>
            <ImageBackground
              source={{ uri: currentUser.avatar }}
              style={styles.rowAvatar}
              imageStyle={{ borderRadius: 25 }}
            />
            <Text style={styles.rowName}>{currentUser.name}</Text>
            <Text style={styles.rowScore}>{currentUser.score}</Text>
          </View>
        )}
      </ScrollView>

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
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  podiumContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginVertical: 20,
  },
  podiumItem: { alignItems: "center" },
  medal: { fontSize: 28, marginBottom: 6 },
  avatar: { width: 60, height: 60, borderRadius: 50 },
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
