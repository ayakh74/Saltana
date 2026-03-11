# سلطنة | Saltana Restaurant Website

A premium, multilingual Next.js restaurant website for Saltana restaurant in Arraba, Galilee.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS with custom gold/obsidian theme
- **i18n**: next-intl (Arabic [default], Hebrew, English)
- **Database**: Supabase (reservations)
- **Deployment**: Vercel
- **Fonts**: Cairo (Arabic), Heebo (Hebrew), Ubuntu (English)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Set up Supabase database

Run the SQL in `supabase-schema.sql` in your Supabase SQL editor to create the reservations table.

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — defaults to Arabic (RTL).

- Arabic: `http://localhost:3000/` (default)
- Hebrew: `http://localhost:3000/he`
- English: `http://localhost:3000/en`

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage (Hero, About, Menu Preview, Experiences, Instagram, Contact) |
| `/menu` | Full menu with all categories, sticky nav |
| `/reservations` | Reservation form with Supabase backend |
| `/experiences` | Experiences page (Ramadan, Private Events, Special Evenings) |

## Deploy to Vercel

```bash
# Push to GitHub first
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main

# Then in Vercel dashboard:
# 1. Import GitHub repository
# 2. Add environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
# 3. Deploy
```

## Adding Instagram Feed

To enable the live Instagram feed, use one of these services:
- **Behold.so** (recommended) — free plan available, easy setup
- **Elfsight** — Instagram Feed widget
- **SnapWidget** — Instagram widget

Replace the placeholder grid in `src/components/home/InstagramSection.tsx` with your embed code.

## Adding Menu Images

To add dish images:
1. Upload images to `/public/images/` (or use Cloudinary/S3)
2. Add the `image` property to menu items in `src/lib/menu-data.ts`

Example:
```ts
{
  id: 'm-1',
  nameAr: 'انتركوت',
  price: 125,
  image: '/images/entrecote.jpg',  // Add this
}
```

## Contact

- Phone: 054-5268467
- Instagram: @saltana.il
- Location: Arraba, Galilee, Israel
- Website: https://saltanaa.com
