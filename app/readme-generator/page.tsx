"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Copy } from "lucide-react"
import Navigation from "@/components/navigation"

export default function ReadmeGeneratorPage() {
  const [readmeRepo, setReadmeRepo] = useState("")
  const [generatedReadme, setGeneratedReadme] = useState("")

  const generateReadme = () => {
    if (!readmeRepo) return

    const template = `# ${readmeRepo}

## 📋 Description
A brief description of what this project does and who it's for.

## 🚀 Features
- Feature 1
- Feature 2  
- Feature 3

## 🛠️ Installation

\`\`\`bash
git clone https://github.com/username/${readmeRepo}.git
cd ${readmeRepo}
npm install
\`\`\`

## 💻 Usage

\`\`\`bash
npm start
\`\`\`

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.

## 👨‍💻 Author
Your Name - [@yourusername](https://github.com/yourusername)
`
    setGeneratedReadme(template)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-2 sm:p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto backdrop-blur-xl bg-gray-900/80 border-4 border-white rounded-3xl shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] overflow-hidden">
        <Navigation currentPage="README GENERATOR" />

        <div className="p-4 sm:p-6 space-y-6">
          <Card className="bg-gray-800/50 border-4 border-white rounded-xl shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
            <CardHeader>
              <CardTitle className="text-white font-black text-xl">README GENERATOR</CardTitle>
              <CardDescription className="text-gray-300 font-bold">
                Generate a professional README template for your repository
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter repository name"
                  value={readmeRepo}
                  onChange={(e) => setReadmeRepo(e.target.value)}
                  className="bg-black/50 border-2 border-white rounded-xl text-white placeholder:text-gray-400 font-bold"
                />
                <Button
                  onClick={generateReadme}
                  className="bg-white hover:bg-gray-200 text-black rounded-xl border-2 border-white font-bold shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]"
                >
                  Generate
                </Button>
              </div>
            </CardContent>
          </Card>

          {generatedReadme && (
            <Card className="bg-gray-800/50 border-4 border-white rounded-xl shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <CardHeader>
                <CardTitle className="text-white font-black flex items-center justify-between">
                  GENERATED README
                  <Button
                    onClick={() => copyToClipboard(generatedReadme)}
                    size="sm"
                    className="bg-white hover:bg-gray-200 text-black rounded-xl border-2 border-white font-bold"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={generatedReadme}
                  onChange={(e) => setGeneratedReadme(e.target.value)}
                  className="min-h-[400px] bg-black/50 border-2 border-white rounded-xl text-white font-mono text-sm"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
