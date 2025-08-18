import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Code, FileText, HelpCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-2 sm:p-4 md:p-8">
      {/* Main container with neobrutalist dark styling */}
      <div className="w-full max-w-6xl mx-auto backdrop-blur-xl bg-gray-900/80 border-4 border-white rounded-3xl shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] overflow-hidden">
        {/* Header */}
        <header className="border-b-4 border-white p-4 sm:p-6 bg-black/60 backdrop-blur-md">
          <div className="flex items-center justify-center gap-4">
            <Github className="h-8 w-8 text-white" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">GITHUB STATS</h1>
          </div>
          <p className="text-center text-gray-300 font-bold mt-2">
            Analyze repositories and generate professional READMEs
          </p>
        </header>

        {/* Main content */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Repository Stats Card */}
            <Card className="bg-gray-800/50 border-4 border-white rounded-xl shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all">
              <CardHeader>
                <CardTitle className="text-white font-black text-xl flex items-center gap-2">
                  <Code className="h-6 w-6" />
                  REPO STATS
                </CardTitle>
                <CardDescription className="text-gray-300 font-bold">
                  Analyze any public GitHub repository and view detailed statistics including stars, forks, and more.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/stats">
                  <Button className="w-full bg-white hover:bg-gray-200 text-black rounded-xl border-2 border-white font-bold shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] group">
                    Analyze Repository
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* README Generator Card */}
            <Card className="bg-gray-800/50 border-4 border-white rounded-xl shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all">
              <CardHeader>
                <CardTitle className="text-white font-black text-xl flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  README GENERATOR
                </CardTitle>
                <CardDescription className="text-gray-300 font-bold">
                  Create professional README templates with industry-standard sections and formatting.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/readme-generator">
                  <Button className="w-full bg-white hover:bg-gray-200 text-black rounded-xl border-2 border-white font-bold shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] group">
                    Generate README
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Instructions Card */}
            <Card className="bg-gray-800/50 border-4 border-white rounded-xl shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all">
              <CardHeader>
                <CardTitle className="text-white font-black text-xl flex items-center gap-2">
                  <HelpCircle className="h-6 w-6" />
                  Github User Stalker
                </CardTitle>
                <CardDescription className="text-gray-300 font-bold">
                  Get to know the user through and through.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/userProfileAnalyzer">
                  <Button className="w-full bg-white hover:bg-gray-200 text-black rounded-xl border-2 border-white font-bold shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] group">
                    Get to Know the Github User
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Features Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-black text-white mb-6 text-center">FEATURES</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-black/50 p-4 rounded-xl border-2 border-white">
                <h3 className="font-black text-white mb-2">Real-time Stats</h3>
                <p className="text-gray-300 font-bold text-sm">Fetch live data directly from GitHub's API</p>
              </div>
              <div className="bg-black/50 p-4 rounded-xl border-2 border-white">
                <h3 className="font-black text-white mb-2">Professional Templates</h3>
                <p className="text-gray-300 font-bold text-sm">Generate industry-standard README files</p>
              </div>
              <div className="bg-black/50 p-4 rounded-xl border-2 border-white">
                <h3 className="font-black text-white mb-2">Easy Copy & Paste</h3>
                <p className="text-gray-300 font-bold text-sm">One-click copying to your clipboard</p>
              </div>
              <div className="bg-black/50 p-4 rounded-xl border-2 border-white">
                <h3 className="font-black text-white mb-2">Dark Theme</h3>
                <p className="text-gray-300 font-bold text-sm">Neobrutalist design optimized for developers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
