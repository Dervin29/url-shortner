# Trimrr - URL Shortener

A modern URL shortening application built with React, Vite, Supabase, and ShadCN UI. Trimrr turns long URLs into short, powerful links with real-time analytics, custom aliases, and QR codes.

**Live Demo:** https://url-shortner-xi-ten.vercel.app

---

## Features

- User authentication
- Create shortened URLs
- Custom short aliases
- QR code generation
- Click analytics
- Device statistics
- Location tracking
- Copy shortened links
- Download QR codes
- Delete shortened URLs
- Responsive design
- Form validation with Yup
- Modern UI built with ShadCN UI

---

## Tech Stack

### Frontend

- React 19
- Vite 8
- React Router 7
- Tailwind CSS 4
- ShadCN UI
- Base UI (React-ARIA components)
- Lucide React
- Recharts
- Sonner (toast notifications)
- Yup (form validation)
- ua-parser-js (user agent parsing)
- react-qrcode-logo
- react-spinners

### Backend & Database

- Supabase
  - Authentication
  - PostgreSQL Database
  - Row Level Security

---

## Screenshots

> Add screenshots of the application here.

- Landing Page
- Authentication
- Dashboard
- URL Details
- Analytics

---

## Installation

### Clone the repository

```bash
git clone https://github.com/your-username/url-shortner.git
```

```bash
cd url-shortner
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file.

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_URL=http://localhost:5173
```

### Run the development server

```bash
npm run dev
```

---

## Rate Limiting

Trimrr applies client-side rate limits to every endpoint tier. Thresholds are
**fully configurable** via `VITE_RATE_LIMIT_*` environment variables (defaults
shown below) — nothing is hardcoded in the code. See the commented block in
`.env` for the full list.

> Note: these are a client-side UX + abuse guard (stop refresh spam, button
> mashing, signup storage spam). They are **not** a security boundary — real
> server-side enforcement belongs in Supabase Edge Functions or RLS.

| Tier | Endpoints | Defaults |
| --- | --- | --- |
| **Auth** (strict) | login | 5/min per account, 10/min per device, exponential backoff (×2, max 15 min) |
| **Signup** (strict) | signup | 3/min per account, 5/min per device, exponential backoff |
| **Password reset** (strict) | reset password | 3/min per account, 5/min per device, exponential backoff |
| **Public** (moderate) | short-link redirect reads | 30/min per device |
| **Clicks** (moderate) | click recording | 1 per URL / 30s, 6 per session / min |
| **User** (loose) | authenticated CRUD + analytics | 120/min per user |

Auth routes combine **per-account** (keyed by email) and **per-client** limits
(keyed by a persistent device id that stands in for the IP, since client-side
code cannot read its own IP). Instead of a hard lockout, repeated blocked
attempts grow the wait exponentially (`windowMs × factor^(level−1)` capped at
`maxBackoffMs`); the counter resets once the wait elapses.

### Configurable thresholds

| Variable | Default | Meaning |
| --- | --- | --- |
| `VITE_RATE_LIMIT_AUTH_ACCOUNT_LIMIT` | `5` | Login attempts per account per window |
| `VITE_RATE_LIMIT_AUTH_ACCOUNT_WINDOW_MS` | `60000` | Login account window (ms) |
| `VITE_RATE_LIMIT_AUTH_CLIENT_LIMIT` | `10` | Login attempts per device per window |
| `VITE_RATE_LIMIT_AUTH_CLIENT_WINDOW_MS` | `60000` | Login device window (ms) |
| `VITE_RATE_LIMIT_AUTH_BACKOFF_FACTOR` | `2` | Backoff growth factor |
| `VITE_RATE_LIMIT_AUTH_BACKOFF_MAX_MS` | `900000` | Max backoff wait (ms) |
| `VITE_RATE_LIMIT_SIGNUP_ACCOUNT_LIMIT` | `3` | Signup attempts per account per window |
| `VITE_RATE_LIMIT_SIGNUP_CLIENT_LIMIT` | `5` | Signup attempts per device per window |
| `VITE_RATE_LIMIT_RESET_ACCOUNT_LIMIT` | `3` | Reset attempts per account per window |
| `VITE_RATE_LIMIT_RESET_CLIENT_LIMIT` | `5` | Reset attempts per device per window |
| `VITE_RATE_LIMIT_PUBLIC_LIMIT` | `30` | Redirect reads per device per window |
| `VITE_RATE_LIMIT_PUBLIC_WINDOW_MS` | `60000` | Public window (ms) |
| `VITE_RATE_LIMIT_CLICK_URL_LIMIT` | `1` | Click recordings per URL per window |
| `VITE_RATE_LIMIT_CLICK_URL_WINDOW_MS` | `30000` | Per-URL click window (ms) |
| `VITE_RATE_LIMIT_CLICK_SESSION_LIMIT` | `6` | Click recordings per session per window |
| `VITE_RATE_LIMIT_CLICK_SESSION_WINDOW_MS` | `60000` | Session click window (ms) |
| `VITE_RATE_LIMIT_USER_LIMIT` | `120` | Authenticated actions per user per window |
| `VITE_RATE_LIMIT_USER_WINDOW_MS` | `60000` | User window (ms) |

---

## Build for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## Project Structure

```
src/
│
├── components/
├── context/
├── db/
├── hooks/
├── layouts/
├── lib/
├── pages/
├── utils/
└── main.jsx
```

---

## Application Flow

1. User signs up or logs in.
2. User creates a shortened URL.
3. A unique short link and QR code are generated.
4. Visitors access the shortened URL.
5. Clicks are recorded.
6. Users can view analytics, including:
   - Total clicks
   - Device information
   - Geographic location

---

## Key Features

### URL Management

- Create shortened URLs
- Custom short aliases
- Delete URLs
- Copy links instantly

### Analytics

- Total click count
- Device statistics
- Geographic insights
- Click history

### QR Code

- Automatic QR code generation
- Download QR code as an image

### Authentication

- Secure login
- User registration
- Protected dashboard

---

## Deployment

The application is deployed on Vercel.

Live URL: https://url-shortner-xi-ten.vercel.app

---

## Future Improvements

- Custom domains
- Password-protected links
- Link expiration
- Bulk URL shortening
- Advanced analytics dashboard
- API for developers
- Dark mode
- Team workspaces

---
