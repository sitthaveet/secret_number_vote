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

- `app/page.tsx` - Single-page application with client-side rendering ("use client")
- `app/layout.tsx` - Root layout with Thai (Kanit) and monospace (Space Mono) fonts
- Uses `@/*` path alias for imports (maps to project root)

### Core Functionality

The app is a seat prediction game for the Thai People's Party (พรรคประชาชน) 2569 election:
- Users input a predicted number of seats (0-500)
- Users select a party member from a predefined list (`PARTY_LIST_MEMBERS` array)
- The app generates a SHA-256 hash of the combined input as a verification code
- Hash generation uses the Web Crypto API (`crypto.subtle.digest`)


Database Schema
CREATE TABLE public.user (
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text UNIQUE NOT NULL,
  hash text,
  updated_at timestamp with time zone DEFAULT now()
);

-- Add unique constraint if not exists
ALTER TABLE public.user ADD CONSTRAINT user_name_key UNIQUE (name);