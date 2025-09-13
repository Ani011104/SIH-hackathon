import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import FooterNav from "../components/FooterNav";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";

type ProfileProps = StackScreenProps<RootStackParamList, "Profile">;

const Profile: React.FC<ProfileProps> = ({ navigation }) => {
  // Later, replace these with values fetched from API
  const user = {
    name: "Arjun Sharma",
    role: "Athlete",
    id: "123456789",
    dob: "15th August 2002",
    gender: "Male",
    sport: "Badminton",
    contact: "+91 9876543210",
    assessments: 12,
    submissions: 5,
    pending: 3,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCS9lrriXWTRU8Jo5pmyPT5fEHjefNr11pDgBNgw8FY01uwcH8XZLurX1IGJPmbYEoM6ccGTlOt1zL3bM1MbDxONYoVlxwzL2T61neBQp_K-jTKwBKyQIyLKdaELZSAF-c7_Pb4e1ZtiwKW9r-rExhzm9Xyv4-A_GmLFhXFcDUjnjT-kPZJrnv7JrACxGZ6wiGOedT-Gmx7KgYPrO395aS1OZV5nODP451q3KYWvNwQqrQJEXrq367RouI0T6H9bjqtuSC60F8_zpY",
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <TouchableOpacity style={styles.editButton}>
              <Text style={{ color: "#fff", fontSize: 12 }}>✎</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.role}>{user.role}</Text>
          <Text style={styles.userId}>ID: {user.id}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user.assessments}</Text>
            <Text style={styles.statLabel}>Assessments</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user.submissions}</Text>
            <Text style={styles.statLabel}>Submissions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* Personal Info */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date of Birth</Text>
            <Text style={styles.infoValue}>{user.dob}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gender</Text>
            <Text style={styles.infoValue}>{user.gender}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Sport</Text>
            <Text style={styles.infoValue}>{user.sport}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Contact</Text>
            <Text style={styles.infoValue}>{user.contact}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Nav */}
      <FooterNav navigation={navigation} active="Profile" />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d" },
  scrollContainer: { padding: 16, paddingBottom: 80 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backButton: { width: 24 },
  backText: { fontSize: 20, color: "#fff" },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 20, fontWeight: "bold", color: "#fff" },

  profileSection: { alignItems: "center", marginBottom: 20 },
  avatarWrapper: { position: "relative" },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#702186",
    borderRadius: 12,
    padding: 4,
  },
  name: { fontSize: 22, fontWeight: "bold", color: "#fff", marginTop: 10 },
  role: { fontSize: 16, color: "#aaa" },
  userId: { fontSize: 12, color: "#666" },

  statsContainer: { flexDirection: "row", justifyContent: "space-between", marginVertical: 20 },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  statValue: { fontSize: 20, fontWeight: "bold", color: "#ed6037" },
  statLabel: { fontSize: 12, color: "#aaa" },

  infoSection: { backgroundColor: "#1e1e1e", borderRadius: 12, padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  infoLabel: { color: "#aaa" },
  infoValue: { color: "#fff" },
});
