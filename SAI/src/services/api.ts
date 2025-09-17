// src/services/api.ts
// Mock API for frontend + backend-ready stubs
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://10.237.136.179:5000"; // replace with backend host:port

import { saveUserProfile, getUserProfile } from "./storage";

// Mock delay
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));



// ---------------- ATHLETE PROFILE ----------------



export const updateUser = async (data: any) => {
  const token = await AsyncStorage.getItem("authToken");

  return axios.patch(`${BASE_URL}/user/updateuser`, data, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
};


export const uploadMedia = async (file: any, token: string) => {
  const formData = new FormData();
  formData.append("file", {
    uri: file.uri,
    type: file.type || "image/jpeg",
    name: file.fileName || "upload.jpg",
  });

  const response = await fetch(`${BASE_URL}/media/upload`, {
    method: "POST",
    body: formData,
    headers: {
      
      "Authorization": `Bearer ${token}`,
    },
  });
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
