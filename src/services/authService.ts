import { supabase } from '@/integrations/supabase/client';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export interface ProfileResponse {
  success: boolean;
  profile?: Profile;
  error?: string;
}

class AuthService {
  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Authentication Methods
  async signUp(email: string, password: string, fullName: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        return { success: false, error: this.formatError(error) };
      }

      return { success: true, user: data.user || undefined };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred during sign up' };
    }
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: this.formatError(error) };
      }

      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred during sign in' };
    }
  }

  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) {
        return { success: false, error: this.formatError(error) };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to sign in with Google' };
    }
  }

  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { success: false, error: this.formatError(error) };
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to sign out' };
    }
  }

  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        return { success: false, error: this.formatError(error) };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to send reset password email' };
    }
  }

  async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { success: false, error: this.formatError(error) };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update password' };
    }
  }

  async confirmEmail(token: string, type: 'signup' | 'recovery'): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: type === 'signup' ? 'email' : 'recovery'
      });

      if (error) {
        return { success: false, error: this.formatError(error) };
      }

      return { success: true, user: data.user || undefined };
    } catch (error) {
      return { success: false, error: 'Failed to confirm email' };
    }
  }

  // Session Management
  async getSession(): Promise<Session | null> {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Profile Management
  async getProfile(userId: string): Promise<ProfileResponse> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return { success: false, error: 'Profile not found' };
        }
        return { success: false, error: this.formatError(error) };
      }

      return { success: true, profile: data };
    } catch (error) {
      return { success: false, error: 'Failed to fetch profile' };
    }
  }

  async updateProfile(userId: string, updates: ProfileUpdate): Promise<ProfileResponse> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return { success: false, error: this.formatError(error) };
      }

      return { success: true, profile: data };
    } catch (error) {
      return { success: false, error: 'Failed to update profile' };
    }
  }

  // Utility Methods
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  private formatError(error: AuthError | any): string {
    // Map common error codes to user-friendly messages
    const errorMessages: Record<string, string> = {
      'invalid_credentials': 'Invalid email or password',
      'email_not_confirmed': 'Please check your email and click the confirmation link',
      'signup_disabled': 'New registrations are currently disabled',
      'email_address_invalid': 'Please enter a valid email address',
      'password_too_short': 'Password must be at least 6 characters long',
      'weak_password': 'Please choose a stronger password',
      'user_already_registered': 'An account with this email already exists',
      'session_not_found': 'Your session has expired. Please sign in again'
    };

    const message = errorMessages[error.message] || error.message || 'An unexpected error occurred';
    return message;
  }
}

export const authService = AuthService.getInstance();
export default AuthService;
