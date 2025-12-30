# BeyondChats Frontend

A React application for viewing and browsing BeyondChats articles, with clear distinction between Original Articles and AI-Enhanced (Updated) Articles.

## Live Deployment

- **Frontend (Vercel):** https://beyondchats-dt90lwfte-jaiprakashs-projects-76fe2e00.vercel.app
- **Backend API (Render):** https://beyondchats-yt9u.onrender.com
- **API Endpoint:** https://beyondchats-yt9u.onrender.com/api/articles

## Project Overview

This frontend application implements **Phase 3** of the assignment:

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Scraping + CRUD APIs | Backend |
| Phase 2 | Google Search + LLM Rewriting | Backend |
| **Phase 3** | **React Frontend UI** | **This Project** |

The UI connects to the BeyondChats backend API to display:
- **Original Articles** (`isUpdated = false`) — Scraped directly from BeyondChats blog
- **Updated Articles** / **AI-Enhanced Articles** (`isUpdated = true`) — Rewritten versions with improved structure and SEO

There is a one-to-one mapping between original and updated articles. Article numbering (1–5) corresponds to matched pairs (e.g., Original #1 maps to Updated #1).

## Architecture / Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                        │
│                    Deployed on Vercel                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP GET /api/articles
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend API (Express)                      │
│                    Deployed on Render                           │
│              https://beyondchats-yt9u.onrender.com              │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MongoDB (Atlas)                            │
│                    Articles Collection                          │
└─────────────────────────────────────────────────────────────────┘
```

## Backend Integration

This frontend integrates with the backend API as follows:

- **Endpoint:** `GET /api/articles` — Fetches all articles
- **Endpoint:** `GET /api/articles/:id` — Fetches a single article by ID
- **Filtering:** Uses the `isUpdated` field to distinguish article types:
  - `isUpdated = false` → Original Articles
  - `isUpdated = true` → Updated Articles (AI-Enhanced)
- **References:** Updated articles include a `references` array containing URLs of external sources used during LLM rewriting

## Tech Stack

- **Framework:** React 19 (Vite)
- **Language:** JavaScript
- **Styling:** Tailwind CSS v4
- **Routing:** React Router DOM v7
- **HTTP Client:** Axios
- **Build Tool:** Vite

## Project Structure

```
beyondchats-frontend/
│
├── src/
│   ├── api/
│   │   └── articles.js          # API layer with Axios
│   ├── components/
│   │   ├── ArticleCard.jsx      # Article card component
│   │   └── Navbar.jsx           # Navigation bar
│   ├── config/
│   │   └── api.js               # API base URL configuration
│   ├── pages/
│   │   ├── Home.jsx             # Home page with article grid
│   │   └── ArticleDetail.jsx    # Article detail page
│   ├── App.jsx                  # Main app with routing
│   ├── main.jsx                 # Entry point
│   └── index.css                # Tailwind & global styles
│
├── public/
├── .env                         # Environment variables
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

## Local Setup

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- Backend running locally on http://localhost:5000 (or use deployed backend)

### Installation Steps

1. **Navigate to the project:**
   ```bash
   cd beyondchats-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment (optional):**
   
   The default configuration points to the deployed backend. For local development:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   ```
   http://localhost:5173
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | Production: `https://beyondchats-yt9u.onrender.com/api` |

Note: Do not commit `.env` files containing secrets. The production URL is configured as a fallback in the code.

## Deployment

- **Platform:** Vercel
- **Build Tool:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

Set `VITE_API_BASE_URL` in Vercel environment variables to point to the deployed backend.

## Screens

### Home Page (/)

- Displays all articles in a responsive card grid
- Filter buttons to show:
  - **All** articles
  - **Original** articles only (`isUpdated = false`)
  - **Updated** articles only (`isUpdated = true`)
- Each card shows:
  - Article title
  - Badge indicating Original or Updated
  - Content preview
  - Publication date
- Click any card to view full article

### Article Detail Page (/article/:id)

- Full article content with preserved formatting
- Headings (H2, H3, H4) rendered properly
- Lists and paragraphs styled
- Badge showing article type
- **References section** at bottom (for Updated articles)
  - Each reference is a clickable external link
- Back navigation to home

## Design Features

- **Responsive Design** — Works on mobile, tablet, and desktop
- **Clean Typography** — Professional font hierarchy
- **Visual Distinction:**
  - Original Articles: Blue badge and blue accent border
  - Updated Articles: Green badge and green accent border
- **Loading States** — Animated spinner during data fetch
- **Error Handling** — Friendly error messages when API fails

## Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## License

This project is provided for evaluation purposes as part of an internship assignment.
