-- Functions for common operations

-- Function to create user profile when user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

-- Trigger to create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update trip counts
create or replace function public.update_user_trip_count()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if TG_OP = 'INSERT' then
    update public.profiles
    set total_trips = total_trips + 1
    where id = new.user_id;
    return new;
  elsif TG_OP = 'DELETE' then
    update public.profiles
    set total_trips = greatest(total_trips - 1, 0)
    where id = old.user_id;
    return old;
  end if;
  return null;
end;
$$;

-- Trigger to update trip count
create trigger update_trip_count
  after insert or delete on public.trips
  for each row execute procedure public.update_user_trip_count();

-- Function to calculate trip budget total
create or replace function public.get_trip_budget_total(trip_id uuid)
returns jsonb
language plpgsql
security definer set search_path = public
as $$
declare
  budget_total jsonb;
begin
  select jsonb_build_object(
    'transport', coalesce(sum(case when category = 'transport' then amount else 0 end), 0),
    'stay', coalesce(sum(case when category = 'stay' then amount else 0 end), 0),
    'meals', coalesce(sum(case when category = 'meals' then amount else 0 end), 0),
    'activities', coalesce(sum(case when category = 'activities' then amount else 0 end), 0)
  ) into budget_total
  from public.budget_items
  where budget_items.trip_id = get_trip_budget_total.trip_id;
  
  return budget_total;
end;
$$;

-- Function to get trip with all details
create or replace function public.get_trip_details(trip_id uuid)
returns json
language plpgsql
security definer set search_path = public
as $$
declare
  trip_data json;
begin
  select json_build_object(
    'trip', to_json(t.*),
    'stops', (
      select json_agg(
        json_build_object(
          'stop', to_json(ts.*),
          'activities', (
            select json_agg(to_json(a.*))
            from public.activities a
            where a.trip_stop_id = ts.id
            order by a.order_index
          )
        )
      )
      from public.trip_stops ts
      where ts.trip_id = t.id
      order by ts.order_index
    ),
    'budget_items', (
      select json_agg(to_json(bi.*))
      from public.budget_items bi
      where bi.trip_id = t.id
    )
  ) into trip_data
  from public.trips t
  where t.id = get_trip_details.trip_id;
  
  return trip_data;
end;
$$;