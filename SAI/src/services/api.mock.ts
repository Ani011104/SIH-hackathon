// src/services/api.mock.ts

// Fake user profile
const mockUser = {
    username: "Arjun Kumar",
    phone: "9876543210",
    gender: "Male",
    Dob: "2001-05-12",
    height: 178,
    weight: 72,
    email: "arjun@example.com",
    avatar: "https://via.placeholder.com/100x100.png?text=User",
    score: 85,
  };
  
  const mockMedia = [
    { title: "Profile Pic", type: "image", url: "https://placehold.co/200x200?text=Profile" },
    { title: "Jump Test", type: "video", url: "https://placehold.co/200x200?text=Jump+Video" },
  ];
  
  const mockLeaderboard = [
    { rank: 1, name: "Priya S.", score: 95 },
    { rank: 2, name: "Rohan V.", score: 92 },
    { rank: 3, name: "Arjun Kumar", score: 90 },
    { rank: 4, name: "You", score: 85 },
  ];
  
  const mockAssessment = {
    total_score: 85,
    exercises: [
      { type: "Vertical Jump", score: 90 },
      { type: "Sit-ups", score: 80 },
      { type: "Shuttle Run", score: 85 },
    ],
  };
  
  // ===== AUTH =====
  export const sendSignupOtp = async (phone: string) => {
    console.log("MOCK: sendSignupOtp", phone);
    return { success: true, message: "OTP sent successfully (mock)" };
  };
  
  export const verifySignupOtp = async (phone: string, otp: string) => {
    console.log("MOCK: verifySignupOtp", phone, otp);
    return { token: "mock-token", message: "OTP verified (mock)" };
  };
  
  // ===== USER =====
  export const updateUser = async (data: any) => {
    console.log("MOCK: updateUser", data);
    return { success: true, user: { ...mockUser, ...data } };
  };
  
  export const getUserProfile = async () => {
    console.log("MOCK: getUserProfile");
    return { user: mockUser };
  };
  
  // ===== ADDRESS =====
  export const saveAddress = async (data: any) => {
    console.log("MOCK: saveAddress", data);
    return { success: true, message: "Mock address saved" };
  };
  
  // ===== MEDIA =====
  export const uploadMedia = async (files: any[]) => {
    console.log("MOCK: uploadMedia", files);
    return { media: mockMedia };
  };
  
  export const getMedia = async () => {
    console.log("MOCK: getMedia");
    return { media: mockMedia };
  };
  
  // ===== ASSESSMENT =====
  export const performAssessment = async (
    videoFile: any,
    referenceImages: any[],
    exerciseType: string
  ) => {
    console.log("MOCK: performAssessment", exerciseType, videoFile);
    return { result: mockAssessment };
  };
  
  export const getFinalResult = async () => {
    console.log("MOCK: getFinalResult");
    return mockAssessment;
  };
  
  // ===== LEADERBOARD =====
  export const getLeaderboard = async () => {
    console.log("MOCK: getLeaderboard");
    return { players: mockLeaderboard };
  };
  