# BeyondChats Frontend

A professional React application for viewing and browsing BeyondChats articles, with clear distinction between original and AI-enhanced (updated) articles.

## 📋 Project Overview

This frontend application connects to the BeyondChats backend API to display:
- **Original Articles** - Scraped directly from BeyondChats blog
- **Updated Articles** - AI-enhanced versions with improved structure and SEO

The UI provides a clean, responsive interface with filtering capabilities and detailed article views.

## 🛠️ Tech Stack

- **Framework:** React 19 (Vite)
- **Language:** JavaScript
- **Styling:** Tailwind CSS v4
- **Routing:** React Router DOM v7
- **HTTP Client:** Axios
- **Build Tool:** Vite

## 📁 Project Structure

```
beyondchats-frontend/
│
├── src/
│   ├── api/
│   │   └── articles.js          # API layer with Axios
│   ├── components/
│   │   ├── ArticleCard.jsx      # Article card component
│   │   └── Navbar.jsx           # Navigation bar
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

## 🚀 Local Setup

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- BeyondChats backend running on http://localhost:5000

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
   
   The default `.env` is pre-configured. To change the API URL:
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

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000/api` |

## 📱 Screens

### Home Page (/)

- Displays all articles in a responsive card grid
- Filter buttons to show:
  - **All** articles
  - **Original** articles only (isUpdated = false)
  - **Updated** articles only (isUpdated = true)
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
- **References section** at bottom (for updated articles)
  - Each reference is a clickable external link
- Back navigation to home

## 🎨 Design Features

- **Responsive Design** - Works on mobile, tablet, and desktop
- **Clean Typography** - Professional font hierarchy
- **Visual Distinction:**
  - Original articles: Blue badge and blue accent border
  - Updated articles: Green badge and green accent border
- **Loading States** - Animated spinner during data fetch
- **Error Handling** - Friendly error messages when API fails

## 📦 Available Scripts

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

## 📝 License

ISC
