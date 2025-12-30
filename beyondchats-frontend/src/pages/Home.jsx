import { useState, useEffect } from 'react'
import { getAllArticles } from '../api/articles'
import ArticleCard from '../components/ArticleCard'

function Home() {
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await getAllArticles()
                const normalizedData = data.map(article => ({
                    ...article,
                    isUpdated: article.isUpdated === true || article.isUpdated === 'true'
                }))

                // Get all original articles sorted by createdAt (oldest first)
                const allOriginals = normalizedData
                    .filter(a => a.isUpdated === false)
                    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

                // Take only the 5 oldest original articles (Phase 1 scope)
                const phase1Originals = allOriginals.slice(0, 5)

                // Assign article numbers to originals and build sourceUrl mapping
                const sourceUrlToNumber = {}
                const numberedOriginals = phase1Originals.map((article, index) => {
                    const articleNumber = index + 1
                    const baseUrl = article.sourceUrl.replace(/#rewritten.*$/, '')
                    sourceUrlToNumber[baseUrl] = articleNumber
                    return { ...article, articleNumber }
                })

                // Get sourceUrl base patterns from Phase 1 originals
                const phase1SourceUrls = Object.keys(sourceUrlToNumber)

                // Find updated articles that correspond to Phase 1 originals and assign same numbers
                const numberedUpdated = normalizedData
                    .filter(a => {
                        if (a.isUpdated !== true) return false
                        const baseUrl = a.sourceUrl.replace(/#rewritten.*$/, '')
                        return phase1SourceUrls.includes(baseUrl)
                    })
                    .map(article => {
                        const baseUrl = article.sourceUrl.replace(/#rewritten.*$/, '')
                        const articleNumber = sourceUrlToNumber[baseUrl] || 0
                        return { ...article, articleNumber }
                    })

                // Combine Phase 1 originals and their updated versions
                const scopedArticles = [...numberedOriginals, ...numberedUpdated]

                setArticles(scopedArticles)
                console.log(`✅ Loaded ${scopedArticles.length} articles successfully`)
            } catch (err) {
                console.error('❌ Fetch error details:', err)

                let errorMessage = 'Failed to load articles. Please try again later.'

                if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
                    errorMessage = 'Cannot connect to backend. The server may be starting up (cold start). Please wait 30 seconds and refresh.'
                } else if (err.code === 'ECONNABORTED') {
                    errorMessage = 'Request timed out. The backend may be waking up. Please try again in a moment.'
                } else if (err.response?.status === 404) {
                    errorMessage = 'API endpoint not found. Please check the backend configuration.'
                } else if (err.response?.status >= 500) {
                    errorMessage = 'Server error. Please try again later.'
                } else if (err.response?.data?.message) {
                    errorMessage = err.response.data.message
                }

                setError(errorMessage)
            } finally {
                setLoading(false)
            }
        }

        fetchArticles()
    }, [])

    const originalArticles = articles.filter((article) => article.isUpdated === false)
    const updatedArticles = articles.filter((article) => article.isUpdated === true)

    const filteredArticles = articles.filter((article) => {
        if (filter === 'original') return article.isUpdated === false
        if (filter === 'updated') return article.isUpdated === true
        return true
    })

    const originalCount = originalArticles.length
    const updatedCount = updatedArticles.length

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading articles...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center bg-red-50 border border-red-200 rounded-xl p-8 max-w-md">
                    <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Connection Error</h3>
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Articles</h1>
                <p className="text-gray-600">
                    Browse our collection of {articles.length} articles
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-8">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'all'
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                >
                    All ({articles.length})
                </button>
                <button
                    onClick={() => setFilter('original')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'original'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                >
                    Original ({originalCount})
                </button>
                <button
                    onClick={() => setFilter('updated')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'updated'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                >
                    Updated ({updatedCount})
                </button>
            </div>

            {filteredArticles.length === 0 ? (
                <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500">No articles found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.map((article) => (
                        <ArticleCard key={article._id} article={article} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Home
