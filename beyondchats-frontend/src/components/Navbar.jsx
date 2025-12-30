import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">BC</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">BeyondChats</span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/"
                            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                        >
                            Articles
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
