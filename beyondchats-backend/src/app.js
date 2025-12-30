require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const articleRoutes = require('./routes/articleRoutes');
const scrapeBeyondChats = require('./scraper/scrapeBeyondChats');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration - Production-safe for Vercel + Render
const corsOptions = {
    origin: true, // Reflect request origin (allows all origins dynamically)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200, // For legacy browser support
};

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Apply CORS to all routes
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`📨 ${new Date().toISOString()} | ${req.method} ${req.url}`);
    next();
});

// Health check route - MUST be first
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'Backend running',
        message: 'BeyondChats Backend API is operational',
        version: '1.0.0',
        endpoints: {
            articles: '/api/articles',
            health: '/',
        },
    });
});

// API Routes
app.use('/api/articles', articleRoutes);

// Manual trigger for scraper (optional endpoint)
app.post('/api/scrape', async (req, res) => {
    try {
        console.log('🔄 Manual scrape triggered via API');
        const result = await scrapeBeyondChats();
        res.json({
            success: true,
            message: 'Scraping completed',
            data: result,
        });
    } catch (error) {
        console.error('Scrape error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Scraping failed',
            error: error.message,
        });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('💥 Server Error:', err.message);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
    });
});

// Start server
const startServer = async () => {
    console.log('\n🚀 Starting BeyondChats Backend...');
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);

    // Connect to MongoDB (non-blocking)
    const dbConnection = await connectDB();

    // Start Express server regardless of DB status
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`\n✅ Server running on port ${PORT}`);
        console.log(`📚 API endpoint: /api/articles`);
        console.log(`❤️ Health check: /`);
        console.log('━'.repeat(50));
    });

    // Auto-run scraper (non-blocking, won't crash server)
    if (dbConnection) {
        console.log('\n🔄 Auto-running scraper...');
        setTimeout(async () => {
            try {
                await scrapeBeyondChats();
                console.log('✅ Initial scraping completed');
            } catch (error) {
                console.error('⚠️ Initial scraping failed:', error.message);
                console.log('   Server continues running. Retry via POST /api/scrape');
            }
        }, 3000);
    } else {
        console.log('\n⚠️ Scraper skipped - no database connection');
    }
};

startServer().catch((error) => {
    console.error('❌ Server startup error:', error.message);
});
