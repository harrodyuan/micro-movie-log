# Moving Image Data Base (MIDB)

A minimalist, high-performance log for movies and moving images. Built with Next.js, Tailwind CSS, and Framer Motion.

![MIDB Preview](./public/preview.png)

## Design Philosophy
**"Rich Minimalism"**
- **Monochrome**: Pure Black & White (OLED friendly). No greys, no blues.
- **System Fonts**: Uses Apple's native San Francisco font stack for a premium, OS-integrated feel.
- **Focus**: Content first. No cheap icons or unnecessary metadata.

## Features
- **Timeline View**: A clean, chronological log of watched content.
- **Top 10 Collections**: Curated lists with rich visuals.
- **Search & Filter**: Instant filtering by year, month, and search query.
- **Responsive**: Perfectly adapted for Mobile and Desktop.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel

## Roadmap & TODOs
### Phase 1: Content Expansion
- [ ] **Shorts Support**: Add support for rating TikToks, Reels, and YouTube Shorts.
- [ ] **Tagging System**: Add `type` tags (Movie, Short, Ad, Music Video).

### Phase 2: Social & "Beli for Movies"
- [ ] **Authentication**: User accounts to create their own logs.
- [ ] **Comparison Mode**: "Which is better?" A/B testing for building personal rankings.
- [ ] **The Stack**: Visualizing watched content as a stack of digital tickets.

### Phase 3: Platform
- [ ] **Public Profiles**: `midb.com/username` sharing.
- [ ] **Import/Export**: Easy migration from Letterboxd.

## Getting Started

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
