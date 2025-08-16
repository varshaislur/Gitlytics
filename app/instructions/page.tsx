import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, FileText } from "lucide-react"
import Navigation from "@/components/navigation"

export default function InstructionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-2 sm:p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto backdrop-blur-xl bg-gray-900/80 border-4 border-white rounded-3xl shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] overflow-hidden">
        <Navigation currentPage="INSTRUCTIONS" />

        <div className="p-4 sm:p-6 space-y-6">
          <Card className="bg-gray-800/50 border-4 border-white rounded-xl shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
            <CardHeader>
              <CardTitle className="text-white font-black text-xl">HOW TO USE</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-white">
              <div>
                <h3 className="font-black text-lg mb-3 flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  REPOSITORY STATS
                </h3>
                <ul className="space-y-2 font-bold text-gray-300 ml-6">
                  <li>• Enter any public GitHub repository URL</li>
                  <li>• Click "Analyze" to fetch detailed statistics</li>
                  <li>• View stars, forks, watchers, and other metrics</li>
                  <li>• See repository information like language, size, and creation date</li>
                </ul>
              </div>

              <div>
                <h3 className="font-black text-lg mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  README GENERATOR
                </h3>
                <ul className="space-y-2 font-bold text-gray-300 ml-6">
                  <li>• Enter your repository name</li>
                  <li>• Click "Generate" to create a README template</li>
                  <li>• Edit the generated content as needed</li>
                  <li>• Copy the final README to your clipboard</li>
                  <li>• Paste it into your repository's README.md file</li>
                </ul>
              </div>

              <div>
                <h3 className="font-black text-lg mb-3">FEATURES</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-black/50 p-4 rounded-xl border-2 border-white">
                    <h4 className="font-black mb-2">Real-time Stats</h4>
                    <p className="text-gray-300 font-bold text-sm">Fetch live data directly from GitHub's API</p>
                  </div>
                  <div className="bg-black/50 p-4 rounded-xl border-2 border-white">
                    <h4 className="font-black mb-2">Professional Templates</h4>
                    <p className="text-gray-300 font-bold text-sm">Generate industry-standard README files</p>
                  </div>
                  <div className="bg-black/50 p-4 rounded-xl border-2 border-white">
                    <h4 className="font-black mb-2">Easy Copy & Paste</h4>
                    <p className="text-gray-300 font-bold text-sm">One-click copying to your clipboard</p>
                  </div>
                  <div className="bg-black/50 p-4 rounded-xl border-2 border-white">
                    <h4 className="font-black mb-2">Dark Theme</h4>
                    <p className="text-gray-300 font-bold text-sm">Neobrutalist design optimized for developers</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-black text-lg mb-3">TIPS & TRICKS</h3>
                <div className="bg-black/50 p-4 rounded-xl border-2 border-white">
                  <ul className="space-y-2 font-bold text-gray-300">
                    <li>• Use the full GitHub URL format: https://github.com/owner/repository</li>
                    <li>• Repository must be public to fetch statistics</li>
                    <li>• Generated README templates are fully customizable</li>
                    <li>• All data is fetched in real-time from GitHub's API</li>
                    <li>• Navigate between pages using the top navigation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
