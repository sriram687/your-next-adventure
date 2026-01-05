# 🌍 Your Next Adventure

A comprehensive travel planning application built with React, TypeScript, Supabase, and Tailwind CSS. Plan your trips, create itineraries, manage budgets, and share your adventures with friends.

## ✨ Features

- **Trip Planning**: Create detailed trips with destinations, dates, and budgets
- **Itinerary Builder**: Add stops and activities to your trips with scheduling
- **Budget Management**: Track expenses by category with multi-currency support
- **Image Selection**: Choose from curated Unsplash photos for trip covers and profile avatars
- **Trip Sharing**: Share your itineraries with friends via email invitations
- **Real-time Sync**: All data synchronized with Supabase backend
- **Dark/Light Theme**: Toggle between themes with system preference support

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Bun (recommended) or npm/yarn
- Supabase account
- (Optional) Unsplash API key for extended photo features

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd your-next-adventure
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key (optional)
   ```

4. **Set up Supabase database**
   
   Run the provided SQL migrations in your Supabase SQL editor:
   ```bash
   # In supabase/migrations/ directory
   # Run each .sql file in order (001_, 002_, etc.)
   ```

5. **Start the development server**
   ```bash
   bun dev
   # or npm run dev
   ```

   Visit `http://localhost:5173`

## 🗄️ Database Setup

### Required Tables

The application requires these tables in your Supabase database:

- **profiles** - User profile information
- **trips** - Trip details and metadata
- **trip_stops** - Cities/locations within trips
- **activities** - Things to do at each stop
- **budget_items** - Expense tracking
- **destinations** - Popular travel destinations
- **trip_shares** - Email-based trip sharing

### Migration Files

Apply these migrations in order:

1. `001_initial_schema.sql` - Core tables and structure
2. `002_profiles_table.sql` - User profiles with preferences
3. `003_destinations_data.sql` - Popular destinations seed data
4. `004_rls_policies.sql` - Row Level Security policies
5. `005_trip_sharing_policies.sql` - Trip sharing access controls

### Row Level Security (RLS)

All tables have RLS enabled with policies that ensure:
- Users can only access their own data
- Shared trips are accessible to authorized users
- Profile information is controlled by the owner

## 🎯 Usage

### Creating Your First Trip

1. **Sign up/Login** with email authentication
2. **Create a new trip** from the dashboard
3. **Choose a cover photo** from the curated collection
4. **Add destinations** and set your travel dates
5. **Plan your itinerary** by adding stops and activities
6. **Track your budget** with categorized expenses

### Sharing Trips

1. **Open a trip** from your trips list
2. **Click the share button** in the trip header
3. **Enter email addresses** of friends you want to share with
4. **Set permissions** (view-only or can-edit)
5. **Send invitations** - recipients get email access

### Budget Tracking

- Add expenses in multiple currencies
- Categorize by type (accommodation, food, transport, etc.)
- View spending summaries and trends
- Set budget limits and track progress

## 🛠️ Development

### Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **State Management**: React Context + Hooks
- **Images**: Unsplash API integration
- **Routing**: React Router v6

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   ├── layout/         # App layout components
│   ├── trips/          # Trip-specific components
│   └── ...
├── contexts/           # React context providers
├── hooks/              # Custom React hooks
├── integrations/       # Third-party integrations
├── lib/               # Utility functions
├── pages/             # Page components
├── services/          # API service functions
└── types/             # TypeScript type definitions
```

### Key Services

- **tripService.ts** - Trip CRUD operations and database queries
- **profileService.ts** - User profile management
- **sharingService.ts** - Email-based trip sharing logic
- **imageService.ts** - Unsplash photo integration

### Adding New Features

1. **Create service functions** in the appropriate service file
2. **Update TypeScript types** as needed
3. **Create UI components** using the existing design system
4. **Test with the development database**

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - automatic builds from main branch

### Other Platforms

The app is a standard Vite React application and can be deployed to:
- Netlify
- AWS Amplify
- GitHub Pages
- Any static hosting service

### Build Commands

```bash
# Build for production
bun run build

# Preview production build
bun run preview

# Type checking
bun run type-check

# Linting
bun run lint
```

## 🔐 Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Unsplash (Optional)
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key

# App Configuration (Optional)
VITE_APP_URL=https://yourapp.com  # For email sharing links
```

## 📱 Features in Detail

### Trip Management
- Create unlimited trips with rich metadata
- Set travel dates and duration
- Add descriptions and notes
- Choose from curated cover photos
- Organize trips by status (planning, ongoing, completed)

### Itinerary Planning
- Add multiple stops/cities to each trip
- Schedule activities with dates and times
- Track activity costs and booking status
- Reorder stops and activities with drag-and-drop
- Add notes and booking URLs

### Budget Tracking
- Multi-currency expense tracking
- Category-based organization
- Real-time budget calculations
- Spending visualizations
- Export capabilities

### Social Features
- Email-based trip sharing
- Permission levels (view/edit)
- Shareable trip URLs
- Community features ready for expansion

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** with proper TypeScript types
4. **Add tests** if applicable
5. **Commit your changes** (`git commit -m 'Add amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Open a GitHub issue for bugs or feature requests
- **Supabase**: Check Supabase docs for database and auth issues
- **Unsplash**: Review Unsplash API documentation for image features

## 🎉 Acknowledgments

- [Supabase](https://supabase.com) for backend infrastructure
- [Shadcn/ui](https://ui.shadcn.com) for UI components
- [Unsplash](https://unsplash.com) for beautiful travel photography
- [Tailwind CSS](https://tailwindcss.com) for styling system
- [Lucide](https://lucide.dev) for icons

---

**Happy traveling! ✈️**
