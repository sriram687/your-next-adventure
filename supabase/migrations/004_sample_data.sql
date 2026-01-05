-- Sample data for testing (optional)

-- Insert sample destinations data
create table if not exists public.destinations (
  id uuid default uuid_generate_v4() primary key,
  city text not null,
  country text not null,
  description text,
  image_url text,
  rating numeric(2,1) check (rating between 0 and 5),
  price_range text check (price_range in ('budget', 'moderate', 'luxury')),
  best_season text,
  coordinates jsonb,
  created_at timestamp with time zone default now()
);

-- Enable RLS on destinations
alter table public.destinations enable row level security;

-- Public read access to destinations
create policy "Anyone can view destinations" on public.destinations
  for select using (true);

-- Admin only write access (you can adjust this)
create policy "Only admins can modify destinations" on public.destinations
  for all using (auth.uid() in (
    select id from public.profiles where id = auth.uid()
  ));

-- Insert sample destinations
insert into public.destinations (city, country, description, rating, price_range, best_season, coordinates) values
('Paris', 'France', 'City of Light, famous for the Eiffel Tower, Louvre Museum, and romantic atmosphere.', 4.8, 'moderate', 'Spring/Fall', '{"lat": 48.8566, "lng": 2.3522}'),
('Tokyo', 'Japan', 'Modern metropolis blending traditional culture with cutting-edge technology.', 4.9, 'moderate', 'Spring/Fall', '{"lat": 35.6762, "lng": 139.6503}'),
('Bali', 'Indonesia', 'Tropical paradise known for beautiful beaches, temples, and rich culture.', 4.7, 'budget', 'Dry season (Apr-Sep)', '{"lat": -8.3405, "lng": 115.0920}'),
('New York', 'USA', 'The Big Apple - iconic skyline, Broadway shows, and world-class museums.', 4.6, 'luxury', 'Spring/Fall', '{"lat": 40.7128, "lng": -74.0060}'),
('Barcelona', 'Spain', 'Vibrant city with stunning architecture, beautiful beaches, and amazing food.', 4.8, 'moderate', 'Spring/Fall', '{"lat": 41.3851, "lng": 2.1734}'),
('Santorini', 'Greece', 'Stunning Greek island with white-washed buildings and breathtaking sunsets.', 4.9, 'luxury', 'Summer', '{"lat": 36.3932, "lng": 25.4615}'),
('Bangkok', 'Thailand', 'Bustling capital with ornate temples, vibrant street life, and incredible food.', 4.5, 'budget', 'Cool season (Nov-Feb)', '{"lat": 13.7563, "lng": 100.5018}'),
('Cape Town', 'South Africa', 'Beautiful city with Table Mountain, wineries, and stunning coastline.', 4.7, 'moderate', 'Summer (Dec-Mar)', '{"lat": -33.9249, "lng": 18.4241}');