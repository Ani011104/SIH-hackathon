// src/services/api.ts
// Mock API for frontend + backend-ready stubs

import { saveUserProfile, getUserProfile } from "./storage";

// Mock delay
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// ---------------- AUTH ----------------

export const sendOtp = async (phone: string) => {
  await delay(500);
  console.log("Mock OTP sent to:", phone);
  return { success: true, otp: "123456" }; // static OTP for mock
};

export const verifyOtp = async (phone: string, otp: string) => {
  await delay(500);
  if (otp === "123456") {
    // For mock, always success
    return { success: true, profileCompleted: false };
  }
  return { success: false, message: "Invalid OTP" };
};

// ---------------- ATHLETE PROFILE ----------------

export const saveAthleteProfile = async (profile: any) => {
  await delay(500);
  await saveUserProfile(profile);
  return { success: true, data: profile };
};

// ---------------- ADDRESS ----------------

export const saveAddress = async (address: {
  address: string;
  city: string;
  state: string;
  pincode: string;
}) => {
  await delay(500);
  const user = await getUserProfile();
  if (user) {
    const updated = { ...user, address };
    await saveUserProfile(updated);
    return { success: true, data: updated };
  }
  return { success: false, message: "User not found" };
};

// ---------------- MEDIA ----------------

export const saveMedia = async (photos: string[]) => {
  await delay(500);
  if (photos.length !== 4) {
    return { success: false, message: "You must upload exactly 4 photos" };
  }

  const user = await getUserProfile();
  if (user) {
    const updated = { ...user, media: photos };
    await saveUserProfile(updated);
    return { success: true, data: updated };
  }
  return { success: false, message: "User not found" };
};

// Backend Ready

// Later, just replace await delay(500) + saveUserProfile(...) with a real API call:
// const res = await fetch(`${BASE_URL}/user/address`, {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify(address),
// });
// return await res.json();
