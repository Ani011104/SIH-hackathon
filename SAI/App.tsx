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
import Dashboard from "./src/pages/Dashboard";
import Profile from "./src/pages/Profile";
import Leaderboard from "./src/pages/Leaderboard";
import Processing from "./src/pages/Processing";
import ScoreAnalysis from "./src/pages/ScoreAnalysis";

// Define navigation param types
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  OtpVerify: { phone: string };
  AthleteDetails: undefined;
  AddressForm: undefined;
  MediaForm: undefined;
  Record: { exerciseId: string; exerciseName: string };
  Processing: { videoPath: string; exerciseId: string };
  Dashboard: undefined;
  Profile: undefined;
  Leaderboard: undefined;
  ScoreAnalysis: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
