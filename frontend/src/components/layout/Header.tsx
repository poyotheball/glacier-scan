"use client"

import Link from "next/link"
import { useTranslation } from "next-i18next"
import { useAuth } from "@/components/auth/AuthProvider"

const Header = () => {
  const { t } = useTranslation("common")
  const { user, signOut } = useAuth()

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            {t("title")}
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-blue-200">
              {t("navigation.home")}
            </Link>
            <Link href="/map" className="hover:text-blue-200">
              {t("navigation.map")}
            </Link>
            <Link href="/upload" className="hover:text-blue-200">
              {t("navigation.upload")}
            </Link>
            <Link href="/dashboard" className="hover:text-blue-200">
              {t("navigation.dashboard")}
            </Link>
            <Link href="/trends" className="hover:text-blue-200">
              Trends
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">Welcome, {user.email}</span>
                <button onClick={() => signOut()} className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded text-sm">
                  Sign Out
                </button>
              </div>
            ) : (
              <Link href="/auth" className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded text-sm">
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
