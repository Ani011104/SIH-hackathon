import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { savePhone } from "../services/storage";

type Props = StackScreenProps<RootStackParamList, "Login">;

// // Mock toggle
// const MOCK_MODE = true;

const API_BASE = "http://10.237.136.179:5000";


export default function Login({ navigation }: Props) {
  const [phone, setPhone] = useState("");

  const handleSendOtp = async () => {
  if (phone.length !== 10) {
    alert("Please enter a valid 10-digit mobile number");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/signup/sendotp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to send OTP");

    await savePhone(phone);
    navigation.navigate("OtpVerify", { phone });
  } catch (err: any) {
    alert(err.message || "Network error or server unavailable");
  }
};

  return (
    <View style={{ flex: 1, backgroundColor: "#0D0D0D" }}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={{
          uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEv35Uzvy7kCwO_yKeelV8kVrBJ-mKwjaqaIF4i6QIpcKVVhMb3VvweOHl9Mqk4_wn4isBWa2pKJgbYKZWa0z6fydAfvxdGdUIb8Krv1WRDPSNlPlaplfV9xD3-UsTEV4xnF4Xfuumw-4RrDmV0ACbkyhFzReHcxCBVj5vQXGNJUxKeCMrrOn9V_DC3vIOZ3lXm1pzueKGzIsE09pltz4vzBU_R8dMFVn-Atmb_UWRsviAkRpbD-dsXtabn7WVUf0ccQ__HJtTQbY",
        }}
        style={styles.hero}
      >
        <View style={styles.heroOverlay} />
        <View style={styles.heroCenter}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>⬆</Text>
          </View>
          <Text style={styles.appTitle}>SAI Fitness</Text>
          <Text style={styles.appSubtitle}>Empowering Athletes</Text>
        </View>
      </ImageBackground>

      <View style={styles.formContainer}>
        <Text style={styles.loginTitle}>Login</Text>
        <Text style={styles.loginSubtitle}>
          Enter your mobile number to continue
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your mobile number"
          placeholderTextColor="#9ca3af"
          keyboardType="numeric"
          maxLength={10}
          value={phone}
          onChangeText={setPhone}
        />

        <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
          <Text style={styles.buttonText}>Send OTP</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to our{" "}
          <Text style={styles.link}>Terms of Service</Text> and{" "}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { height: 300, width: "100%" },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(13,13,13,0.6)" },
  heroCenter: { flex: 1, justifyContent: "center", alignItems: "center" },
  logoCircle: { backgroundColor: "#fff", borderRadius: 50, padding: 20, marginBottom: 16 },
  logoIcon: { fontSize: 32, color: "#702186" },
  appTitle: { fontSize: 32, fontWeight: "bold", color: "#fff" },
  appSubtitle: { marginTop: 8, fontSize: 16, color: "#E5E5E5" },
  formContainer: { flex: 1, paddingHorizontal: 24, paddingVertical: 32 },
  loginTitle: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 8 },
  loginSubtitle: { fontSize: 14, color: "#E5E5E5", marginBottom: 24 },
  input: {
    width: "100%", borderRadius: 12, borderWidth: 2, borderColor: "#374151",
    backgroundColor: "#1f2937", paddingHorizontal: 16, paddingVertical: 12,
    color: "#fff", fontSize: 16,
  },
  button: {
    marginTop: 24, backgroundColor: "#702186", borderRadius: 12,
    paddingVertical: 14, alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  footer: { paddingHorizontal: 24, paddingVertical: 16 },
  footerText: { fontSize: 12, textAlign: "center", color: "#6b7280" },
  link: { color: "#ed6037", textDecorationLine: "underline" },
});
