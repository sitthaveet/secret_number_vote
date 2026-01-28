# ทายที่นั่ง - Thai People's Party Seat Prediction Game

A secure seat prediction game for the Thai People's Party (พรรคประชาชน) 2569 election. Users make encrypted predictions about the number of seats the party will win, with predictions securely stored and verifiable.

## Features

- **Secure Predictions**: Uses OTP (One-Time Pad) encryption with random salts to keep predictions secret
- **Leaderboard**: View all participants and their encrypted predictions
- **Verification System**: Decrypt and verify predictions using the correct party member key
- **User Profiles**: Personalized experience with profile pictures for 7 participants
- **Thai Language Support**: Full Thai language interface with Kanit font

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI**: React 19, Tailwind CSS 4
- **Database**: Supabase
- **Fonts**: Kanit (Thai), Space Mono (Monospace)
- **Encryption**: XOR-based OTP with random salts

## Getting Started

### Prerequisites

- Node.js (recommended: latest LTS)
- npm, yarn, pnpm, or bun
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd secret_number_vote
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database:
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

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Making a Prediction

1. Select your name (Karn, Petch, Jern, Tae, Proud, Mild, or Son)
2. Enter your predicted number of seats (0-500)
3. Choose a party member from the list (80 members) as your encryption key
4. Submit - your prediction is encrypted and stored
5. Automatically redirected to the leaderboard

### Encryption Process

- A random 6-character hex salt is generated
- Your number is padded to 3 digits (e.g., "7" → "007")
- The salt and party member name are combined as the encryption key
- XOR cipher is applied to create a 12-character hex ciphertext
- Format: `[6-char salt][6-char encrypted data]`
- Only you know which party member you selected, keeping your prediction secure

### Verifying a Prediction

1. Navigate to the Verify page
2. Enter the 12-character encrypted code
3. Select the party member that was used for encryption
4. The system decrypts and displays the original predicted number

## Project Structure

```
secret_number_vote/
├── app/
│   ├── page.tsx              # Main prediction page
│   ├── leaderboard/page.tsx  # Leaderboard display
│   ├── verify/page.tsx       # Verification page
│   └── layout.tsx            # Root layout
├── components/
│   └── Navbar.tsx            # Navigation component
├── lib/
│   ├── crypto.ts             # OTP encryption/decryption
│   ├── constants.ts          # Party members list
│   └── supabase.ts           # Supabase client
└── public/
    ├── userProfile/          # User profile pictures
    └── logo_people_party.jpeg
```

## Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Security Features

- **One-Time Pad Encryption**: Cryptographically secure with proper key management
- **Random Salts**: Each prediction uses a unique random salt
- **Key Privacy**: Encryption key (party member) is never stored, only known to the user
- **No Plaintext Storage**: Original predictions are never stored in the database

## Database Schema

The application uses a simple Supabase table:

| Column | Type | Description |
|--------|------|-------------|
| `created_at` | timestamp | Prediction creation time |
| `name` | text (unique) | User name |
| `hash` | text | 12-char encrypted prediction |
| `salt` | text | 6-char hex salt (also embedded in hash) |
| `securityOption` | boolean | Security option flag |
| `updated_at` | timestamp | Last update time |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is for educational and entertainment purposes.
