-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.trip_stops enable row level security;
alter table public.activities enable row level security;
alter table public.budget_items enable row level security;

-- Profiles policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Trips policies
create policy "Users can view own trips" on public.trips
  for select using (auth.uid() = user_id);

create policy "Users can view shared trips" on public.trips
  for select using (is_shared = true);

create policy "Users can create own trips" on public.trips
  for insert with check (auth.uid() = user_id);

create policy "Users can update own trips" on public.trips
  for update using (auth.uid() = user_id);

create policy "Users can delete own trips" on public.trips
  for delete using (auth.uid() = user_id);

-- Trip stops policies
create policy "Users can view trip stops for their trips" on public.trip_stops
  for select using (
    exists (
      select 1 from public.trips
      where trips.id = trip_stops.trip_id
      and (trips.user_id = auth.uid() or trips.is_shared = true)
    )
  );

create policy "Users can manage trip stops for their trips" on public.trip_stops
  for all using (
    exists (
      select 1 from public.trips
      where trips.id = trip_stops.trip_id
      and trips.user_id = auth.uid()
    )
  );

-- Activities policies
create policy "Users can view activities for accessible trips" on public.activities
  for select using (
    exists (
      select 1 from public.trip_stops
      join public.trips on trips.id = trip_stops.trip_id
      where trip_stops.id = activities.trip_stop_id
      and (trips.user_id = auth.uid() or trips.is_shared = true)
    )
  );

create policy "Users can manage activities for their trips" on public.activities
  for all using (
    exists (
      select 1 from public.trip_stops
      join public.trips on trips.id = trip_stops.trip_id
      where trip_stops.id = activities.trip_stop_id
      and trips.user_id = auth.uid()
    )
  );

-- Budget items policies
create policy "Users can view budget items for their trips" on public.budget_items
  for select using (
    exists (
      select 1 from public.trips
      where trips.id = budget_items.trip_id
      and (trips.user_id = auth.uid() or trips.is_shared = true)
    )
  );

create policy "Users can manage budget items for their trips" on public.budget_items
  for all using (
    exists (
      select 1 from public.trips
      where trips.id = budget_items.trip_id
      and trips.user_id = auth.uid()
    )
  );