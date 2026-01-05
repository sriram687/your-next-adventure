-- Trip Collaborators Table for Private Trip Sharing
create table public.trip_collaborators (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade,
  email text not null,
  status text default 'pending' check (status in ('pending', 'accepted')),
  role text default 'viewer' check (role in ('viewer', 'editor')),
  invited_by uuid references auth.users(id) on delete cascade not null,
  invited_at timestamp with time zone default now(),
  accepted_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  
  -- Ensure unique email per trip
  unique(trip_id, email),
  
  -- Ensure if user_id is set, it matches the email
  constraint valid_user_email check (
    user_id is null or 
    exists (select 1 from auth.users where id = user_id and email = trip_collaborators.email)
  )
);

-- Indexes for performance
create index trip_collaborators_trip_id_idx on public.trip_collaborators(trip_id);
create index trip_collaborators_user_id_idx on public.trip_collaborators(user_id);
create index trip_collaborators_email_idx on public.trip_collaborators(email);
create index trip_collaborators_status_idx on public.trip_collaborators(status);

-- Enable RLS
alter table public.trip_collaborators enable row level security;

-- RLS Policies for trip_collaborators
create policy "Users can view collaborators for trips they own" on public.trip_collaborators
  for select using (
    exists (
      select 1 from public.trips 
      where trips.id = trip_collaborators.trip_id 
      and trips.user_id = auth.uid()
    )
  );

create policy "Users can view collaborations they're part of" on public.trip_collaborators
  for select using (
    user_id = auth.uid() or 
    email = (select email from auth.users where id = auth.uid())
  );

create policy "Trip owners can manage collaborators" on public.trip_collaborators
  for all using (
    exists (
      select 1 from public.trips 
      where trips.id = trip_collaborators.trip_id 
      and trips.user_id = auth.uid()
    )
  );

-- Updated RLS Policy for trips table to include shared trips
drop policy if exists "Users can view own trips" on public.trips;
drop policy if exists "Users can view shared trips" on public.trips;

create policy "Users can view own trips and trips shared with them" on public.trips
  for select using (
    -- Own trips
    user_id = auth.uid() 
    or 
    -- Trips shared with user via collaborators table
    exists (
      select 1 from public.trip_collaborators
      where trip_collaborators.trip_id = trips.id
      and (
        trip_collaborators.user_id = auth.uid() or
        trip_collaborators.email = (select email from auth.users where id = auth.uid())
      )
      and trip_collaborators.status = 'accepted'
    )
  );

-- Function to automatically accept invites when user signs up
create or replace function public.handle_new_user_invites()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- Update pending invites for this email to accepted and link to user
  update public.trip_collaborators
  set 
    user_id = new.id,
    status = 'accepted',
    accepted_at = now(),
    updated_at = now()
  where email = new.email and status = 'pending';
  
  return new;
end;
$$;

-- Trigger to auto-accept invites on signup
drop trigger if exists on_auth_user_created_handle_invites on auth.users;
create trigger on_auth_user_created_handle_invites
  after insert on auth.users
  for each row execute procedure public.handle_new_user_invites();

-- Function to check user's role on a trip
create or replace function public.get_user_trip_role(trip_id_param uuid, user_id_param uuid default auth.uid())
returns text
language plpgsql
security definer set search_path = public
as $$
declare
  user_role text;
  user_email text;
begin
  -- Get user email
  select email into user_email from auth.users where id = user_id_param;
  
  -- Check if user is trip owner
  if exists (select 1 from public.trips where id = trip_id_param and user_id = user_id_param) then
    return 'owner';
  end if;
  
  -- Check collaborator role
  select role into user_role
  from public.trip_collaborators
  where trip_id = trip_id_param
  and (user_id = user_id_param or email = user_email)
  and status = 'accepted';
  
  return coalesce(user_role, 'none');
end;
$$;