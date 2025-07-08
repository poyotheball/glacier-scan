"use client"

import Link from "next/link"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Mountain, BarChart3, Map, Upload, Settings, Bell } from "lucide-react"

export default function Header() {
  const router = useRouter()

  const navigation = [
    { name: "Home", href: "/", icon: Mountain },
    { name: "Upload", href: "/upload", icon: Upload },
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Map", href: "/map", icon: Map },
    { name: "Trends", href: "/trends", icon: BarChart3 },
  ]

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Mountain className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">GlacierScan</span>
            </Link>
          </div>

          {/* Navigation */}
          <NavigationMenu>
            <NavigationMenuList>
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <NavigationMenuItem key={item.name}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={`
                          flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                          ${
                            router.pathname === item.href
                              ? "bg-blue-100 text-blue-700"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                          }
                        `}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )
              })}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
