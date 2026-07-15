import type { ProfileMode } from './auth';

export interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
  mode: ProfileMode;
  created_at: string;
}

export interface ProfileUpdate {
  name?: string;
  avatar?: string;
  mode?: ProfileMode;
}

export interface Favorite {
  id: string;
  user_id: string;
  spot_id: string;
  created_at: string;
}

export interface Plan {
  id: string;
  user_id: string;
  title: string;
  plan_data: Record<string, unknown>;
  created_at: string;
}

export interface PlanInsert {
  title: string;
  plan_data: Record<string, unknown>;
}

export interface AiProfile {
  id: string;
  user_id: string;
  food_preferences: string[];
  budget: string | null;
  favorite_areas: string[];
  travel_style: string | null;
  updated_at: string;
}

export interface AiProfileUpdate {
  food_preferences?: string[];
  budget?: string | null;
  favorite_areas?: string[];
  travel_style?: string | null;
}

export interface OwnerShop {
  id: string;
  owner_id: string;
  shop_name: string;
  category: string | null;
  description: string | null;
  address: string | null;
  images: string[];
  verified: boolean;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at'> & { created_at?: string };
        Update: Partial<Omit<Profile, 'id'>>;
      };
      favorites: {
        Row: Favorite;
        Insert: Omit<Favorite, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: never;
      };
      plans: {
        Row: Plan;
        Insert: Omit<Plan, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Pick<Plan, 'title' | 'plan_data'>>;
      };
      ai_profiles: {
        Row: AiProfile;
        Insert: Omit<AiProfile, 'id' | 'updated_at'> & { id?: string; updated_at?: string };
        Update: Partial<Omit<AiProfile, 'id' | 'user_id'>>;
      };
      owner_shops: {
        Row: OwnerShop;
        Insert: Omit<OwnerShop, 'id' | 'created_at' | 'verified'> & {
          id?: string;
          created_at?: string;
          verified?: boolean;
        };
        Update: Partial<Omit<OwnerShop, 'id' | 'owner_id'>>;
      };
    };
  };
}
