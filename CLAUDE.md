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

**Components:**
- `components/Navbar.tsx` - Centralized navigation bar component with active page highlighting

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
- The app generates a random salt and encrypts the prediction using OTP encryption with the party member name as key
- Encrypted result is a 12-character hex string (6-char salt + 6-char ciphertext, e.g., "abc123def456")
- Data is saved to Supabase including the hash and salt (inserts new or updates existing user)
- Automatically redirects to leaderboard after submission

**Leaderboard Page (`/leaderboard`):**
- Fetches all users from Supabase
- Displays each user with their profile picture and encrypted prediction
- Shows creation timestamp
- Grid layout with hover effects

**Verify Page (`/verify`):**
- Users input a 12-character hex ciphertext (contains embedded salt)
- Users select the party member used during prediction
- Decrypts and displays the original predicted number
- Shows success/failure message

### Encryption System

**OTP (One-Time Pad) Encryption with Random Salt:**
- Uses XOR cipher with party member name as key combined with a random salt
- `generateSalt()` - Generates a random 6-character hex salt
- `otpEncrypt(number, key, salt?)` - Encrypts number (0-500) to 12-char hex
  1. Generates random 3-byte salt (or uses provided salt)
  2. Pads number to 3 digits ("7" → "007")
  3. Combines salt with key for enhanced security
  4. Converts to UTF-8 bytes
  5. XORs with combined key bytes
  6. Returns 12-char hex string (6-char salt + 6-char ciphertext)
- `otpDecrypt(ciphertext, key)` - Decrypts 12-char hex to number or null
  1. Extracts salt (first 6 chars) and ciphertext (last 6 chars)
  2. Parses ciphertext hex to 3 bytes
  3. Combines salt with key (same as encryption)
  4. XORs with combined key bytes
  5. Validates result is valid number (0-500)

### Database (Supabase)

**Schema:**
```sql
CREATE TABLE public.user (
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text UNIQUE NOT NULL,
  hash text,
  salt text,
  securityOption boolean,
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.user ADD CONSTRAINT user_name_key UNIQUE (name);
```


### Navigation

All pages use a centralized Navbar component (`components/Navbar.tsx`) with:
- Logo and "ทายที่นั่ง" branding
- Links to main page ("หน้าหลัก"), leaderboard ("ผลการเลือก"), and verify ("ตรวจสอบรหัส")
- Active page highlighting with orange accent color
- Styling with backdrop blur and border effects
- Props: `activePage` - accepts "home", "leaderboard", or "verify" to highlight the active page

### Path Aliases

- Uses `@/*` path alias for imports (maps to project root)
- Example: `import { supabase } from "@/lib/supabase"`