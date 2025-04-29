export type Advocate = {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  phoneNumber: string;
  createdAt: Date | null;
  specialties: Array<string>;
  yearsOfExperience: number;
};
