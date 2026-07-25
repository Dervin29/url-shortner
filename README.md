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
