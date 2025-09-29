// src/pages/SplashScreen.tsx
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Image,
  Dimensions,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import LinearGradient from "react-native-linear-gradient";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// storage helpers
import { getToken } from "../services/storage";

type SplashScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Splash"
>;

interface Props {
  navigation: SplashScreenNavigationProp;
}

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const screenWidth = Dimensions.get("window").width;
  const runAnim = useRef(new Animated.Value(-50)).current; // start off-screen left

  useEffect(() => {
    // 🏃 Animate runner once
    Animated.timing(runAnim, {
      toValue: screenWidth, // run across to right
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    // 🔑 Navigation logic
    const checkLogin = async () => {
      const token = await getToken();
      setTimeout(() => {
        if (token) {
          navigation.replace("Dashboard");
        } else {
          navigation.replace("Login");
        }
      }, 2500);
    };

    checkLogin();
  }, []);

  return (
    <LinearGradient
      colors={["#3c1059ff", "#000000ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Logo & Title */}
      <View style={styles.centerContent}>
        <Image
          source={require("../resources/icon.png")} // ✅ your app logo PNG
          style={styles.logo}
        />
        <Text style={styles.title}>SAI</Text>
        <Text style={styles.subtitle}>Fitness Assessment</Text>
      </View>

      {/* Runner animation */}
      <Animated.View
        style={[
          styles.runnerContainer,
          { transform: [{ translateX: runAnim }] },
        ]}
      >
        <MaterialIcons name="directions-run" size={42} color="#fff" />
      </Animated.View>
    </LinearGradient>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  centerContent: { alignItems: "center" },
  logo: {
    height: 128,
    width: 128,
    marginBottom: 20,
    borderRadius: 64,
    borderWidth: 2,
    borderColor: "#000000ff",
  },
  title: { fontSize: 36, fontWeight: "900", color: "#fff", marginBottom: 6 },
  subtitle: { fontSize: 18, color: "#ccc", marginBottom: 40 },
  runnerContainer: {
    position: "absolute",
    bottom: 80, // slightly above bottom
    left: 0,
  },
});