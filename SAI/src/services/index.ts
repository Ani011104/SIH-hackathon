// src/services/index.ts
import { API_MODE } from "../config/appConfig";

let api: any;

if (API_MODE === "mock") {
  api = require("./api.mock");
} else {
  api = require("./api");
}

// ✅ Re-export all functions cleanly
export const {
  sendSignupOtp,
  verifySignupOtp,
  getUserProfile,
  updateUser,
  saveAddress,
  uploadMedia,
  getFinalResult,
  getLeaderboard,
  performAssessment,
} = api;
