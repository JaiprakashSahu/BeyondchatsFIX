import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getArticleById } from '../api/articles'

function ArticleDetail() {
    const { id } = useParams()
    const [article, setArticle] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true)
                const data = await getArticleById(id)
                setArticle(data)
                setError(null)
            } catch (err) {
                setError('Failed to load article')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchArticle()
    }, [id])

    const renderContent = (content) => {
        if (!content) return null

        const paragraphs = content.split('\n\n').filter(p => p.trim())

        return paragraphs.map((para, idx) => {
            const trimmed = para.trim()

            if (trimmed.startsWith('## ')) {
                return (
                    <h2 key={idx} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                        {trimmed.replace('## ', '')}
                    </h2>
                )
            }

            if (trimmed.startsWith('### ')) {
                return (
                    <h3 key={idx} className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                        {trimmed.replace('### ', '')}
                    </h3>
                )
            }

            if (trimmed.startsWith('#### ')) {
                return (
                    <h4 key={idx} className="text-lg font-semibold text-gray-700 mt-4 mb-2">
                        {trimmed.replace('#### ', '')}
                    </h4>
                )
            }

            if (trimmed.startsWith('References:') || trimmed.startsWith('## References')) {
                return null
            }

            if (trimmed.match(/^\d+\.\s*https?:\/\//)) {
                return null
            }

            const lines = trimmed.split('\n')
            const isList = lines.every(line =>
                line.trim().startsWith('•') ||
                line.trim().startsWith('-') ||
                /^\d+\./.test(line.trim())
            )

            if (isList) {
                return (
                    <ul key={idx} className="list-disc list-inside space-y-2 mb-4 text-gray-700">
                        {lines.map((line, lineIdx) => (
                            <li key={lineIdx}>
                                {line.replace(/^[•\-]\s*/, '').replace(/^\d+\.\s*/, '')}
                            </li>
                        ))}
                    </ul>
                )
            }

            return (
                <p key={idx} className="text-gray-700 leading-relaxed mb-4">
                    {trimmed}
                </p>
            )
        })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading article...</p>
                </div>
            </div>
        )
    }

    if (error || !article) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Article Not Found</h3>
                    <p className="text-gray-500 mb-4">{error || 'The article you are looking for does not exist.'}</p>
                    <Link to="/" className="text-blue-600 hover:underline font-medium">
                        ← Back to Articles
                    </Link>
                </div>
            </div>
        )
    }

    const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    return (
        <div className="max-w-3xl mx-auto">
            <Link
                to="/"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Articles
            </Link>

            <article className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8">
                    <span
                        className={`inline-block mb-4 px-3 py-1 rounded-full text-sm font-semibold ${article.isUpdated
                                ? 'bg-green-100 text-green-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                    >
                        {article.isUpdated ? 'AI-Enhanced Article' : 'Original Article'}
                    </span>

                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-gray-500 text-sm">{formattedDate}</span>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-8 leading-tight">
                        {article.title}
                    </h1>

                    <div className="prose max-w-none">
                        {renderContent(article.content)}
                    </div>

                    {article.references && article.references.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">References</h3>
                            <ul className="space-y-2">
                                {article.references.map((ref, index) => (
                                    <li key={index}>
                                        <a
                                            href={ref}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                                        >
                                            {index + 1}. {ref}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </article>
        </div>
    )
}

export default ArticleDetail
