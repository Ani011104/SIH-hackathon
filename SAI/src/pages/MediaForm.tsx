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
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "react-native-image-picker";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import { uploadMedia } from "../services/api";
import { setProfileCompleted } from "../services/storage";

type Props = StackScreenProps<RootStackParamList, "MediaForm">;

const MediaForm: React.FC<Props> = ({ navigation }) => {
  const [photos, setPhotos] = useState<(any | null)[]>([null, null, null, null]);
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
        const asset = response.assets?.[0];
        if (asset) {
          const updated = [...photos];
          updated[index] = asset;
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
    try {
      // 🟣 Upload all 4 images to backend
      const res = await uploadMedia(photos as any[]);
      if (res.media || res.success) {
        // 🟣 Mark profile as complete
        await setProfileCompleted(true);

        Alert.alert("Success", "Photos uploaded successfully!", [
          { text: "OK", onPress: () => navigation.replace("Dashboard") },
        ]);
      } else {
        Alert.alert("Error", res.message || "Failed to upload photos");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Network error");
    } finally {
      setLoading(false);
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
              <Image source={{ uri: p.uri }} style={styles.photo} />
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
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Submit</Text>
        )}
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
