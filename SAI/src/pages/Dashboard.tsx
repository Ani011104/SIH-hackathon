// src/pages/Dashboard.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";


const Dashboard = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialIcons name="settings" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Fitness Assessment */}
        <View>
          <Text style={styles.sectionTitle}>Fitness Assessment</Text>
          <View style={styles.card}>
            <ImageBackground
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzGVLQCJQhq3af7j7Wjs3wqPokJqJFFUyASlNvBJIuUkF_8GUmqxZa-pvS6BJ9iMtTkhFGkbgXgrGeS5tM1y_fWyUR74PWBHciePTQ8VhRWfS1Azv-ZdzbvUdeFBaCJj1UL953VGy3q0R5gMUIQvlO_PA7puaIXaySZYh__Bddem4dnkV6hdKYYPHdp9tFkmYUaOj8OScr8fn7am2wkFcc7aDn4LUJI-Zg8sLavfQExlknXwcLG4l4rPl1xyOoyEhEy0tqm_4XJ6o",
              }}
              style={styles.image}
            />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>Record Your Assessment</Text>
              <Text style={styles.cardText}>
                Start your fitness journey by recording your assessment. Follow
                the instructions carefully and give your best performance.
              </Text>
              <TouchableOpacity style={styles.primaryBtn}>
                <Text style={styles.primaryBtnText}>Start Recording</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Performance Analysis */}
        <View>
          <Text style={styles.sectionTitle}>Performance Analysis</Text>
          <View style={styles.row}>
            <View style={styles.cardSmall}>
              <Text style={styles.cardTitle}>View Your Scores</Text>
              <Text style={styles.cardText}>
                Track your progress and analyze your performance over time.
              </Text>
              <TouchableOpacity style={styles.secondaryBtn}>
                <MaterialIcons name="analytics" size={18} color="#fff" />
                <Text style={styles.secondaryBtnText}>View Scores</Text>
              </TouchableOpacity>
            </View>
            <ImageBackground
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOWUJThiLgjUvqA0wNPM8S6H3a6r2xjDlSDxZAcxHtYsTVp6RlsiSMKoZ5ZH5-bX-wrucGoqZclntQMeL7qSMq4-dqXO3tjMkxP9HKQTzwPMQZ1daFFX74psO31ybYYJ0ikIJqfZiTJuow-bmcLoEe2rgnc9fE0g5Uvl7kqCqjssiL7YOzntNlJuzor7EpCajV-jzbhkFJIfGR74L84PIjNqiqnSdQ1Cf5uBIxasKrwCEQP1aww2r15lL23L2IVW1lDzf8FFlKIlI",
              }}
              style={styles.imageSmall}
              imageStyle={{ borderRadius: 16 }}
            />
          </View>
        </View>

        {/* Leaderboard */}
        <View>
          <Text style={styles.sectionTitle}>Leaderboard</Text>
          <View style={styles.row}>
            <View style={styles.cardSmall}>
              <Text style={styles.cardTitle}>Check Your Ranking</Text>
              <Text style={styles.cardText}>
                See how you stack up against other athletes. Compete for the top
                spot.
              </Text>
              <TouchableOpacity style={styles.secondaryBtn}>
//
                <Text style={styles.secondaryBtnText}>View Leaderboard</Text>
              </TouchableOpacity>
            </View>
            <ImageBackground
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDerhUgUpXa2iq7UELBIc1Ev2r53xqu43Ynzz0zJ6EnV7m4GQnktSA7-fr9Y2rXVER2Y9K-NjVPtdLCbfeSM753wUm8KyHZ4ahmuCWRp3fLyQDcGrMM2WqX_WvyfdLlKYrb6btUsafj7_7wIvlcFU0mK_AiieYfsoohwAYD__byfCnN5BKDhklDL8Gdh_bal147py0Pr55KCyuVth8dV2CliIgu-ryU9WuD6s_4Je1tJEoiBCZvWrRJgQLMOVTN_EgbIGepABNErPE",
              }}
              style={styles.imageSmall}
              imageStyle={{ borderRadius: 16 }}
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem}>
          <MaterialIcons name="home" size={22} color="#fff" />
          <Text style={styles.footerTextActive}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <MaterialIcons name="videocam" size={22} color="#b09eb7" />
          <Text style={styles.footerText}>Record</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <MaterialIcons name="emoji-events" size={22} color="#b09eb7" />
          <Text style={styles.footerText}>Leaderboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <MaterialIcons name="person" size={22} color="#b09eb7" />
          <Text style={styles.footerText}>Profile</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: "rgba(22,17,23,0.9)",
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: { padding: 16, paddingBottom: 100 },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    marginLeft: 8,
  },
  card: {
    backgroundColor: "#231C26",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
  },
  cardBody: { padding: 16 },
  cardTitle: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  cardText: { color: "#b09eb7", fontSize: 13, marginVertical: 6 },
  primaryBtn: {
    backgroundColor: "#7817a1",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  primaryBtnText: { color: "#fff", fontWeight: "bold" },
  row: { flexDirection: "row", gap: 12, marginBottom: 24 },
  cardSmall: {
    flex: 1,
    backgroundColor: "#231C26",
    borderRadius: 16,
    padding: 16,
    justifyContent: "space-between",
  },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#332938",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  secondaryBtnText: { color: "#fff", marginLeft: 6, fontSize: 13 },
  image: { width: "100%", height: 180 },
  imageSmall: { flex: 1, height: 160 },
  footer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#332938",
    backgroundColor: "rgba(35,28,38,0.9)",
    paddingVertical: 8,
    justifyContent: "space-around",
  },
  footerItem: { alignItems: "center" },
  footerText: { color: "#b09eb7", fontSize: 12 },
  footerTextActive: { color: "#fff", fontSize: 12, fontWeight: "600" },
});

export default Dashboard;
