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
import AddressForm from "./src/pages/AddressForm"; // 👈 new

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
  );
}
