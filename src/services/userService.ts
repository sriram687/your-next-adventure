import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export interface UserProfile extends Profile {
  preferences: {
    currency: string;
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
    };
    privacy: {
      profileVisible: boolean;
      tripsVisible: boolean;
    };
  };
}

class UserService {
  // Profile Management
  async createProfile(userId: string, data: Partial<ProfileInsert>): Promise<Profile> {
    const profileData: ProfileInsert = {
      id: userId,
      name: data.name || 'User',
      avatar_url: data.avatar_url || null,
      preferences: {
        currency: 'USD',
        language: 'en',
        notifications: { email: true, push: true },
        privacy: { profileVisible: true, tripsVisible: false }
      },
      ...data
    };

    const { data: profile, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) throw error;
    return profile;
  }

  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return data as UserProfile;
  }

  async updateProfile(userId: string, updates: Partial<ProfileUpdate>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as UserProfile;
  }

  async updateAvatar(userId: string, file: File): Promise<string> {
    // Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(uploadData.path);

    // Update profile with new avatar URL
    await this.updateProfile(userId, { avatar_url: publicUrl });

    return publicUrl;
  }

  async uploadTripCover(tripId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${tripId}-${Date.now()}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('trip-covers')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('trip-covers')
      .getPublicUrl(uploadData.path);

    return publicUrl;
  }

  // Statistics and Analytics
  async getUserStats(userId: string): Promise<{
    totalTrips: number;
    totalCountries: number;
    totalCities: number;
    totalExpenses: number;
  }> {
    const { data: trips, error } = await supabase
      .from('trips')
      .select(`
        *,
        stops:trip_stops(country, city),
        budgetItems:budget_items(amount)
      `)
      .eq('user_id', userId);

    if (error) throw error;

    const countries = new Set();
    const cities = new Set();
    let totalExpenses = 0;

    trips?.forEach(trip => {
      trip.stops?.forEach(stop => {
        countries.add(stop.country);
        cities.add(`${stop.city}, ${stop.country}`);
      });
      
      trip.budgetItems?.forEach(item => {
        totalExpenses += Number(item.amount);
      });
    });

    return {
      totalTrips: trips?.length || 0,
      totalCountries: countries.size,
      totalCities: cities.size,
      totalExpenses
    };
  }

  // Preferences Management
  async updatePreferences(userId: string, preferences: Partial<UserProfile['preferences']>): Promise<UserProfile> {
    const currentProfile = await this.getProfile(userId);
    if (!currentProfile) throw new Error('Profile not found');

    const updatedPreferences = {
      ...currentProfile.preferences,
      ...preferences
    };

    return this.updateProfile(userId, { preferences: updatedPreferences });
  }

  // Account Management
  async deleteAccount(userId: string): Promise<void> {
    // This will cascade delete all related data due to foreign key constraints
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) throw error;

    // Also delete from auth.users (if you have admin access)
    // Note: In production, you might want to handle this through a server function
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) {
      console.warn('Could not delete auth user (admin required):', authError.message);
    }
  }

  async exportUserData(userId: string): Promise<{
    profile: UserProfile;
    trips: any[];
    budgetItems: any[];
  }> {
    const profile = await this.getProfile(userId);
    if (!profile) throw new Error('Profile not found');

    const { data: trips, error: tripsError } = await supabase
      .from('trips')
      .select(`
        *,
        stops:trip_stops(*),
        budgetItems:budget_items(*)
      `)
      .eq('user_id', userId);

    if (tripsError) throw tripsError;

    const { data: budgetItems, error: budgetError } = await supabase
      .from('budget_items')
      .select('*')
      .in('trip_id', trips?.map(t => t.id) || []);

    if (budgetError) throw budgetError;

    return {
      profile,
      trips: trips || [],
      budgetItems: budgetItems || []
    };
  }
}

export const userService = new UserService();
export default UserService;