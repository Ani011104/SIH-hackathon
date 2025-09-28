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
import { getUserProfile, clearStorage } from "../services/storage";
import { SafeAreaView } from "react-native-safe-area-context";
import i18n from "../i18n";
import { Picker } from "@react-native-picker/picker";

type Props = StackScreenProps<RootStackParamList, "Profile">;

const MOCK_MODE = true;

const Profile: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || "en");

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const loadProfile = async () => {
    setLoading(true);
    try {
      if (MOCK_MODE) {
        setTimeout(() => {
          setProfile({
            name: "Chinmai SD",
            role: "Athlete",
            location: "Bangalore, India",
            dob: "17 October 2005",
            height: "180 cm",
            weight: "63 kg",
          });
          setLoading(false);
        }, 800);
        return;
      }
      const res = await getUserProfile();
      if (res?.user) setProfile(res.user);
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{i18n.t("Profile")}</Text>

          <View style={styles.languageWrapper}>
            <Picker
              selectedValue={selectedLanguage}
              dropdownIconColor="#fff"
              style={styles.picker}
              itemStyle={styles.pickerItem}
              onValueChange={(value) => handleLanguageChange(value)}
            >
              <Picker.Item label="English" value="en" />
              <Picker.Item label="हिन्दी" value="hi" />
              <Picker.Item label="ಕನ್ನಡ" value="kn" />
            </Picker>
          </View>
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
            <Text style={styles.sectionTitle}>{i18n.t("Personal Details")}</Text>
            <View style={styles.detailCard}>
              <View style={styles.detailRow}>
                <Text style={styles.label}>{i18n.t("DOB")}</Text>
                <Text style={styles.value}>{profile?.dob}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>{i18n.t("Location")}</Text>
                <Text style={styles.value}>{profile?.location}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>{i18n.t("Height")}</Text>
                <Text style={styles.value}>{profile?.height}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>{i18n.t("Weight")}</Text>
                <Text style={styles.value}>{profile?.weight}</Text>
              </View>
            </View>
          </View>

          {/* Account */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{i18n.t("Account")}</Text>
            <View style={styles.detailCard}>
              <TouchableOpacity
                style={styles.detailRow}
                onPress={() => navigation.navigate("AthleteDetails")}
              >
                <Text style={styles.label}>{i18n.t("Edit Athlete Details")}</Text>
                <MaterialIcons name="chevron-right" size={20} color="#bbb" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.detailRow} onPress={handleLogout}>
                <Text style={[styles.label, { color: "#ff4d4d" }]}>{i18n.t("Logout")}</Text>
                <MaterialIcons name="logout" size={20} color="#ff4d4d" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

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
    padding: 12,
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold", textAlign: "center", flex: 1 },
  languageWrapper: {
    width: 130,
    height: 38,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    justifyContent: "center",
    overflow: "hidden",
  },
  picker: {
    color: "#fff",
    width: "120%",
    height: "150%",
    transform: [{ scale: 0.8 }],
  },
  pickerItem: {
    fontSize: 14,
    color: "#fff",
  },
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
  sectionTitle: { fontSize: 14, fontWeight: "600", color: "#bbb", marginBottom: 8, textTransform: "uppercase" },
  detailCard: { backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", padding: 14, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.1)" },
  label: { color: "#bbb" },
  value: { color: "#fff", fontWeight: "500" },
});