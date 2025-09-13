import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "./src/pages/Login";
import OtpVerify from "./src/pages/OtpVerify";
import AthleteDetailsForm from "./src/pages/AthleteDetailsForm";
import Dashboard from "./src/pages/Dashboard";
import Leaderboard from "./src/pages/Leaderboard";

export type RootStackParamList = {
  Login: undefined;
  OtpVerify: { phone: string };
  AthleteDetails: undefined;
  Dashboard: undefined;
  Leaderboard: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="OtpVerify" component={OtpVerify} />
        <Stack.Screen name="AthleteDetails" component={AthleteDetailsForm} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Leaderboard" component={Leaderboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
