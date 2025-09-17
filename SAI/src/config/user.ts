// src/types/user.ts

export type Address = {
  street: string;
  city: string;
  state: string;
  pincode: string;
};

export type Media = {
  images: string[]; // Expect 4 photo URIs
};

export type User = {
  id: string;
  phone: string;
  name: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  sport: string;
  address?: Address;
  media?: Media;
  assessments?: number; // optional for dashboard/profile stats
  submissions?: number;
  pending?: number;
  avatar?: string; // profile pic URI
};

// Mock current user for UI screens that need a quick reference
export const currentUser: User & { score?: number } = {
  id: "USR-0001",
  phone: "+91 99999 99999",
  name: "You",
  dob: "2000-01-01",
  gender: "Male",
  sport: "Athletics",
  assessments: 5,
  submissions: 12,
  pending: 1,
  score: 82,
  avatar: "https://via.placeholder.com/100x100.png?text=Avatar",
};