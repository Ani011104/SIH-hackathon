export interface User {
  id: string;
  phone: string;
  name: string;
  dob: string; // YYYY-MM-DD
  gender: "Male" | "Female" | "Other";
  sport: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  media: any; // tolerate both array and object usages in current code
  avatar: string;
  assessments: number;
  submissions: number;
  pending: number;
}
