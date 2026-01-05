-- Additional sharing features

-- Create trip_shares table for sharing trips with specific users
create table public.trip_shares (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  shared_with_email text not null,
  can_edit boolean default false,
  shared_by uuid references public.profiles(id) on delete cascade not null,
  shared_at timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  unique(trip_id, shared_with_email)
);

-- Enable RLS
alter table public.trip_shares enable row level security;

-- Indexes for better performance
create index trip_shares_trip_id_idx on public.trip_shares(trip_id);
create index trip_shares_email_idx on public.trip_shares(shared_with_email);
create index trip_shares_shared_by_idx on public.trip_shares(shared_by);

-- Policies for trip_shares
create policy "Users can view shares for their trips" on public.trip_shares
  for select using (
    exists (
      select 1 from public.trips
      where trips.id = trip_shares.trip_id
      and trips.user_id = auth.uid()
    )
  );

create policy "Users can view trips shared with them" on public.trip_shares
  for select using (
    shared_with_email = (
      select email from auth.users where id = auth.uid()
    )
  );

create policy "Users can share their own trips" on public.trip_shares
  for insert with check (
    exists (
      select 1 from public.trips
      where trips.id = trip_shares.trip_id
      and trips.user_id = auth.uid()
    )
  );

create policy "Users can update shares for their trips" on public.trip_shares
  for update using (
    exists (
      select 1 from public.trips
      where trips.id = trip_shares.trip_id
      and trips.user_id = auth.uid()
    )
  );

create policy "Users can delete shares for their trips" on public.trip_shares
  for delete using (
    exists (
      select 1 from public.trips
      where trips.id = trip_shares.trip_id
      and trips.user_id = auth.uid()
    )
  );