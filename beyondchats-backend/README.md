# BeyondChats Backend

A Node.js + Express backend that scrapes articles from the BeyondChats blog, enhances them using AI, and provides full CRUD REST APIs for article management.

## Live Deployment

- **Backend API (Render):** https://beyondchats-yt9u.onrender.com
- **API Endpoint:** https://beyondchats-yt9u.onrender.com/api/articles
- **Health Check:** https://beyondchats-yt9u.onrender.com/

The backend is stateless and frontend-agnostic. CORS is enabled to allow requests from any origin, including the deployed Vercel frontend.

## Project Overview

This project implements **Phase 1** and **Phase 2** of the assignment:

| Phase | Description | Implementation |
|-------|-------------|----------------|
| **Phase 1** | **Scraping + CRUD APIs** | Scrapes the 5 oldest articles from BeyondChats blog, stores in MongoDB, exposes REST API |
| **Phase 2** | **Google Search + LLM Rewriting** | Searches Google for related content, scrapes references, rewrites articles using Groq LLM |
| Phase 3 | React Frontend UI | See frontend repository |

### Terminology

- **Original Articles** (`isUpdated = false`) — Scraped directly from BeyondChats blog
- **Updated Articles** / **AI-Enhanced Articles** (`isUpdated = true`) — Rewritten versions with improved structure and SEO

There is a one-to-one mapping between original and updated articles. Phase 2 creates new Updated Articles without overwriting the originals.

## Architecture / Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     Phase 1: Scraper                            │
│              Runs on server startup or via API                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Scrapes 5 oldest articles
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MongoDB (Atlas)                            │
│                    Articles Collection                          │
│     Original Articles (isUpdated=false)                         │
│     Updated Articles (isUpdated=true)                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
        ▼                                     ▼
┌───────────────────┐               ┌─────────────────────────────┐
│   Phase 2 Script  │               │    REST API (Express)       │
│   runPhase2.js    │───POST───────▶│    /api/articles            │
│                   │               │    Serves Frontend          │
└───────────────────┘               └─────────────────────────────┘
        │                                     ▲
        │ Google Search (Serper)              │ HTTP GET
        │ LLM Rewrite (Groq)                  │
        ▼                                     │
┌───────────────────┐               ┌─────────────────────────────┐
│ External Sources  │               │   Frontend (React/Vercel)   │
└───────────────────┘               └─────────────────────────────┘
```

## How Frontend Consumes This API

The frontend (deployed on Vercel) interacts with this backend as follows:

1. **Fetch All Articles:** `GET /api/articles`
   - Returns both Original and Updated articles
   - Frontend filters by `isUpdated` field

2. **Fetch Single Article:** `GET /api/articles/:id`
   - Returns full article content including references

3. **Filtering Logic:**
   - `isUpdated = false` → Original Articles
   - `isUpdated = true` → Updated Articles (AI-Enhanced)

4. **References Display:**
   - Updated articles include a `references` array
   - Frontend renders these as clickable external links

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **HTTP Client:** Axios
- **HTML Parser:** Cheerio
- **Environment:** dotenv
- **Security:** CORS (enabled for all origins)
- **Search API:** Serper.dev (Google Search)
- **AI/LLM:** Groq (Llama 3.1 8B)

## Project Structure

```
beyondchats-backend/
│
├── src/
│   ├── app.js                 # Express server entry point
│   ├── config/
│   │   └── db.js              # MongoDB connection configuration
│   ├── models/
│   │   └── Article.js         # Mongoose Article schema
│   ├── controllers/
│   │   └── articleController.js  # CRUD controller logic
│   ├── routes/
│   │   └── articleRoutes.js   # API route definitions
│   ├── scraper/
│   │   └── scrapeBeyondChats.js  # Blog scraper module (Phase 1)
│   └── phase2/
│       ├── googleSearch.js       # Google search via Serper API
│       ├── scrapeExternalArticle.js  # External article scraper
│       ├── rewriteWithLLM.js     # Groq LLM rewriting (LLaMA 3.1 8B)
│       └── runPhase2.js          # Phase 2 runner script
│
├── .env                       # Environment variables (excluded from git)
├── .env.example               # Example environment file
├── .gitignore                 # Git ignore rules
├── package.json               # Dependencies and scripts
└── README.md                  # Documentation
```

## Local Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation Steps

1. **Navigate to the project:**
   ```bash
   cd beyondchats-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Create a `.env` file with your settings:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/beyondchats
   ```
   
   For MongoDB Atlas:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/beyondchats
   ```

4. **Start the server:**
   
   Development mode (with hot reload):
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

5. **The scraper automatically runs on server startup** and fetches the 5 oldest articles from BeyondChats blog.

## Environment Variables

