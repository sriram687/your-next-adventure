-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  avatar_url text,
  join_date timestamp with time zone default now(),
  total_trips integer default 0,
  total_countries integer default 0,
  preferences jsonb default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create trips table
create table public.trips (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  start_date date not null,
  end_date date not null,
  status text default 'planning' check (status in ('planning', 'active', 'completed')),
  budget jsonb default '{"transport": 0, "stay": 0, "meals": 0, "activities": 0}',
  is_shared boolean default false,
  share_token uuid default uuid_generate_v4(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create trip_stops table
create table public.trip_stops (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  city text not null,
  country text not null,
  arrival_date date,
  departure_date date,
  coordinates jsonb, -- {lat: number, lng: number}
  notes text,
  order_index integer not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create activities table
create table public.activities (
  id uuid default uuid_generate_v4() primary key,
  trip_stop_id uuid references public.trip_stops(id) on delete cascade not null,
  title text not null,
  description text,
  activity_type text not null check (activity_type in ('sightseeing', 'food', 'adventure', 'culture', 'relaxation', 'shopping', 'nightlife', 'transport')),
  location text,
  start_time time,
  end_time time,
  date date,
  cost numeric(10,2) default 0,
  booking_status text default 'not_booked' check (booking_status in ('not_booked', 'booked', 'confirmed', 'cancelled')),
  booking_url text,
  notes text,
  order_index integer not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create budget_items table for detailed budget tracking
create table public.budget_items (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  category text not null check (category in ('transport', 'stay', 'meals', 'activities')),
  title text not null,
  amount numeric(10,2) not null,
  currency text default 'USD',
  date date,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create indexes for better performance
create index trips_user_id_idx on public.trips(user_id);
create index trips_status_idx on public.trips(status);
create index trips_share_token_idx on public.trips(share_token);
create index trip_stops_trip_id_idx on public.trip_stops(trip_id);
create index trip_stops_order_idx on public.trip_stops(trip_id, order_index);
create index activities_trip_stop_id_idx on public.activities(trip_stop_id);
create index activities_order_idx on public.activities(trip_stop_id, order_index);
create index budget_items_trip_id_idx on public.budget_items(trip_id);
create index budget_items_category_idx on public.budget_items(category);

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_profiles_updated_at before update on public.profiles for each row execute function update_updated_at_column();
create trigger update_trips_updated_at before update on public.trips for each row execute function update_updated_at_column();
create trigger update_trip_stops_updated_at before update on public.trip_stops for each row execute function update_updated_at_column();
create trigger update_activities_updated_at before update on public.activities for each row execute function update_updated_at_column();
create trigger update_budget_items_updated_at before update on public.budget_items for each row execute function update_updated_at_column();