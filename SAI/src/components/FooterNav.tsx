// src/components/FooterNav.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { RootStackParamList } from "../../App";
import { StackNavigationProp } from "@react-navigation/stack";

type FooterNavProps = {
  navigation: StackNavigationProp<RootStackParamList>;
  active: "Dashboard" | "Record" | "Leaderboard" | "Profile";
};

const FooterNav: React.FC<FooterNavProps> = ({ navigation, active }) => {
  return (
    <View style={styles.footer}>
      {[
        { key: "Dashboard", icon: "home" },
        { key: "Record", icon: "videocam" },
        { key: "Leaderboard", icon: "emoji-events" },
        { key: "Profile", icon: "person" },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={styles.footerItem}
          onPress={() => navigation.navigate(tab.key as any)}
        >
          <MaterialIcons
            name={tab.icon as any}
            size={22}
            color={active === tab.key ? "#fff" : "#b09eb7"}
          />
          <Text
            style={
              active === tab.key ? styles.footerTextActive : styles.footerText
            }
          >
            {tab.key}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#332938",
    backgroundColor: "rgba(35,28,38,0.9)",
    paddingVertical: 8,
    justifyContent: "space-around",
  },
  footerItem: { alignItems: "center" },
  footerText: { color: "#b09eb7", fontSize: 12 },
  footerTextActive: { color: "#fff", fontSize: 12, fontWeight: "600" },
});

export default FooterNav;
