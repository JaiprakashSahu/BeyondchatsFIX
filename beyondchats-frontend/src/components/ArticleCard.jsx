import { Link } from 'react-router-dom'

function ArticleCard({ article }) {
    const { _id, title, content, isUpdated, createdAt, articleNumber } = article

    const contentPreview = content
        ? content.replace(/[#*\-_]/g, '').substring(0, 150) + '...'
        : 'No content available'

    const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })

    return (
        <Link to={`/article/${_id}`} className="block group">
            <article
                className={`bg-white rounded-xl shadow-sm border-2 p-6 h-full transition-all duration-200 hover:shadow-md ${isUpdated === true
                    ? 'border-emerald-200 hover:border-emerald-400'
                    : 'border-gray-200 hover:border-blue-400'
                    }`}
            >
                <div className="flex items-center gap-2 mb-3">
                    {articleNumber && (
                        <span className="w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">
                            #{articleNumber}
                        </span>
                    )}
                    <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${isUpdated === true
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-blue-100 text-blue-700'
                            }`}
                    >
                        {isUpdated === true ? 'Updated Article' : 'Original Article'}
                    </span>
                </div>

                <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {title}
                </h2>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {contentPreview}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500">{formattedDate}</span>
                    <span className="text-blue-600 text-sm font-medium group-hover:underline">
                        Read more →
                    </span>
                </div>
            </article>
        </Link>
    )
}

export default ArticleCard
