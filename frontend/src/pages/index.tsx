"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Mountain, Activity, TrendingUp, Users } from "lucide-react"

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-glacier-50 to-glacier-100 transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}
    >
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
              Monitor Glaciers with
              <span className="text-glacier-600 block">AI-Powered Precision</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-slide-up">
              Advanced satellite imagery analysis and machine learning to track glacier health, predict changes, and
              support climate research worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link
                href="/dashboard"
                className="bg-glacier-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-glacier-700 transition-colors duration-200 flex items-center justify-center"
              >
                View Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/upload"
                className="border-2 border-glacier-600 text-glacier-600 px-8 py-3 rounded-lg font-semibold hover:bg-glacier-50 transition-colors duration-200"
              >
                Upload Images
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Comprehensive Glacier Analysis</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with satellite data to provide unprecedented insights into glacier
              dynamics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="bg-glacier-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mountain className="h-8 w-8 text-glacier-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Monitoring</h3>
              <p className="text-gray-600">
                Continuous tracking of glacier movement, thickness, and health indicators.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="bg-glacier-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="h-8 w-8 text-glacier-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Analysis</h3>
              <p className="text-gray-600">Machine learning algorithms detect changes and predict future trends.</p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="bg-glacier-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-glacier-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Trend Analysis</h3>
              <p className="text-gray-600">
                Historical data visualization and predictive modeling for climate research.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="bg-glacier-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-glacier-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Collaboration</h3>
              <p className="text-gray-600">Share findings with researchers and contribute to global climate studies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-glacier-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1,200+</div>
              <div className="text-glacier-100">Glaciers Monitored</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50TB+</div>
              <div className="text-glacier-100">Satellite Data Processed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-glacier-100">Prediction Accuracy</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Ready to Start Monitoring?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join researchers worldwide in tracking glacier changes and contributing to climate science.
          </p>
          <Link
            href="/dashboard"
            className="bg-glacier-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-glacier-700 transition-colors duration-200 inline-flex items-center"
          >
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
