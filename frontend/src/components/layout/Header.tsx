import Link from "next/link"

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-blue-600">
              GlacierScan
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              <Link href="/map" className="text-gray-600 hover:text-blue-600 transition-colors">
                Map
              </Link>
              <Link href="/trends" className="text-gray-600 hover:text-blue-600 transition-colors">
                Trends
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/auth"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
