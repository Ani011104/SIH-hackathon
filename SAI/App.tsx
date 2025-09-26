// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Screens
import SplashScreen from "./src/pages/SplashScreen";
import Login from "./src/pages/Login";
import OtpVerify from "./src/pages/OtpVerify";
import AthleteDetailsForm from "./src/pages/AthleteDetailsForm";
import Dashboard from "./src/pages/Dashboard";
import Record from "./src/pages/Record";
import Leaderboard from "./src/pages/Leaderboard";
import Profile from "./src/pages/Profile";
import MediaForm from "./src/pages/MediaForm";   // 👈 new
import AddressForm from "./src/pages/AddressForm";
import {SafeAreaProvider} from "react-native-safe-area-context"; // 👈 new
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = "http://10.204.81.179:3001";

export const checkAuthAndProfile = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const phone = await AsyncStorage.getItem("userPhone");
    
    if (!token || !phone) {
      return { isAuthenticated: false, profileCompleted: false };
    }

    // Check profile status from server
    const response = await fetch(`${API_BASE}/user/profile-status`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // If token is invalid, clear storage
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("userPhone");
      return { isAuthenticated: false, profileCompleted: false };
    }

    const data = await response.json();
    return { 
      isAuthenticated: true, 
      profileCompleted: data.profileCompleted || false 
    };
    
  } catch (error) {
    console.error("Auth check error:", error);
    return { isAuthenticated: false, profileCompleted: false };
  }
};

// Alternative approach - check if user data exists locally
export const checkLocalProfileCompletion = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const phone = await AsyncStorage.getItem("userPhone");
    
    if (!token || !phone) {
      return { isAuthenticated: false, profileCompleted: false };
    }

    // You could store a flag when profile is completed
    const profileCompleted = await AsyncStorage.getItem("profileCompleted");
    
    return { 
      isAuthenticated: true, 
      profileCompleted: profileCompleted === "true" 
    };
    
  } catch (error) {
    console.error("Local auth check error:", error);
    return { isAuthenticated: false, profileCompleted: false };
  }
};

// Define all screens for navigation
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  OtpVerify: { phone: string };
  AthleteDetails: undefined;
  Dashboard: undefined;
  Record: { exerciseId: string; exerciseName: string };
  Leaderboard: undefined;
  Profile: undefined;
  MediaForm: undefined;   // 👈 new
  AddressForm: undefined; // 👈 new
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>  
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Initial Screen */}
        <Stack.Screen name="Splash" component={SplashScreen} />

        {/* Auth Flow */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="OtpVerify" component={OtpVerify} />
        <Stack.Screen name="AthleteDetails" component={AthleteDetailsForm} />

        {/* Main App Flow */}
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Record" component={Record} />
        <Stack.Screen name="Leaderboard" component={Leaderboard} />
        <Stack.Screen name="Profile" component={Profile} />

        {/* Profile Sub-Forms */}
        <Stack.Screen name="MediaForm" component={MediaForm} />
        <Stack.Screen name="AddressForm" component={AddressForm} />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
}
