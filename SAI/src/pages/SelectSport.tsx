import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FooterNav from "../components/FooterNav";
import { exercises } from "../config/exercises";

type SportProps = StackScreenProps<RootStackParamList, "SelectSport">;

const sportsList = [
  "Sprint",
  "Run",
  "Long Jump",
  "High Jump",
  "Shot Put",
  "Discus Throw",
  "Javelin Throw",
  "Relay Race",
  "Hurdles",
  "Triple Jump",
  "Marathon / Long Distance Run",
  "Others",
];

const SelectSport: React.FC<SportProps> = ({ navigation }) => {
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [height, setHeight] = useState<string>(""); // in cm
  const [weight, setWeight] = useState<string>(""); // in kg

  const handleNext = () => {
    if (!height || !weight) {
      alert("Please enter both height and weight.");
      return;
    }
    if (selectedSport) {
      navigation.navigate("Record", {
        exerciseId: exercises[0].id,
        exerciseName: exercises[0].key,
        // You can also pass height and weight if needed
        // height: height,
        // weight: weight,
      });
    } else {
      alert("Please select a sport to continue");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          {/* HEADER */}
          <View style={{ padding: 14 }}>
            <Text
              style={{
                color: "#7817a1",
                fontSize: 28,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 2,
              }}
            >
              All the Best For
            </Text>
            <Text
              style={{
                color: "#7817a1",
                fontSize: 28,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              Your Test
            </Text>

            {/* HEIGHT & WEIGHT INPUTS */}
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                fontWeight: "600",
                marginLeft: 8,
                marginBottom: 8,
              }}
            >
              Athlete Details
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <TextInput
                placeholder="Height (cm)"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
                style={{
                  flex: 1,
                  backgroundColor: "#1E1E1E",
                  color: "#fff",
                  paddingVertical: 12,
                  paddingHorizontal: 14,
                  borderRadius: 10,
                  marginRight: 8,
                  borderWidth: 1,
                  borderColor: "rgba(78, 71, 71, 0.6)",
                }}
              />
              <TextInput
                placeholder="Weight (kg)"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
                style={{
                  flex: 1,
                  backgroundColor: "#1E1E1E",
                  color: "#fff",
                  paddingVertical: 12,
                  paddingHorizontal: 14,
                  borderRadius: 10,
                  marginLeft: 8,
                  borderWidth: 1,
                  borderColor: "rgba(78, 71, 71, 0.6)",
                }}
              />
            </View>

            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                fontWeight: "600",
                marginLeft: 8,
                marginBottom: 8,
              }}
            >
              Select Your Sport
            </Text>
          </View>

          {/* SPORTS LIST */}
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 20,
            }}
          >
            {sportsList.map((sport, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedSport(sport)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor:
                    selectedSport === sport ? "#7817a1" : "#1E1E1E",
                  paddingVertical: 14,
                  paddingHorizontal: 20,
                  borderRadius: 12,
                  marginBottom: 10,
                  borderWidth: 1,
                  borderColor:
                    selectedSport === sport
                      ? "#7817a1"
                      : "rgba(78, 71, 71, 0.6)",
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  {sport}
                </Text>
                {selectedSport === sport && (
                  <MaterialIcons name="check-circle" size={24} color="#fff" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* NEXT BUTTON */}
          <View
            style={{
              padding: 16,
              borderTopWidth: 0.5,
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            <TouchableOpacity
              onPress={handleNext}
              style={{
                backgroundColor:
                  selectedSport && height && weight ? "#7817a1" : "#333",
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Continue
              </Text>
            </TouchableOpacity>
          </View>

          {/* FOOTER NAV */}
          <FooterNav navigation={navigation} active="" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SelectSport;
