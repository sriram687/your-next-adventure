import { supabase } from '@/integrations/supabase/client';

interface TripShare {
  trip_id: string;
  shared_with_email: string;
  can_edit: boolean;
  shared_at: string;
  shared_by: string;
}

class SharingService {
  async shareTrip(tripId: string, emails: string[], canEdit: boolean = false): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // First, enable sharing on the trip
    await supabase
      .from('trips')
      .update({ is_shared: true })
      .eq('id', tripId);

    // Create sharing records for each email
    const shareRecords = emails.map(email => ({
      trip_id: tripId,
      shared_with_email: email.toLowerCase(),
      can_edit: canEdit,
      shared_by: user.id
    }));

    const { error } = await supabase
      .from('trip_shares')
      .insert(shareRecords);

    if (error) throw error;

    // Send email notifications (you can implement this later)
    await this.notifySharedUsers(tripId, emails);
  }

  async getSharedTrips(userEmail: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('trip_shares')
      .select(`
        *,
        trip:trips(
          *,
          stops:trip_stops(
            *,
            activities(*)
          ),
          budgetItems:budget_items(*),
          owner:profiles!trips_user_id_fkey(name, avatar_url)
        )
      `)
      .eq('shared_with_email', userEmail.toLowerCase());

    if (error) throw error;
    return data || [];
  }

  async revokeAccess(tripId: string, email: string): Promise<void> {
    const { error } = await supabase
      .from('trip_shares')
      .delete()
      .eq('trip_id', tripId)
      .eq('shared_with_email', email.toLowerCase());

    if (error) throw error;
  }

  async getSharedUsers(tripId: string): Promise<TripShare[]> {
    const { data, error } = await supabase
      .from('trip_shares')
      .select('*')
      .eq('trip_id', tripId);

    if (error) throw error;
    return data || [];
  }

  async checkUserAccess(tripId: string, userEmail: string): Promise<{ hasAccess: boolean; canEdit: boolean }> {
    const { data, error } = await supabase
      .from('trip_shares')
      .select('can_edit')
      .eq('trip_id', tripId)
      .eq('shared_with_email', userEmail.toLowerCase())
      .single();

    if (error) {
      if (error.code === 'PGRST116') return { hasAccess: false, canEdit: false };
      throw error;
    }

    return { hasAccess: true, canEdit: data.can_edit };
  }

  async generateShareLink(tripId: string): Promise<string> {
    const { data, error } = await supabase
      .from('trips')
      .select('share_token')
      .eq('id', tripId)
      .single();

    if (error) throw error;
    
    return `${window.location.origin}/share/${data.share_token}`;
  }

  private async notifySharedUsers(tripId: string, emails: string[]): Promise<void> {
    // Get trip details for the notification
    const { data: trip } = await supabase
      .from('trips')
      .select('title, share_token')
      .eq('id', tripId)
      .single();

    if (!trip) return;

    // In a real app, you'd send emails here
    // For now, we'll just log it
    console.log(`Trip "${trip.title}" shared with:`, emails);
    console.log(`Share link: ${window.location.origin}/share/${trip.share_token}`);
  }
}

export const sharingService = new SharingService();