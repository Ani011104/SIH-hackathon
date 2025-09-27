// src/pages/AssessmentResults.tsx
import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import FooterNav from "../components/FooterNav";
import Icon from "react-native-vector-icons/MaterialIcons";

type Props = StackScreenProps<RootStackParamList, "AssessmentResults">;

const AssessmentResults: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assessment Results</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {/* Congrats Section */}
        <View style={styles.centerText}>
          <Text style={styles.congratsText}>Congratulations, Aarav!</Text>
          <Text style={styles.subText}>You've successfully completed the entire fitness assessment.</Text>
        </View>

        {/* Score Summary */}
        <View style={styles.row}>
          <View style={styles.scoreCard}>
            <Text style={styles.cardLabel}>Total Score</Text>
            <Text style={styles.cardValue}>85/100</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.cardLabel}>Overall Rating</Text>
            <Text style={styles.cardValue}>Excellent</Text>
          </View>
        </View>

        {/* Individual Exercises */}
        <Text style={styles.sectionTitle}>Individual Exercise Results</Text>
        <View style={{ marginTop: 12 }}>
          {[
            { icon: "self-improvement", name: "Push-ups", result: "30 reps" },
            { icon: "directions-run", name: "Squats", result: "40 reps" },
            { icon: "accessibility", name: "Sit-ups", result: "25 reps" },
           { icon: "vertical-align-top", name: "Vertical Jump", result: "2.1m" },
            { icon: "fitness-center", name: "Long Jump", result: "3.5m" },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={styles.exerciseCard}>
              <View style={styles.exerciseLeft}>
                <MaterialIcons name={item.icon as any} size={28} color="#7817a1" />
                <View>
                  <Text style={styles.exerciseTitle}>{item.name}</Text>
                  <Text style={styles.exerciseResult}>
                    Result: <Text style={styles.bold}>{item.result}</Text>
                  </Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={22} color="#bbb" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Insights */}
        <Text style={styles.sectionTitle}>Overall Analysis & Insights</Text>
        <View style={styles.insightBox}>
          <Text style={styles.insightText}>
            Your results show exceptional lower body power and excellent agility. Your speed is competitive,
            while upper body strength and flexibility show room for improvement. Focusing on strength training
            and dynamic stretching could elevate your overall performance significantly.
          </Text>
        </View>

        {/* Submit Button */}
       // inside AssessmentResults component
<TouchableOpacity
  style={styles.submitBtn}
  onPress={() => {
    // Send results to leaderboard
    navigation.replace("Leaderboard");
  }}
>
  <Text style={styles.submitText}>Submit All Results to SAI</Text>
</TouchableOpacity>
      </ScrollView>

      <FooterNav navigation={navigation} active="Record" />
    </SafeAreaView>
  );
};

export default AssessmentResults;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  centerText: { alignItems: "center", marginVertical: 16 },
  congratsText: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  subText: { color: "#aaa", textAlign: "center", marginTop: 6 },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  scoreCard: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "rgba(119,23,161,0.2)",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cardLabel: { color: "#7817a1", fontWeight: "600" },
  cardValue: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#fff", marginTop: 20 },
  exerciseCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    marginBottom: 8,
  },
  exerciseLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  exerciseTitle: { fontSize: 16, fontWeight: "600", color: "#fff" },
  exerciseResult: { fontSize: 13, color: "#aaa" },
  bold: { fontWeight: "bold", color: "#fff" },
  insightBox: { backgroundColor: "rgba(255,255,255,0.05)", padding: 16, borderRadius: 12, marginTop: 12 },
  insightText: { color: "#ccc", lineHeight: 20 },
  submitBtn: { backgroundColor: "#7817a1", paddingVertical: 16, borderRadius: 12, marginTop: 24, alignItems: "center" },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});