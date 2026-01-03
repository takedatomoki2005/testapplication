# Visited Countries App

Next.js application for tracking visited countries, with Supabase integration and configured for deployment on Vercel.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Supabase** - Backend as a Service (database, auth, storage)
- **Tailwind CSS** - Utility-first CSS framework
- **Vercel** - Deployment platform

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can find these values in your Supabase project settings:
- Go to [Supabase Dashboard](https://app.supabase.com)
- Select your project
- Navigate to Settings → API
- Copy the Project URL and anon/public key

3. Set up the database table:

Go to your Supabase Dashboard → SQL Editor and run the SQL script:

**If this is a new database:**
- Copy the contents of `supabase/schema.sql`
- Paste and run the SQL to create the `visited_countries` table

**If you already have the table (without authentication):**
- Copy the contents of `supabase/migration.sql`
- Paste and run the SQL (⚠️ WARNING: This will delete existing data!)

This will create:
- A table to store visited countries with user authentication
- Row Level Security (RLS) policies to ensure users can only access their own data
- Indexes for better performance

4. Enable Email Authentication in Supabase:

- Go to your Supabase Dashboard → Authentication → Providers
- Make sure "Email" provider is enabled
- Configure email templates if needed (optional)

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Deployment on Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import your repository to Vercel:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your Git repository

3. Configure Environment Variables:
   - In your Vercel project settings, go to "Environment Variables"
   - Add the following variables:
     - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
   - Make sure to add them for all environments (Production, Preview, Development)

4. Deploy:
   - Vercel will automatically detect Next.js and deploy your application
   - Your app will be available at `https://your-project.vercel.app`

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── actions/           # Server actions
│   │   ├── auth.ts        # Authentication actions (sign in/up/out)
│   │   └── countries.ts   # Country CRUD operations
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── AuthButton.tsx     # Sign out button
│   ├── AuthTabs.tsx       # Sign in/Sign up tab switcher
│   ├── CountryForm.tsx    # Form to add countries
│   ├── CountryList.tsx    # List of visited countries
│   ├── SignInForm.tsx     # Sign in form
│   └── SignUpForm.tsx     # Sign up form
├── supabase/             # Database schema
│   ├── schema.sql        # SQL schema for new databases
│   └── migration.sql     # Migration script for existing databases
├── utils/
│   └── supabase/
│       ├── client.ts      # Client-side Supabase client
│       └── server.ts      # Server-side Supabase client
├── middleware.ts          # Next.js middleware for auth
├── .env.local.example     # Environment variables template
├── next.config.js         # Next.js configuration
├── tsconfig.json          # TypeScript configuration
└── tailwind.config.ts     # Tailwind CSS configuration
```

## Features

- ✅ **User Authentication** - Email/password sign up and sign in
- ✅ **User-Specific Data** - Each user sees only their own visited countries
- ✅ Add countries you've visited
- ✅ View list of all visited countries
- ✅ Add optional country codes and notes
- ✅ Delete countries from your list
- ✅ Secure data access with Row Level Security (RLS)
- ✅ Real-time updates using Next.js Server Actions

## Using Supabase

The app uses Next.js Server Actions for database operations. Server actions are defined in `app/actions/countries.ts`:

- `getVisitedCountries()` - Fetch all visited countries
- `addVisitedCountry()` - Add a new country
- `deleteVisitedCountry()` - Delete a country

### Client-Side Usage (if needed)

```typescript
import { supabase } from '@/utils/supabase/client'

// Example: Fetch data
const { data, error } = await supabase
  .from('visited_countries')
  .select('*')
```

### Server-Side Usage

```typescript
import { createServerClient } from '@/utils/supabase/server'

const supabase = createServerClient()

// Example: Fetch data in Server Component or API Route
const { data, error } = await supabase
  .from('visited_countries')
  .select('*')
```

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL (required)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key (required)
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (optional, for server-side admin operations only)

**Important**: Never commit `.env.local` to version control. It's already included in `.gitignore`.

## License

Private project for 一般社団法人HAKKEN

