// src/pages/Profile.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import FooterNav from "../components/FooterNav";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { getUserProfile, clearStorage } from "../services/storage";

type ProfileProps = StackScreenProps<RootStackParamList, "Profile">;

const Profile: React.FC<ProfileProps> = ({ navigation }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const data = await getUserProfile();
      setUser(data);
      setLoading(false);
    };
    const unsubscribe = navigation.addListener("focus", loadProfile);
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#702186" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Loading profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loading}>
        <Text style={{ color: "#fff" }}>No profile found. Please login.</Text>
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={async () => {
            await clearStorage();
            navigation.replace("Login");
          }}
        >
          <Text style={styles.logoutText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri:
                  user.avatar ||
                  "https://via.placeholder.com/100x100.png?text=Avatar",
              }}
              style={styles.avatar}
            />
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
            <Text style={styles.statValue}>{user.assessments || 0}</Text>
            <Text style={styles.statLabel}>Assessments</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user.submissions || 0}</Text>
            <Text style={styles.statLabel}>Submissions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user.pending || 0}</Text>
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
        </View>

        {/* 🔹 Complete Profile Section */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Complete Your Profile</Text>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate("AddressForm")}
          >
            <Text style={styles.actionBtnText}>
              {user.address ? "Edit Address" : "Add Address"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate("MediaForm")}
          >
            <Text style={styles.actionBtnText}>
              {user.media ? "Update Photos" : "Upload Photos"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={async () => {
          await clearStorage();
          navigation.replace("Login");
        }}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Footer Nav */}
      <FooterNav navigation={navigation} active="Profile" />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d" },
  scrollContainer: { padding: 16, paddingBottom: 120 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backButton: { width: 24 },
  backText: { fontSize: 20, color: "#fff" },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },

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

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
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

  infoSection: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoLabel: { color: "#aaa" },
  infoValue: { color: "#fff" },

  actionBtn: {
    backgroundColor: "#702186",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  actionBtnText: { color: "#fff", textAlign: "center", fontWeight: "bold" },

  logoutBtn: {
    backgroundColor: "#ed6037",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    margin: 16,
  },
  logoutText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  loading: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    justifyContent: "center",
    alignItems: "center",
  },
});
