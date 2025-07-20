"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, BarChart3, MapPin, Zap, Users, TrendingUp, Shield } from "lucide-react"

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-glacier-50 to-ice-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-glacier-600/20 to-glacier-800/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div
            className={`text-center transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Monitor Glaciers with
              <span className="block text-glacier-600">AI-Powered Precision</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Advanced satellite imagery analysis and machine learning algorithms provide real-time insights into
              glacier health, movement, and climate impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="btn-primary inline-flex items-center justify-center text-lg px-8 py-4">
                View Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/upload" className="btn-secondary inline-flex items-center justify-center text-lg px-8 py-4">
                Upload Images
                <BarChart3 className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Advanced Glacier Monitoring</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI technology with comprehensive data analysis to provide unprecedented
              insights into glacier dynamics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="h-8 w-8 text-glacier-600" />,
                title: "Real-time Analysis",
                description:
                  "Process satellite imagery and sensor data in real-time to detect changes in glacier structure and movement.",
              },
              {
                icon: <MapPin className="h-8 w-8 text-glacier-600" />,
                title: "Global Coverage",
                description: "Monitor glaciers worldwide with comprehensive mapping and location-based insights.",
              },
              {
                icon: <TrendingUp className="h-8 w-8 text-glacier-600" />,
                title: "Trend Prediction",
                description:
                  "Advanced algorithms predict future glacier behavior based on historical data and current conditions.",
              },
              {
                icon: <Shield className="h-8 w-8 text-glacier-600" />,
                title: "Risk Assessment",
                description: "Identify potential risks and provide early warning systems for glacier-related hazards.",
              },
              {
                icon: <BarChart3 className="h-8 w-8 text-glacier-600" />,
                title: "Data Visualization",
                description: "Interactive charts and graphs make complex glacier data easy to understand and analyze.",
              },
              {
                icon: <Users className="h-8 w-8 text-glacier-600" />,
                title: "Collaborative Platform",
                description: "Share findings with researchers, policymakers, and conservation organizations worldwide.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`glacier-card p-6 transition-all duration-500 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 glacier-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Global Impact</h2>
            <p className="text-xl text-glacier-100 max-w-3xl mx-auto">
              Our monitoring system tracks glaciers across the globe, providing critical data for climate research and
              environmental protection.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "15,000+", label: "Glaciers Monitored" },
              { number: "50+", label: "Countries Covered" },
              { number: "99.2%", label: "Accuracy Rate" },
              { number: "24/7", label: "Real-time Monitoring" },
            ].map((stat, index) => (
              <div
                key={index}
                className={`text-center transition-all duration-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-glacier-100 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Start Monitoring?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join researchers and organizations worldwide in tracking glacier changes and contributing to climate
            science.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-glacier-600 hover:bg-glacier-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center justify-center"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/map"
              className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center justify-center"
            >
              Explore Map
              <MapPin className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
