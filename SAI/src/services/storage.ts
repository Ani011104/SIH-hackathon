// src/services/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

// ========== AUTH ==========
export const saveToken = async (token: string) => {
  await AsyncStorage.setItem("authToken", token);
};

export const getToken = async () => {
  return await AsyncStorage.getItem("authToken");
};

export const savePhone = async (phone: string) => {
  await AsyncStorage.setItem("userPhone", phone);
};

// Save overall score
export const saveOverallScore = async (score: number) => {
  try {
    await AsyncStorage.setItem("overallScore", score.toString());
  } catch (e) {
    console.error("Error saving overall score", e);
  }
};

// Get overall score
export const getOverallScore = async (): Promise<number | null> => {
  try {
    const value = await AsyncStorage.getItem("overallScore");
    return value ? parseInt(value, 10) : null;
  } catch (e) {
    console.error("Error reading overall score", e);
    return null;
  }
};
export const getPhone = async () => {
  return await AsyncStorage.getItem("userPhone");
};

// ========== PROFILE ==========
export const setProfileCompleted = async (value: boolean) => {
  await AsyncStorage.setItem("profileCompleted", value ? "true" : "false");
};

export const isProfileCompleted = async () => {
  const val = await AsyncStorage.getItem("profileCompleted");
  return val === "true";
};

// ========== CLEAR STORAGE ==========
export const clearStorage = async () => {
  await AsyncStorage.clear();
};
