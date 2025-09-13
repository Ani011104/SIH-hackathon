// src/components/FooterNav.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

type FooterNavProps = {
  navigation: any;
  active: "Dashboard" | "Record" | "Leaderboard" | "Profile";
};

const FooterNav = ({ navigation, active }: FooterNavProps) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("Dashboard")}
      >
        <MaterialIcons
          name="home"
          size={22}
          color={active === "Dashboard" ? "#fff" : "#b09eb7"}
        />
        <Text
          style={
            active === "Dashboard" ? styles.footerTextActive : styles.footerText
          }
        >
          Dashboard
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("Record")}
      >
        <MaterialIcons
          name="videocam"
          size={22}
          color={active === "Record" ? "#fff" : "#b09eb7"}
        />
        <Text
          style={
            active === "Record" ? styles.footerTextActive : styles.footerText
          }
        >
          Record
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("Leaderboard")}
      >
        <MaterialIcons
          name="emoji-events"
          size={22}
          color={active === "Leaderboard" ? "#fff" : "#b09eb7"}
        />
        <Text
          style={
            active === "Leaderboard"
              ? styles.footerTextActive
              : styles.footerText
          }
        >
          Leaderboard
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => navigation.navigate("Profile")}
      >
        <MaterialIcons
          name="person"
          size={22}
          color={active === "Profile" ? "#fff" : "#b09eb7"}
        />
        <Text
          style={
            active === "Profile" ? styles.footerTextActive : styles.footerText
          }
        >
          Profile
        </Text>
      </TouchableOpacity>
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
