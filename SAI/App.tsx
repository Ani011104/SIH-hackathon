import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import SplashScreen from "./src/pages/SplashScreen";
import Login from "./src/pages/Login";
import OtpVerify from "./src/pages/OtpVerify";
import AthleteDetailsForm from "./src/pages/AthleteDetailsForm";
import AddressForm from "./src/pages/AddressForm";
import MediaForm from "./src/pages/MediaForm";
import Record from "./src/pages/Record";
import ScoreAnalysis from "./src/pages/ScoreAnalysis";
import Dashboard from "./src/pages/Dashboard";
import Profile from "./src/pages/Profile";
import Leaderboard from "./src/pages/Leaderboard";
import Events from "./src/pages/Events";
import SelectSport from "./src/pages/SelectSport";
import Processing from "./src/pages/Processing";

import AssessmentResults from "./src/pages/AssessmentResults";
import {SafeAreaProvider} from "react-native-safe-area-context";
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

// Define navigation param types
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  OtpVerify: { phone: string };
  AthleteDetails: undefined;
  AddressForm: undefined;
  MediaForm: undefined;
  Record: { exerciseId: string; exerciseName: string };
  Processing: { videoPath: string; exerciseIndex: string };
  ScoreAnalysis: undefined;
  AssessmentResults: { results: any };
  Dashboard: undefined;
  Profile: undefined;
  Leaderboard: undefined;
  Events: undefined;
  SelectSport: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <SafeAreaProvider>  
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false, // hide default headers
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="OtpVerify" component={OtpVerify} />
        <Stack.Screen name="AthleteDetails" component={AthleteDetailsForm} />
        <Stack.Screen name="AddressForm" component={AddressForm} />
        <Stack.Screen name="MediaForm" component={MediaForm} />
        <Stack.Screen name="Record" component={Record} />
          <Stack.Screen name="Processing" component={Processing} />
        <Stack.Screen name="ScoreAnalysis" component={ScoreAnalysis} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Leaderboard" component={Leaderboard} />
        <Stack.Screen name="Events" component={Events} />
        <Stack.Screen name="SelectSport" component={SelectSport} />
        <Stack.Screen name="AssessmentResults" component={AssessmentResults} />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
