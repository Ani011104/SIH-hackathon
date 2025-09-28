// src/pages/AthleteDetailsForm.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "react-native-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPhone, getAuthToken, setProfileCompleted } from "../services/storage";
import i18n from "../i18n";
const API_BASE = "http://10.204.81.179:3001";

const AthleteDetailsForm = ({ navigation }: any) => {
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState<Date | null>(null);
  const [gender, setGender] = useState("Male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [profilePic, setProfilePic] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const pickImage = async () => {
    const options: ImagePicker.ImageLibraryOptions = {
      mediaType: "photo",
      quality: 0.8 as ImagePicker.PhotoQuality,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        setProfilePic(asset); // Store the full asset object
      }
    });
  };

  // Update user profile function
  const updateUser = async (userData: any) => {
    const token = await getAuthToken(); // ✅ Use your service
    
    const response = await fetch(`${API_BASE}/user/updateuser`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update user");
    }

    return await response.json();
  };

  // Upload media function
  const uploadMedia = async (imageAsset: any) => {
    const token = await getAuthToken(); // ✅ Use your service
    
    const formData = new FormData();
    
    const fileObj = {
      uri: imageAsset.uri,
      type: imageAsset.type || "image/jpeg",
      name: imageAsset.fileName || `profile_${Date.now()}.jpg`,
    };
    
    formData.append("media", fileObj as any);

    const response = await fetch(`${API_BASE}/media/upload`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to upload media");
    }

    return await response.json();
  };

  const submitProfile = async () => {
    if (!fullName || !dob || !height || !weight) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      // ✅ Use your storage service
      const phone = await getPhone();
      const token = await getAuthToken();

      if (!phone || !token) {
        throw new Error("User not logged in properly");
      }

      const userData = {
        username: fullName,
        height: Number(height),
        weight: Number(weight),
        gender,
        Dob: dob.toISOString(),
        email: "test@gmail.com",
      };

      await updateUser(userData);

      if (profilePic) {
        await uploadMedia([profilePic]);
      }

      // ✅ Mark profile as completed using your service
      await setProfileCompleted();

      setLoading(false);
      Alert.alert("Success", "Profile saved successfully", [
        { text: "OK", onPress: () => navigation.replace("Dashboard") },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity> */}
        <Text style={styles.title}>{i18n.t("Athlete Profile")}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Profile Photo */}
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={{
              uri:
                profilePic?.uri ||
                "https://via.placeholder.com/120x120.png?text=Upload",
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>
        <Text style={styles.uploadText}>Tap to upload photo</Text>
      </View>

      {/* Form */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          placeholderTextColor="#ae9eb7"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: dob ? "#fff" : "#ae9eb7" }}>
            {dob ? formatDate(dob) : "Select your birth date"}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dob || new Date(2000, 0, 1)}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            maximumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDob(selectedDate);
            }}
          />
        )}
      </View>

      {/* Gender Picker */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={gender}
            dropdownIconColor="#fff"
            style={styles.picker}
            onValueChange={(value) => setGender(value)}
          >
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>
      </View>

      {/* Height & Weight */}
      <View style={styles.row}>
        <View style={[styles.formGroup, { flex: 1 }]}>
          <Text style={styles.label}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 175"
            placeholderTextColor="#ae9eb7"
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
          />
        </View>
        <View style={{ width: 12 }} />
        <View style={[styles.formGroup, { flex: 1 }]}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 70"
            placeholderTextColor="#ae9eb7"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />
        </View>
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={[styles.submitBtn, loading && { opacity: 0.6 }]}
        onPress={submitProfile}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Submit</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AthleteDetailsForm;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#151117" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 22,
    justifyContent: "space-between",
  },
  backBtn: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  title: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 24,
  },
  avatarContainer: { alignItems: "center", marginBottom: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: "#fff" },
  uploadText: { color: "#ae9eb7", marginTop: 6, fontSize: 12 },

  formGroup: { marginBottom: 12 },
  label: { color: "#ae9eb7", fontSize: 14, marginBottom: 4 },
  input: {
    backgroundColor: "#322938",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
  },
  pickerWrapper: { backgroundColor: "#322938", borderRadius: 8 },
  picker: { color: "#fff", height: 50, width: "100%" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  submitBtn: {
    marginTop: 20,
    backgroundColor: "#7b19b3",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
