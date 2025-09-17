// src/pages/MediaForm.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "react-native-image-picker";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { saveMedia } from "../services/api";

type Props = StackScreenProps<RootStackParamList, "MediaForm">;

const MediaForm: React.FC<Props> = ({ navigation }) => {
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null]);
  const [loading, setLoading] = useState(false);

  const pickImage = (index: number) => {
    ImagePicker.launchCamera(
      { mediaType: "photo", quality: 0.7 },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert("Error", response.errorMessage || "Image picker error");
          return;
        }
        const uri = response.assets?.[0]?.uri;
        if (uri) {
          const updated = [...photos];
          updated[index] = uri;
          setPhotos(updated);
        }
      }
    );
  };

  const handleSubmit = async () => {
    if (photos.some((p) => !p)) {
      Alert.alert("Error", "Please capture all 4 required photos.");
      return;
    }

    setLoading(true);
    const res = await saveMedia(photos as string[]);
    setLoading(false);

    if (res.success) {
      Alert.alert("Success", "Photos uploaded successfully!");
      navigation.goBack();
    } else {
      Alert.alert("Error", res.message || "Failed to upload photos");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>Upload Your Photos</Text>
      <Text style={styles.subtitle}>Please follow the rules below:</Text>
      <View style={styles.rules}>
        <Text style={styles.rule}>1️⃣ Face should be clearly visible.</Text>
        <Text style={styles.rule}>2️⃣ Ensure good lighting conditions.</Text>
        <Text style={styles.rule}>3️⃣ Capture full-body shots (head to toe).</Text>
        <Text style={styles.rule}>4️⃣ Avoid hats, sunglasses, or accessories.</Text>
      </View>

      <View style={styles.grid}>
        {photos.map((p, i) => (
          <TouchableOpacity
            key={i}
            style={styles.photoBox}
            onPress={() => pickImage(i)}
          >
            {p ? (
              <Image source={{ uri: p }} style={styles.photo} />
            ) : (
              <Text style={styles.addText}>📷</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.submitBtn, loading && { opacity: 0.5 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitText}>
          {loading ? "Uploading..." : "Submit"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default MediaForm;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d" },
  title: { fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 8 },
  subtitle: { color: "#aaa", marginBottom: 12 },
  rules: { marginBottom: 20 },
  rule: { color: "#ddd", marginBottom: 6 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  photoBox: {
    width: "48%",
    height: 150,
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  photo: { width: "100%", height: "100%", borderRadius: 12 },
  addText: { fontSize: 28, color: "#aaa" },
  submitBtn: {
    backgroundColor: "#702186",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
