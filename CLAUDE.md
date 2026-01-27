# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server**: `npm run dev` (starts on http://localhost:3000)
- **Build**: `npm run build`
- **Production**: `npm run start`
- **Lint**: `npm run lint`

## Architecture

This is a Next.js 16 application using the App Router with TypeScript, React 19, and Tailwind CSS 4.

### Application Structure

**Pages:**
- `app/page.tsx` - Main prediction page with client-side rendering ("use client")
- `app/leaderboard/page.tsx` - Leaderboard showing all users and their encrypted predictions
- `app/verify/page.tsx` - Verification page to decrypt and view predictions
- `app/layout.tsx` - Root layout with Thai (Kanit) and monospace (Space Mono) fonts

**Libraries:**
- `lib/crypto.ts` - OTP (One-Time Pad) encryption/decryption using XOR
- `lib/constants.ts` - Party list members array (80 members)
- `lib/supabase.ts` - Supabase client configuration

**Assets:**
- `public/userProfile/*.png` - Profile pictures for users (Karn, Petch, Jern, Tae, Proud, Mild, Son)
- `public/logo_people_party.jpeg` - Party logo

### Core Functionality

The app is a seat prediction game for the Thai People's Party (พรรคประชาชน) 2569 election:

**Main Page (`/`):**
- Users select their name from: Karn, Petch, Jern, Tae, Proud, Mild, Son
- Users input a predicted number of seats (0-500)
- Users select a party member from `PARTY_LIST_MEMBERS` array (80 members)
- The app encrypts the prediction using OTP encryption with the party member name as key
- Encrypted result is a 6-character hex string (e.g., "abc123")
- Data is saved to Supabase (inserts new or updates existing user)
- Automatically redirects to leaderboard after submission

**Leaderboard Page (`/leaderboard`):**
- Fetches all users from Supabase
- Displays each user with their profile picture and encrypted prediction
- Shows creation timestamp
- Grid layout with hover effects

**Verify Page (`/verify`):**
- Users input a 6-character hex ciphertext
- Users select the party member used during prediction
- Decrypts and displays the original predicted number
- Shows success/failure message

### Encryption System

**OTP (One-Time Pad) Encryption:**
- Uses XOR cipher with party member name as key
- `otpEncrypt(number, key)` - Encrypts number (0-500) to 6-char hex
  1. Pads number to 3 digits ("7" → "007")
  2. Converts to UTF-8 bytes
  3. XORs with key bytes
  4. Returns hex string
- `otpDecrypt(ciphertext, key)` - Decrypts hex to number or null
  1. Parses 6-char hex to 3 bytes
  2. XORs with key bytes
  3. Validates result is valid number (0-500)

### Database (Supabase)

**Schema:**
```sql
CREATE TABLE public.user (
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text UNIQUE NOT NULL,
  hash text,
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.user ADD CONSTRAINT user_name_key UNIQUE (name);
```

**Environment Variables Required:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

### Navigation

All pages include a fixed navigation bar with:
- Logo and "ทายที่นั่ง" branding
- Links to main page ("หน้าหลัก") and leaderboard ("ผลการเลือก")
- Styling with backdrop blur and border effects

### Path Aliases

- Uses `@/*` path alias for imports (maps to project root)
- Example: `import { supabase } from "@/lib/supabase"`