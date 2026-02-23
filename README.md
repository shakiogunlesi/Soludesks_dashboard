# Soludesks — Learning Management System

A modern Learning Management System (LMS) built with **Next.js 15**, **Redux Toolkit**, and **Tailwind CSS**, designed for creating, organizing, and assigning courses to teams and individuals.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Redux Toolkit** — global state management
- **RTK Query** — API data fetching setup
- **next/font** — optimized font loading with [Geist](https://vercel.com/font)

## Features

- Course management dashboard with search and filtering
- Course detail page with learner table
- Interactive course learning page with lesson tracking
- Quiz completion flow with progress state
- Redux-powered user state across all pages

## State Management

This project uses **Redux Toolkit** for global state management:

- **User Slice** (`store/userSlice.ts`) — manages authenticated user state with `setUser` and `clearUser` actions
- **API Slice** (`store/apiSlice.ts`) — RTK Query setup with `getCourses` and `getProfile` example endpoints
- **Store** (`store/store.ts`) — configured with Redux DevTools support

The Redux `Provider` is set up in `app/providers.tsx` and wraps the entire app via `app/layout.tsx`.

## Project Structure
```
app/
├── store/
│   ├── store.ts          # Redux store configuration
│   ├── userSlice.ts      # User state slice
│   └── apiSlice.ts       # RTK Query API slice
├── courses/
│   └── effective-workplace-communication/
│       ├── page.tsx      # Course detail page
│       └── courselearning/
│           └── page.tsx  # Course learning page
├── dashboard/
│   └── page.tsx          # Main dashboard
├── providers.tsx          # Redux Provider wrapper
├── layout.tsx             # Root layout
└── page.tsx               # Entry page
```

## Getting Started

First, install dependencies:
```bash
npm install
```

Then run the development server:
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

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial
- [Redux Toolkit Documentation](https://redux-toolkit.js.org) - learn about Redux Toolkit
- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview) - learn about RTK Query

You can check out the [Next.js GitHub repository](https://github.com/vercel/next.js) — your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy this app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
