// src/pages/Profile.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FooterNav from "../components/FooterNav";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { getUserProfile } from "../services/storage";
import { clearStorage } from "../services/storage";
import {SafeAreaView} from "react-native-safe-area-context";

type Props = StackScreenProps<RootStackParamList, "Profile">;

const MOCK_MODE = true; // ✅ Toggle ON for offline testing

const Profile: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  const loadProfile = async () => {
    setLoading(true);
    try {
      if (MOCK_MODE) {
        setTimeout(() => {
          setProfile({
            name: "Chinmai SD",
            role: "Athlete",
            location: "Bangalore, India",
            dob: "17 october 2005",
            height: "180 cm",
            weight: "63 kg",
          });
          setLoading(false);
        }, 800);
        return;
      }

      const res = await getUserProfile();
      if (res?.user) {
        setProfile(res.user);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadProfile);
    return unsubscribe;
  }, [navigation]);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await clearStorage();
          navigation.replace("Login");
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#7817a1" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#121212'}}>
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity>
          <MaterialIcons name="more-vert" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar & Info */}
        <View style={styles.center}>
          <View style={styles.avatarWrapper}>
            <ImageBackground
              source={{
                uri:
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuBxf9cWl33htLElQdCkGPCvcGQlswJmnjAtS2g5y70rFFQfsawNF_BKlFdMTKeDqcYbgVQJGgBGmCgUVEl1Q8XkXbrKikSoOBYXycfK2AWfr6M5ksZrI14BO4HRa-sJjFsOrHOJca4eW5nML82qlXIHO6PnXja52rtUyiwGFtANpqXm6RpiLmU5VoxCz7ms7BmCP3HntQJ5WZd242eWEGganS6LSxHyHSEZF2Nm3uX4ftyAjYvoC6Wdu9qWqMP-54vP_qrjsAuZbFo",
              }}
              style={styles.avatar}
              imageStyle={{ borderRadius: 64 }}
            />
            <TouchableOpacity style={styles.avatarEdit}>
              <MaterialIcons name="edit" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{profile?.name}</Text>
          <Text style={styles.role}>{profile?.role}</Text>
          <Text style={styles.location}>{profile?.location}</Text>
        </View>

        {/* Personal Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Details</Text>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Date of Birth</Text>
              <Text style={styles.value}>{profile?.dob}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.value}>{profile?.location}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Height</Text>
              <Text style={styles.value}>{profile?.height}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Weight</Text>
              <Text style={styles.value}>{profile?.weight}</Text>
            </View>
          </View>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.detailCard}>
            <TouchableOpacity
              style={styles.detailRow}
              onPress={() => navigation.navigate("AthleteDetails")}
            >
              <Text style={styles.label}>Settings</Text>
              <MaterialIcons name="chevron-right" size={20} color="#bbb" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.detailRow} onPress={handleLogout}>
              <Text style={[styles.label, { color: "#ff4d4d" }]}>Logout</Text>
              <MaterialIcons name="logout" size={20} color="#ff4d4d" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <FooterNav navigation={navigation} active="Profile" />
     
    </View>
     </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  scrollContent: { padding: 16, paddingBottom: 100 },
  center: { alignItems: "center", marginBottom: 20 },
  avatarWrapper: { position: "relative" },
  avatar: { width: 128, height: 128, borderRadius: 64 },
  avatarEdit: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#7817a1",
    padding: 6,
    borderRadius: 20,
  },
  name: { fontSize: 22, fontWeight: "bold", color: "#fff", marginTop: 8 },
  role: { fontSize: 16, color: "#bbb" },
  location: { fontSize: 14, color: "#aaa" },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#bbb",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  detailCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  label: { color: "#bbb" },
  value: { color: "#fff", fontWeight: "500" },
});