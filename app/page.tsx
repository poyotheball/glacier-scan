import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BarChart3, Globe, Upload, Zap, Eye, Users } from "lucide-react"

export default function GlacierScanLanding() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <div className="text-xl font-bold text-gray-900">Logo</div>
        <div className="hidden md:flex items-center space-x-8">
          <Link href="#" className="text-blue-600 hover:text-blue-700">
            Home
          </Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900">
            About Us
          </Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900">
            Contact Us
          </Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900">
            Resources
          </Link>
          <Button variant="outline" size="sm">
            Demo
          </Button>
          <Button size="sm" className="bg-gray-900 hover:bg-gray-800">
            Sign Up
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gray-700 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Unlock the Secrets of Glacier Change</h1>
              <p className="text-lg mb-8 text-gray-200">
                Discover how our advanced technology can help you analyze glacier movements and transformations over
                time. Start your journey into glacier analysis today and contribute to climate research.
              </p>
              <div className="flex gap-4">
                <Link href="/upload">
                  <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                    Start
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-gray-900 bg-transparent"
                >
                  Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-64 bg-gray-600 rounded-lg flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-500 rounded-lg flex items-center justify-center">
                  <Globe className="w-8 h-8 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-100">Analyze</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Discover the Secrets of Glaciers</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Glacier Scan utilizes advanced AI technology to analyze satellite images for glacier detection. Our
            intuitive platform allows researchers to easily compare historical and current glacier data.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-full h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <Upload className="w-12 h-12 text-gray-400" />
                </div>
                <CardTitle className="text-xl">How Glacier Scan Works</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Upload satellite images and let our AI do the rest.</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-full h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <BarChart3 className="w-12 h-12 text-gray-400" />
                </div>
                <CardTitle className="text-xl">Understand Glacier Changes Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Get insights into melting rates and volume loss.</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-full h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <Eye className="w-12 h-12 text-gray-400" />
                </div>
                <CardTitle className="text-xl">Visualize Your Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>View detailed maps and statistics at a glance.</CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 flex justify-center gap-4">
            <Link href="/upload">
              <Button size="lg" variant="outline">
                Start
              </Button>
            </Link>
            <Button size="lg" variant="ghost" className="text-blue-600 hover:text-blue-700">
              Demo <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">Explore</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Experience Glacier Analysis Like Never Before
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our innovative app simplifies glacier analysis with state-of-the-art technology. Dive into your research
                with just a few clicks.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <BarChart3 className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Instantly analyze and visualize glacier changes over time.
                    </h3>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Zap className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Get accurate results with advanced AI detection.
                    </h3>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Join researchers worldwide in glacier monitoring efforts.
                    </h3>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Button size="lg">Demo</Button>
                <Button size="lg" variant="ghost" className="text-blue-600 hover:text-blue-700">
                  Learn More <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                  <Globe className="w-8 h-8 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Unlock the power of glacier analysis with Glacier Scan today!
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Easily upload your satellite images and let our AI do the rest. Discover critical insights about glacier
                changes over time.
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <ArrowRight className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Get Started</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Begin your analysis by clicking the button below to upload your images.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <BarChart3 className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Why Choose Us</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Experience cutting-edge technology for accurate and efficient glacier monitoring.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                  <Globe className="w-8 h-8 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-2xl font-bold mb-4">Glacier Scan</div>
          <p className="text-gray-400 mb-8">Advanced AI-powered glacier analysis for climate research</p>
          <div className="flex justify-center gap-4">
            <Link href="/upload">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Get Started Today
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
