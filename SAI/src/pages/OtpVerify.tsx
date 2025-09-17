import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = "http://10.237.136.179:5000";


type Props = StackScreenProps<RootStackParamList, "OtpVerify">;

// const MOCK_MODE = true;

export default function OtpVerify({ route, navigation }: Props) {
  const { phone } = route.params;
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
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
    Alert.alert("OTP Resent", `New OTP sent to +91 ${phone}`);
  };


const handleVerify = async () => {
  const enteredOtp = otp.join("");
  if (enteredOtp.length !== 6) {
    Alert.alert("Error", "Please enter the complete 6-digit OTP");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/signup/verifyotp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp: enteredOtp }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "OTP verification failed");

    // ✅ Save token
    if (data.token) {
      await AsyncStorage.setItem("authToken", data.token);
    }

    // ✅ Save phone number
    if (phone) {
      await AsyncStorage.setItem("userPhone", phone);
    }

    // ✅ Navigation
    if (data.profileCompleted) {
      navigation.replace("Dashboard");
    } else {
      navigation.replace("AthleteDetails");
    }
  } catch (err: any) {
    Alert.alert("Error", err.message || "Network error or server unavailable");
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Verification</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>
          A 6-digit code has been sent to{" "}
          <Text style={{ fontWeight: "600", color: "#fff" }}>+91 {phone}</Text>.
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

        <Text style={styles.resendText}>Didn’t receive the code?</Text>
        <TouchableOpacity onPress={handleResend}>
          <Text style={styles.resendBtn}>Resend OTP</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.footerBtn, styles.verifyBtn]} onPress={handleVerify}>
          <Text style={styles.footerBtnText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D0D", paddingTop: 40 },
  header: { alignItems: "center", paddingHorizontal: 16 },
  headerTitle: { fontWeight: "bold", fontSize: 18, color: "#fff" },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  subtitle: { fontSize: 14, color: "#E5E5E5", marginTop: 8 },
  otpContainer: { flexDirection: "row", justifyContent: "center", marginVertical: 32, gap: 12 },
  otpInput: {
    width: 40, height: 40, borderRadius: 8, borderWidth: 1, borderColor: "#E5E5E5",
    textAlign: "center", fontSize: 14, color: "#fff",
  },
  resendText: { textAlign: "center", color: "#E5E5E5" },
  resendBtn: { textAlign: "center", color: "#ed6037", fontWeight: "600", marginTop: 4 },
  footer: { flexDirection: "row", justifyContent: "center", padding: 24 },
  footerBtn: { flex: 1, paddingVertical: 14, borderRadius: 8, alignItems: "center" },
  verifyBtn: { backgroundColor: "#702186" },
  footerBtnText: { color: "#fff", fontWeight: "bold" },
});
