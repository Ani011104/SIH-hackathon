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

const AthleteDetailsForm = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState<Date | null>(null);
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const submitProfile = async () => {
    if (!fullName || !dob || !state || !city || !height || !weight) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      // 🔹 Replace with your backend API call
      setTimeout(() => {
        setLoading(false);
        Alert.alert("Success", "Profile saved successfully");
        navigation.replace("Dashboard");
      }, 1500);
    } catch (error: any) {
      setLoading(false);
      Alert.alert("Error", error.message || "Failed to save profile");
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Athlete Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: "https://via.placeholder.com/96x96.png?text=Avatar",
          }}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.cameraBtn}>
          <Text style={styles.cameraIcon}>📷</Text>
        </TouchableOpacity>
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

      <View style={styles.row}>
        <View style={[styles.formGroup, { flex: 1 }]}>
          <Text style={styles.label}>State</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter State"
            placeholderTextColor="#ae9eb7"
            value={state}
            onChangeText={setState}
          />
        </View>
        <View style={{ width: 12 }} />
        <View style={[styles.formGroup, { flex: 1 }]}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter City"
            placeholderTextColor="#ae9eb7"
            value={city}
            onChangeText={setCity}
          />
        </View>
      </View>

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
        style={styles.submitBtn}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#151117",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 22,
    justifyContent: "space-between",
  },
  backBtn: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  title: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 24, // keeps it centered even with back button
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    backgroundColor: "#702186",
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: "#fff",
  },
  cameraIcon: {
    fontSize: 18,
    color: "#fff",
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    color: "#ae9eb7",
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#322938",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  submitBtn: {
    marginTop: 20,
    backgroundColor: "#7b19b3",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AthleteDetailsForm;
