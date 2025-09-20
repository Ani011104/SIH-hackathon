import axios from "axios";

const API = axios.create({
  baseURL: "http://10.123.149.138:3001", // ✅ Android emulator localhost
  headers: { "Content-Type": "application/json" },
});

// 🔹 LOGIN
export const sendLoginOtp = async (phone: string) => {
  const res = await API.post("/auth/login/sendotp", { phone });
  return res.data;
};

export const verifyLoginOtp = async (phone: string, otp: string) => {
  const res = await API.post("/auth/login/verifyotp", { phone, otp });
  return res.data;
};

// 🔹 SIGNUP
export const sendSignupOtp = async (phone: string) => {
  const res = await API.post("/auth/signup/sendotp", { phone });
  return res.data;
};

export const verifySignupOtp = async (phone: string, otp: string) => {
  const res = await API.post("/auth/signup/verifyotp", { phone, otp });
  return res.data;
};