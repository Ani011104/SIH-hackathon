// src/pages/AddressForm.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { saveAddress } from "../services/api";

type Props = StackScreenProps<RootStackParamList, "AddressForm">;

const AddressForm: React.FC<Props> = ({ navigation }) => {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!address || !city || !state || !pincode) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (pincode.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit pincode");
      return;
    }

    setLoading(true);
    const res = await saveAddress({ address, city, state, pincode });
    setLoading(false);

    if (res.success) {
      Alert.alert("Success", "Address saved successfully!");
      navigation.goBack();
    } else {
      Alert.alert("Error", res.message || "Failed to save address");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>Complete Your Address</Text>
      <Text style={styles.subtitle}>
        Please provide your current residential details.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Address"
        placeholderTextColor="#888"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter City"
        placeholderTextColor="#888"
        value={city}
        onChangeText={setCity}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter State"
        placeholderTextColor="#888"
        value={state}
        onChangeText={setState}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Pincode"
        placeholderTextColor="#888"
        keyboardType="numeric"
        maxLength={6}
        value={pincode}
        onChangeText={setPincode}
      />

      <TouchableOpacity
        style={[styles.submitBtn, loading && { opacity: 0.5 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitText}>
          {loading ? "Saving..." : "Save Address"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddressForm;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d" },
  title: { fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 8 },
  subtitle: { color: "#aaa", marginBottom: 20 },
  input: {
    backgroundColor: "#1e1e1e",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  submitBtn: {
    backgroundColor: "#702186",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
