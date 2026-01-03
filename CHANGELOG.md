# Changelog

## v2.0.0 - January 3, 2026

### 🎮 New Features

#### Anonymous Battle Mode
- Users can now play **5 free battles** without signing up
- After 5 battles, prompts user to sign up to save progress
- Battle count persists in localStorage for anonymous users

#### Multi-Provider Authentication
- **Google OAuth** login support via NextAuth.js
- **Email/Password** signup and login
- Legacy **MetaMask** wallet login still supported
- New `/auth/signin` page with all login options

#### Daily Battle
- Fixed daily movie battle accessible to all logged-in users (not just MetaMask)
- Consistent UI matching the main battle component
- Date-seeded random pair ensures same movies for all users each day

#### Movie Lists
- **IMDB Top 250** - 242 classic films with posters
- **豆瓣 Top 250** - 208 films from Douban's top rated list
- New `/lists` page to browse all featured lists

#### Shorts Battle
- Seeded 96 viral YouTube shorts for battles
- Includes MrBeast, Khaby Lame, Zach King, BTS, BLACKPINK, and more

#### My Movies
- New `/my-movies` page for logged-in users
- Search TMDB to add movies to personal collection
- Delete movies from collection

### 🎨 UI/UX Improvements

#### Homepage Redesign
- Clean layout: Main Battle → Daily Battle
- Removed cluttered stats and quick links
- Battle UI consistent between anonymous and daily battles

#### Navigation
- Simplified navbar: Battle | Rankings | Lists | Users | Shorts
- Added Lists page to navbar
- Removed redundant "My Movies" from navbar (accessible via user menu)

#### Rankings Page
- Removed duplicate Battle Arena (battle is on homepage)
- Clean leaderboard-only view with movie posters
- Fixed Log link routing issues

#### User Profiles
- New `/users/[username]` route for viewing user collections
- `/users` page to browse all users
- Fixed routing conflicts between user pages

### 🔧 Technical Changes

#### Database
- Added NextAuth fields to User model: `email`, `password`, `googleId`, `image`
- SQLite database for local development

#### API Routes
- `/api/auth/[...nextauth]` - NextAuth handler
- `/api/auth/signup` - Email/password registration
- `/api/movies` - CRUD for user movies
- `/api/tmdb/search` - TMDB movie search proxy

#### Configuration
- Added `allowedOrigins` in `next.config.ts` for server actions
- Environment variables for NextAuth and Google OAuth

### 📝 Scripts Added
- `scripts/fetch-imdb-top250.js` - Import IMDB Top 250
- `scripts/fetch-douban-top250.js` - Import Douban Top 250
- `scripts/fetch-posters.js` - Fetch TMDB posters for movies
- `scripts/seed-shorts.js` - Seed viral shorts for battle

### 🐛 Bug Fixes
- Fixed "Invalid Server Actions request" errors from proxy
- Fixed Log tab navigation going to wrong page
- Fixed duplicate Daily Battle headers
- Fixed `/users/[username]` 404 errors

---

## Previous Versions

See git history for earlier changes.
