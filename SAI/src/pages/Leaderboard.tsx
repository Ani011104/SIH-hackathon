// src/pages/Leaderboard.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FooterNav from "../components/FooterNav";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock mode toggle
const MOCK_MODE = true;

type LeaderboardProps = StackScreenProps<RootStackParamList, "Leaderboard">;

const Leaderboard: React.FC<LeaderboardProps> = ({ navigation }) => {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      if (MOCK_MODE) {
        console.log("✅ MOCK: Loading leaderboard...");

        // ✅ Hard-coded user score
        const userScore = 85;

        setTimeout(() => {
          const mockPlayers = [
            { rank: 1, name: "Arjun S.", score: 95 },
            { rank: 2, name: "Priya S.", score: 92 },
            { rank: 3, name: "Rohan V.", score: 90 },
            { rank: 4, name: "You", score: userScore },
          ];
          setPlayers(mockPlayers);
          setCurrentUser({ username: "You", score: userScore });
          setLoading(false);
        }, 800);

        return;
      }

      // 🔹 Later: replace with backend call
      // const [leaderRes, userRes] = await Promise.all([getLeaderboard(), getUserProfile()]);
      // if (leaderRes && leaderRes.players) setPlayers(leaderRes.players);
      // if (userRes && userRes.user) setCurrentUser(userRes.user);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Unable to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadLeaderboard);
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#702186" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Loading leaderboard...</Text>
      </View>
    );
  }

  const isInTop = players.some((p) => p.name === currentUser?.username);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
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
              p.name === currentUser?.username && {
                borderColor: "#ed6037",
                borderWidth: 3,
              },
            ]}
          >
            <Text style={styles.medal}>
              {p.rank === 1 ? "🏆" : p.rank === 2 ? "🥈" : "🥉"}
            </Text>
            <ImageBackground
              source={{
                uri:
                  currentUser?.avatar ||
                  "https://via.placeholder.com/80x80.png?text=User",
              }}
              style={[
                styles.avatar,
                {
                  borderColor:
                    p.rank === 1 ? "#ed6037" : p.rank === 2 ? "#e5e5e5" : "#cd7f32",
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
                {
                  backgroundColor:
                    p.rank === 1
                      ? "#ed6037"
                      : p.rank === 2
                      ? "#aaa"
                      : "#cd7f32",
                },
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
              p.name === currentUser?.username && {
                backgroundColor: "rgba(112,33,134,0.6)",
              },
            ]}
          >
            <Text style={styles.rank}>{p.rank}</Text>
            <ImageBackground
              source={{
                uri:
                  currentUser?.avatar ||
                  "https://via.placeholder.com/50x50.png?text=User",
              }}
              style={styles.rowAvatar}
              imageStyle={{ borderRadius: 25 }}
            />
            <Text style={styles.rowName}>{p.name}</Text>
            <Text style={styles.rowScore}>{p.score}</Text>
          </View>
        ))}

        {/* If user not in top list */}
        {!isInTop && currentUser && (
          <View style={[styles.row, { backgroundColor: "rgba(112,33,134,0.6)" }]}>
            <Text style={styles.rank}>{currentUser.rank || players.length + 1}</Text>
            <ImageBackground
              source={{
                uri:
                  currentUser.avatar ||
                  "https://via.placeholder.com/50x50.png?text=User",
              }}
              style={styles.rowAvatar}
              imageStyle={{ borderRadius: 25 }}
            />
            <Text style={styles.rowName}>{currentUser.username}</Text>
            <Text style={styles.rowScore}>{currentUser.score || 0}</Text>
          </View>
        )}
      </ScrollView>

      <FooterNav navigation={navigation} active="Leaderboard" />
    </View>
    </SafeAreaView>
  );
};

export default Leaderboard;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
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