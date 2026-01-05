// Supabase Edge Function: invite-user
import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InviteRequest {
  email: string;
  trip_id: string;
  role?: 'viewer' | 'editor';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.split(' ')[1])
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { email, trip_id, role = 'viewer' }: InviteRequest = await req.json()

    // Validate input
    if (!email || !trip_id) {
      return new Response(
        JSON.stringify({ error: 'Email and trip_id are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify the user owns the trip
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('id, title, user_id')
      .eq('id', trip_id)
      .eq('user_id', user.id)
      .single()

    if (tripError || !trip) {
      return new Response(
        JSON.stringify({ error: 'Trip not found or you do not have permission to share it' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if email is already invited
    const { data: existingInvite } = await supabase
      .from('trip_collaborators')
      .select('id, status')
      .eq('trip_id', trip_id)
      .eq('email', email.toLowerCase())
      .single()

    if (existingInvite) {
      return new Response(
        JSON.stringify({ 
          error: `User ${email} is already ${existingInvite.status === 'pending' ? 'invited' : 'collaborating'} on this trip` 
        }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if a user with this email exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', (
        await supabase.auth.admin.getUserByEmail(email)
      ).data.user?.id || '')
      .single()

    let collaboratorData: any = {
      trip_id,
      email: email.toLowerCase(),
      role,
      invited_by: user.id,
      status: 'pending'
    }

    // If user exists, auto-accept and link user_id
    if (existingUser) {
      collaboratorData.user_id = existingUser.id
      collaboratorData.status = 'accepted'
      collaboratorData.accepted_at = new Date().toISOString()
    }

    // Create the collaboration record
    const { data: collaboration, error: collaborationError } = await supabase
      .from('trip_collaborators')
      .insert(collaboratorData)
      .select('*')
      .single()

    if (collaborationError) {
      throw collaborationError
    }

    // TODO: Send email notification (integrate with your email service)
    // For now, we'll just log the invite details
    console.log(`Invite sent to ${email} for trip "${trip.title}"`)
    
    // In a production app, you would send an email here with:
    // - Trip details
    // - Invitation link to join/view the trip
    // - Instructions for new users to sign up

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: existingUser 
          ? `${email} has been added to the trip`
          : `Invitation sent to ${email}. They will be added when they sign up.`,
        collaboration 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Invite function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

/* Deployment Instructions:

1. Create the edge function:
   supabase functions new invite-user

2. Replace the generated index.ts with this code

3. Deploy the function:
   supabase functions deploy invite-user

4. Set up environment variables in Supabase dashboard:
   - SUPABASE_URL (automatically available)
   - SUPABASE_SERVICE_ROLE_KEY (automatically available)

5. Grant permissions to the function in your Supabase project

Usage from frontend:
const response = await supabase.functions.invoke('invite-user', {
  body: { email: 'user@example.com', trip_id: 'uuid', role: 'viewer' }
})
*/