| Variable | Description | Required For |
|----------|-------------|--------------|
| `PORT` | Server port number (default: 5000) | Phase 1 |
| `MONGODB_URI` | MongoDB connection string | Phase 1는 |
| `GOOGLE_SEARCH_API_KEY` | Serper.dev API key | Phase 2 |
| `GROQ_API_KEY` | Groq API key | Phase 2 |
| `BACKEND_API_BASE_URL` | API base URL (default: http://localhost:5000/api) | Phase 2 |

### Getting API Keys

1. **Serper.dev (Google Search):** Sign up at [https://serper.dev/](https://serper.dev/)
2. **Groq:** Get your API key from [https://console.groq.com/keys](https://console.groq.com/keys)

## API Endpoints

### Articles

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/articles` | Create a new article |
| `GET` | `/api/articles` | Get all articles |
| `GET` | `/api/articles/:id` | Get article by ID |
| `PUT` | `/api/articles/:id` | Update article by ID |
| `DELETE` | `/api/articles/:id` | Delete article by ID |

### Utility

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check / API info |
| `POST` | `/api/scrape` | Manually trigger the scraper |

### Example Requests

**Create Article:**
```bash
curl -X POST http://localhost:5000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sample Article",
    "content": "This is the article content...",
    "sourceUrl": "https://example.com/article",
    "references": ["https://ref1.com", "https://ref2.com"]
  }'
```

**Get All Articles:**
```bash
curl http://localhost:5000/api/articles
```

**Get Article by ID:**
```bash
curl http://localhost:5000/api/articles/<article_id>
```

**Update Article:**
```bash
curl -X PUT http://localhost:5000/api/articles/<article_id> \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "content": "Updated content..."
  }'
```

**Delete Article:**
```bash
curl -X DELETE http://localhost:5000/api/articles/<article_id>
```

## Scraper Logic (Phase 1)

The scraper (`scrapeBeyondChats.js`) performs the following:

1. **Fetch Blog Page:** Loads `https://beyondchats.com/blogs/`
2. **Detect Pagination:** Finds the last page number
3. **Navigate to Last Page:** Goes to the oldest articles (e.g., `/blogs/page/15/`)
4. **Collect Article URLs:** Extracts 5 article URLs, moving to previous pages if needed
5. **Check for Duplicates:** Skips articles that already exist (based on `sourceUrl`)
6. **Scrape Full Content:** Extracts title, body, and reference links from each article
7. **Save to Database:** Stores articles with `isUpdated = false`

The scraper runs automatically on server startup and can be triggered manually via `POST /api/scrape`.

## Database Schema

```javascript
Article {
  title: String (required),
  content: String (required),
  sourceUrl: String (required, unique),
  isUpdated: Boolean (default: false),
  references: [String] (default: []),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Phase 2: Article Enhancement Pipeline

Phase 2 enhances Original Articles by researching top-ranking content and using AI to rewrite them.

**Important:** Phase 2 does NOT overwrite originals. It creates new Updated Articles with `isUpdated = true`.

### Running Phase 2

1. **Ensure Phase 1 is complete** (Original Articles exist in MongoDB)

2. **Configure API keys** in your `.env` file:
   ```env
   GOOGLE_SEARCH_API_KEY=your_serper_api_key_here
   GROQ_API_KEY=your_groq_api_key_here
   BACKEND_API_BASE_URL=http://localhost:5000/api
   ```

3. **Start the server** (if not already running):
   ```bash
   npm run dev
   ```

4. **Run Phase 2 script:**
   ```bash
   node src/phase2/runPhase2.js
   ```

### Phase 2 Workflow

1. **Fetch Articles:** Gets all articles where `isUpdated = false`
2. **Google Search:** Searches for related content via Serper.dev API
3. **Filter Results:** Excludes beyondchats.com, social media, Wikipedia, and video platforms; selects top 2 valid URLs
4. **Scrape References:** Extracts main content from each reference article
5. **LLM Rewrite:** Sends to Groq Llama 3.1 8B for improved clarity, structure, and SEO
6. **Publish:** Creates new article via `POST /api/articles` with `isUpdated = true` and references

### Phase 2 Output

```
╔════════════════════════════════════════════════════════════╗
║           PHASE 2: Article Enhancement Pipeline            ║
╚════════════════════════════════════════════════════════════╝

Processing Article 1/5
   Title: Introduction to Chatbots
   
   Step 1: Search Google for related articles...
   Found 2 valid external URLs
   
   Step 2: Scraping external articles...
   Scraped 3500 characters
   
   Step 3: Rewriting with LLM...
   LLM rewrite complete
   
   Step 4: Publishing rewritten article...
   Successfully published with ID: 507f1f77bcf86cd799439011

╔════════════════════════════════════════════════════════════╗
║                    PHASE 2 COMPLETE                        ║
║   Succeeded: 5                                             ║
╚════════════════════════════════════════════════════════════╝
```

### Idempotency

Phase 2 enforces a one-to-one mapping between original and updated articles. Re-running the script does not create duplicate updated articles.

## Notes

- `.env` files are excluded from version control
- A duplicate index warning may appear during development; it does not affect functionality

## License

This project is provided for evaluation purposes as part of an internship assignment.
