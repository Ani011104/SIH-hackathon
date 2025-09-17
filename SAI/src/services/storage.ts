// src/services/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

// Save phone number
export const savePhone = async (phone: string) => {
  await AsyncStorage.setItem("phone", phone);
};

// Get phone
export const getPhone = async (): Promise<string | null> => {
  return await AsyncStorage.getItem("phone");
};

// Save user profile (with address + media)
export const saveUserProfile = async (profile: any) => {
  await AsyncStorage.setItem("userData", JSON.stringify(profile));
  await AsyncStorage.setItem("athleteForm", "true");
};

// Get user profile
export const getUserProfile = async () => {
  const json = await AsyncStorage.getItem("userData");
  return json ? JSON.parse(json) : null;
};

// Save address separately
export const saveAddress = async (address: any) => {
  const user = await getUserProfile();
  const updated = { ...user, address };
  await saveUserProfile(updated);
  return updated;
};

// Save media separately
export const saveMedia = async (media: string[]) => {
  const user = await getUserProfile();
  const updated = { ...user, media };
  await saveUserProfile(updated);
  return updated;
};

// Check if profile is complete
export const isProfileCompleted = async (): Promise<boolean> => {
  const val = await AsyncStorage.getItem("athleteForm");
  return val === "true";
};

// Clear all storage (logout)
export const clearStorage = async () => {
  await AsyncStorage.clear();
};
