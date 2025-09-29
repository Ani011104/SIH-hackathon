// src/pages/OtpVerify.tsx

import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { saveAuthToken, savePhone } from "../services/storage";

const API_BASE = "http://10.219.215.138:3001";

// ✅ Toggle mock mode
const MOCK_MODE = true;

type Props = StackScreenProps<RootStackParamList, "OtpVerify">;

export default function OtpVerify({ route, navigation }: Props) {
  const { phone } = route.params;

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const inputs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    inputs.current[0]?.focus();
    if (MOCK_MODE) {
      Alert.alert("OTP Resent", `OTP resent to +91 ${phone}`);
    } else {
      Alert.alert("OTP Resent", `New OTP sent to +91 ${phone}`);
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      Alert.alert("Error", "Please enter the complete 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      if (MOCK_MODE) {
        if (enteredOtp === "650222") {
          await saveAuthToken("mock-token-123");
          await savePhone(phone);
          navigation.replace("Dashboard");
          return;
        } else {
          throw new Error("Invalid OTP");
        }
      }

      // 🔹 Real API call
      const res = await fetch(`${API_BASE}/auth/signup/verifyotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp: enteredOtp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP verification failed");

      if (data.token) await saveAuthToken(data.token);
      if (phone) await savePhone(phone);

      if (data.profileCompleted) {
        navigation.replace("Dashboard");
      } else {
        navigation.replace("AthleteDetails");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Network error or server unavailable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Verify OTP</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>
          A 6-digit code has been sent to{" "}
          <Text style={{ fontWeight: "600", color: "#fff" }}>+91 {phone}</Text>
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, i)}
              onKeyPress={(e) => handleKeyPress(e, i)}
              ref={(el) => {
                if (el) inputs.current[i] = el;
              }}
            />
          ))}
        </View>
      </View>

      {/* Verify Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerBtn, styles.verifyBtn, loading && { opacity: 0.6 }]}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.footerBtnText}>Verify</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Resend OTP */}
      <TouchableOpacity style={styles.resendBtn} onPress={handleResend} disabled={resending}>
        {resending ? (
          <ActivityIndicator color="#7817a1" />
        ) : (
          <Text style={styles.resendText}>Resend OTP</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D0D", paddingTop: 40 },
  header: { alignItems: "center", paddingHorizontal: 16 },
  headerTitle: { fontWeight: "bold", fontSize: 20, color: "#fff" },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  subtitle: { fontSize: 14, color: "#E5E5E5", marginTop: 8 },
  otpContainer: { flexDirection: "row", justifyContent: "center", marginVertical: 32, gap: 12 },
  otpInput: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#374151",
    backgroundColor: "#1f2937",
    textAlign: "center",
    fontSize: 18,
    color: "#fff",
  },
  footer: { flexDirection: "row", justifyContent: "center", padding: 24 },
  footerBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  verifyBtn: { backgroundColor: "#702186" },
  footerBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  resendBtn: { alignItems: "center", marginBottom: 24 },
  resendText: { color: "#7817a1", fontSize: 14, fontWeight: "600" },
});