import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FooterNav from "../components/FooterNav";
import { exercises } from "../config/exercises";

type SportProps = StackScreenProps<RootStackParamList, "SelectSport">;

const sportsList = [
  "Athletics",
  "Football",
  "Basketball",
  "Volleyball",
  "Kabaddi",
  "Wrestling",
  "Cricket",
  "Hockey",
  "Badminton",
  "Table Tennis",
];

const SelectSport: React.FC<SportProps> = ({ navigation }) => {
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedSport) {
      navigation.navigate("Record",{
                        exerciseId: exercises[0].id,
                        exerciseName: exercises[0].key,
                      } ); // Later you can pass sport as param
    } else {
      alert("Please select a sport to continue");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
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
              backgroundColor: selectedSport ? "#7817a1" : "#333",
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
    </SafeAreaView>
  );
};

export default SelectSport;
