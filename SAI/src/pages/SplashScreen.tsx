// src/pages/SplashScreen.tsx
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Image,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import LinearGradient from "react-native-linear-gradient";

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
  const rotate1 = useRef(new Animated.Value(0)).current;
  const rotate2 = useRef(new Animated.Value(0)).current;
  const rotate3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 🔄 Animate rings
    const createLoop = (val: Animated.Value, duration: number) =>
      Animated.loop(
        Animated.timing(val, {
          toValue: 1,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );

    createLoop(rotate1, 1500).start();
    createLoop(rotate2, 2000).start();
    createLoop(rotate3, 2500).start();

    // 🔑 Navigation logic
    const checkLogin = async () => {
      const token = await getToken();

      setTimeout(() => {
        if (token) {
          navigation.replace("Dashboard");
        } else {
          navigation.replace("Login");
        }
      }, 2000);
    };

    checkLogin();
  }, []);

  return (
    <LinearGradient
      colors={["#702186", "#130866"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Logo & Title */}
      <View style={styles.centerContent}>
        <Image
          source={{
            uri: "https://via.placeholder.com/150x150.png?text=SAI",
          }}
          style={styles.logo}
        />
        <Text style={styles.title}>SAI</Text>
        <Text style={styles.subtitle}>Fitness Assessment</Text>
      </View>

      {/* Loader rings */}
      <View style={styles.loader}>
        <Animated.View
          style={[
            styles.ring,
            {
              borderBottomColor: "#EFEFFA",
              transform: [
                {
                  rotate: rotate1.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.ring,
            {
              borderRightColor: "#EFEFFA",
              transform: [
                {
                  rotate: rotate2.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.ring,
            {
              borderTopColor: "#EFEFFA",
              transform: [
                {
                  rotate: rotate3.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
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
    borderColor: "#fff",
  },
  title: { fontSize: 36, fontWeight: "900", color: "#fff", marginBottom: 6 },
  subtitle: { fontSize: 18, color: "#ccc", marginBottom: 40 },
  loader: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 64,
  },
  ring: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "transparent",
  },
});