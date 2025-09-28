// src/services/storage.ts - Updated to match your usage
import AsyncStorage from "@react-native-async-storage/async-storage";

// ========== AUTH ==========
export const saveToken = async (token: string) => {
  await AsyncStorage.setItem("authToken", token);
};

export const getToken = async () => {
  return await AsyncStorage.getItem("authToken");
};

export const savePhone = async (phone: string) => {
  await AsyncStorage.setItem("phone", phone);
  // Also save with the key used in other files for consistency
  await AsyncStorage.setItem("userPhone", phone);
};

// Get phone
export const getPhone = async (): Promise<string | null> => {
  return await AsyncStorage.getItem("phone");
};

// ✅ Add auth token functions (missing from your original)
export const saveAuthToken = async (token: string) => {
  await AsyncStorage.setItem("authToken", token);
};

export const getAuthToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem("authToken");
};

// Save user profile (with address + media)
export const saveUserProfile = async (profile: any) => {
  await AsyncStorage.setItem("userData", JSON.stringify(profile));
  await AsyncStorage.setItem("athleteForm", "true");
  // Also save with the key used in splash screen
  await AsyncStorage.setItem("profileCompleted", "true");
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

// ✅ Add function to mark profile as completed (used in AthleteDetailsForm)
export const setProfileCompleted = async () => {
  await AsyncStorage.setItem("athleteForm", "true");
  await AsyncStorage.setItem("profileCompleted", "true");
};

export const isProfileCompleted = async () => {
  const val = await AsyncStorage.getItem("profileCompleted");
  return val === "true";
};

// ✅ Add utility function to check if user is logged in
export const isUserLoggedIn = async (): Promise<boolean> => {
  const phone = await getPhone();
  const token = await getAuthToken();
  return !!(phone && token);
};

// Clear all storage (logout)
export const clearStorage = async () => {
  await AsyncStorage.clear();
};