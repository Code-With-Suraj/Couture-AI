<div align="center">
  <img width="1200" height="475" alt="Roopix AI Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Roopix AI — Personal AI Stylist & Virtual Try‑On

Upload a full‑body photo and receive expert outfit recommendations from a world‑class AI stylist. Explore Formal, Casual, and Stylish looks curated for your selected season and occasion, then generate photorealistic virtual try‑on images and save your favorites.

If you’re using Google AI Studio, you can also open the app there:
https://ai.studio/apps/drive/1BsheayaibS78PB2zTXHqvrysbBRjYT1d

## Features

- Upload full‑body photo and analyze style context
- Select season and occasion to tailor results
- Curated outfit suggestions across Formal, Casual, Stylish
- Detailed rationale and garment manifest per outfit
- Virtual try‑on (three 1:1, photorealistic image variations)
- Local favorites gallery powered by IndexedDB
- Optional Supabase authentication (Google/GitHub) if configured

## Tech Stack

- React (`react`, `react-dom`)
- Vite (`vite`) + TypeScript
- Google Gemini via `@google/genai`
- Optional: Supabase Auth (`@supabase/auth-ui-react`) and `@supabase/supabase-js`
- IndexedDB for local persistence of favorites

## Quick Start

- Prerequisites: Node.js 18+ recommended
- Install dependencies: `npm install`
- Create `.env.local` in the project root with your credentials (see Environment Variables)
- Start development server: `npm run dev` (default on `http://localhost:3000`)
- Build for production: `npm run build`
- Preview production build locally: `npm run preview`

## Environment Variables

Create a `.env.local` file at the project root and set:

```
# Required — used by Google Gemini client
GEMINI_API_KEY=your_google_ai_studio_api_key

# Optional — only needed if you enable Supabase Auth
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your_anon_or_service_key
```

- `vite.config.ts` injects `GEMINI_API_KEY` into `process.env.API_KEY` and `process.env.GEMINI_API_KEY` for client code.
- `services/geminiService.ts` reads `process.env.API_KEY`. If it’s missing, you’ll see “API_KEY environment variable not set.”
- `services/supabaseClient.ts` reads `SUPABASE_URL` and `SUPABASE_KEY`. If missing and the Auth component is used, you’ll see “Supabase URL and anon key are required.”

## How It Works

- Home: Start from a marketing landing that explains capabilities.
- Upload: Choose a full‑body image to analyze.
- Season → Occasion: Pick contextual parameters that guide styling.
- Suggestions: Receive three curated categories (Formal, Casual, Stylish), each with three outfit variations, including rationale and item list.
- Virtual Try‑On: Generate three photorealistic square (1:1) images that preserve identity, lighting, and background.
- Favorites: Save generated images to a local IndexedDB gallery.

## Project Structure

```
roopix-ai/
├── App.tsx                    # App flow & state machine (home → upload → select → try-on)
├── components/                # UI components (Uploader, Selectors, TryOn, Gallery, etc.)
├── hooks/useFavorites.ts      # Favorites management via IndexedDB
├── services/geminiService.ts  # Outfit suggestions & virtual try-on using Gemini
├── services/supabaseClient.ts # Optional Supabase initialization
├── services/db.ts             # IndexedDB wrapper for favorites
├── index.tsx / index.html     # App entry
├── vite.config.ts / tsconfig.json
├── metadata.json              # App metadata
└── README.md
```

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build production assets
- `npm run preview` — Preview the production build locally

## Deployment

- Any static host (Vercel, Netlify, Cloudflare Pages) works.
- Set environment variables in your host:
  - `GEMINI_API_KEY` (required)
  - `SUPABASE_URL` and `SUPABASE_KEY` (optional; only if using Auth)
- Ensure client env injection is supported (Vite will inline `process.env.*` based on your host’s env settings).

## Troubleshooting

- “API_KEY environment variable not set.”
  - Verify `GEMINI_API_KEY` is present in `.env.local` and your host’s env.
  - Restart the dev server after adding `.env.local`.

- “Supabase URL and anon key are required.”
  - Add `SUPABASE_URL` and `SUPABASE_KEY` or remove/avoid rendering the `Auth` component.

- Empty or invalid suggestions
  - Use a clear full‑body photo; try different season/occasion.
  - Check API quotas and rate limits in Google AI Studio.

- Port already in use
  - Vite runs on `3000` by default (see `vite.config.ts`). Free the port or change it.

## Privacy & Safety

- Uploaded images are processed to generate suggestions and try‑on images via Google Gemini.
- Do not commit `.env.local` or share API keys.
- Review your data handling obligations before deploying to production.

## Acknowledgements

- Built with React, Vite, TypeScript, and Google Gemini.
- Optional authentication powered by Supabase.
