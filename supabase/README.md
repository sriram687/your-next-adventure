# Supabase Database Setup

This directory contains SQL migration files to set up your travel planning app database.

## Files:

1. **001_initial_schema.sql** - Core database schema (tables, indexes, triggers)
2. **002_security_policies.sql** - Row Level Security policies  
3. **003_functions.sql** - Database functions and triggers
4. **004_sample_data.sql** - Sample destinations data

## How to apply migrations:

### Option 1: Using Supabase CLI (Recommended)
```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-id

# Apply migrations
supabase db push
```

### Option 2: Manual execution in Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste each migration file content in order
4. Execute them one by one

### Option 3: Using psql (if you have direct database access)
```bash
psql -h db.your-project-id.supabase.co -U postgres -d postgres -f 001_initial_schema.sql
psql -h db.your-project-id.supabase.co -U postgres -d postgres -f 002_security_policies.sql
psql -h db.your-project-id.supabase.co -U postgres -d postgres -f 003_functions.sql
psql -h db.your-project-id.supabase.co -U postgres -d postgres -f 004_sample_data.sql
```

## Database Schema Overview:

- **profiles** - User profiles (extends auth.users)
- **trips** - User trips with budget info
- **trip_stops** - Cities/locations in each trip  
- **activities** - Planned activities for each stop
- **budget_items** - Detailed budget tracking
- **destinations** - Sample destination data

All tables have proper RLS policies for security.