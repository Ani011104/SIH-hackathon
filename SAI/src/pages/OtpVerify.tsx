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
import { verifyLoginOtp, sendLoginOtp } from "../services/api"; // ✅ Login OTP
import { saveToken, savePhone } from "../services/storage";

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

  // ✅ Verify OTP
  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      Alert.alert("Error", "Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const data = await verifyLoginOtp(phone, enteredOtp);
      console.log("Login verify response:", data);

      if (!data.token) throw new Error(data.message || "OTP verification failed");

      await saveToken(data.token);
      await savePhone(phone);

      // ✅ Always go to Dashboard after login
      navigation.replace("Dashboard");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Resend OTP
  const handleResendOtp = async () => {
    try {
      setResending(true);
      const res = await sendLoginOtp(phone);
      if (res.message?.includes("OTP")) {
        Alert.alert("Success", "OTP resent successfully");
      } else {
        Alert.alert("Error", res.message || "Failed to resend OTP");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Network error");
    } finally {
      setResending(false);
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
      <TouchableOpacity
        style={styles.resendBtn}
        onPress={handleResendOtp}
        disabled={resending}
      >
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

  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 32,
    gap: 12,
  },
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
  footerBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  verifyBtn: { backgroundColor: "#702186" },
  footerBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  resendBtn: { alignItems: "center", marginBottom: 24 },
  resendText: { color: "#7817a1", fontSize: 14, fontWeight: "600" },
});