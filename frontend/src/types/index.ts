export interface TripInfo {
   id: number;
   name: string;
   location_city: string;
   location_country: string;
   goal_amount: number;
}

export interface Student {
   id: number;
   name: string;
   email: string;
   university: string;
   year: string;
   balance: number;
   formatted_balance: string;
   bio?: string; // max 400 chars
   headline?: string; // max 100 chars
   major?: string;
   profile_picture_url?: string;
   trip?: TripInfo;
}

export interface AuthResponse {
   token: string;
   student: Student;
}

export interface Trip {
   id: number;
   name: string;
   location_city: string;
   location_country: string;
   goal_amount: number;
}

export interface FormData {
   name: string;
   email: string;
   password: string;
   password_confirmation: string;
   university_id: string;
   year: string;
}

export interface ProfileFormData {
   bio: string;
   headline: string;
   major: string;
   profile_picture?: File;
}

export interface Donation {
   id: number;
   amount: number;
   name: string;
   email?: string;
   phone?: string;
   note?: string;
   student_id: number;
   created_at: string;
} 