"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Loader2, Github, Key } from "lucide-react"
import Navigation from "@/components/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import 'github-markdown-css/github-markdown.css';

interface RepoData {
  name: string
  description: string
  language: string
  topics: string[]
  license: any
  clone_url: string
  html_url: string
  owner: {
    login: string
  }
}

interface FileData {
  name: string
  content: string
}

export default function ReadmeGeneratorPage() {
  const [repoUrl, setRepoUrl] = useState("")
  const [githubToken, setGithubToken] = useState("")
  const [generatedReadme, setGeneratedReadme] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showApiKeys, setShowApiKeys] = useState(false)
  

  const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY 

  const parseGithubUrl = (url: string) => {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    if (match) {
      return { owner: match[1], repo: match[2].replace('.git', '') }
    }
    return null
  }

  const fetchGithubRepo = async (owner: string, repo: string): Promise<RepoData> => {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    }
    
    if (githubToken) {
      headers['Authorization'] = `token ${githubToken}`
    }

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers
    })
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`)
    }
    
    return await response.json()
  }

  const fetchRepoFiles = async (owner: string, repo: string): Promise<FileData[]> => {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    }
    
    if (githubToken) {
      headers['Authorization'] = `token ${githubToken}`
    }

    try {
      // Get repository contents
      const contentsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, {
        headers
      })
      
      if (!contentsResponse.ok) {
        throw new Error(`GitHub API error: ${contentsResponse.statusText}`)
      }
      
      const contents = await contentsResponse.json()
      const files: FileData[] = []
      
      // Look for important files
      const importantFiles = ['package.json', 'requirements.txt', 'Cargo.toml', 'go.mod', 'pom.xml', 'composer.json', 'Gemfile']
      
      for (const item of contents) {
        if (importantFiles.includes(item.name) && item.type === 'file') {
          try {
            const fileResponse = await fetch(item.download_url)
            const fileContent = await fileResponse.text()
            files.push({ name: item.name, content: fileContent })
          } catch (error) {
            console.warn(`Failed to fetch ${item.name}:`, error)
          }
        }
      }
      
      return files
    } catch (error) {
      console.warn('Failed to fetch repository files:', error)
      return []
    }
  }

  const generateReadmeWithGemini = async (repoData: RepoData, files: FileData[]): Promise<string> => {
    const filesInfo = files.map(f => `${f.name}:\n${f.content.slice(0, 1000)}`).join('\n\n')
    
    const prompt = `Generate a comprehensive README.md file for this GitHub repository:

Repository Information:
- Name: ${repoData.name}
- Description: ${repoData.description || 'No description provided'}
- Primary Language: ${repoData.language || 'Not specified'}
- Topics/Tags: ${repoData.topics?.join(', ') || 'None'}
- License: ${repoData.license?.name || 'Not specified'}
- Owner: ${repoData.owner.login}

Repository Files Analysis:
${filesInfo}

Please generate a professional README.md that includes:
1. Project title and description
2. Features (inferred from the code/dependencies)
3. Installation instructions (based on the project type)
4. Usage examples
5. API documentation (if applicable)
6. Contributing guidelines
7. License information
8. Contact/author information

Make the README informative, well-structured, and include appropriate badges and formatting. Use markdown syntax and be specific about the technologies used based on the files provided.
do not write markdown at the start of the file, just write the content directly.`

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('No content generated by Gemini API')
    }
    
    return data.candidates[0].content.parts[0].text
  }

  const generateReadme = async () => {
    if (!repoUrl) {
      alert('Please provide repository URL')
      return
    }

    if (!geminiApiKey) {
      alert('No api key provided for Gemini')
      return
    }

    const parsed = parseGithubUrl(repoUrl)
    if (!parsed) {
      alert('Invalid GitHub URL format')
      return
    }

    setIsGenerating(true)
    
    try {
      // Fetch repository data
      const repoData = await fetchGithubRepo(parsed.owner, parsed.repo)
      
      // Fetch repository files
      const files = await fetchRepoFiles(parsed.owner, parsed.repo)
      
      // Generate README with Gemini
      const readme = await generateReadmeWithGemini(repoData, files)
      
      setGeneratedReadme(readme)
    } catch (error) {
      console.error('Error generating README:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`)
    } finally {
      setIsGenerating(false)
    }
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
          <Card className="bg-gray-800/50 border-4 border-white rounded-xl shadow">
            <CardHeader>
              <CardTitle className="text-white font-black text-xl flex items-center gap-2">
                <Github className="h-6 w-6" />
                AI-Powered README GENERATOR
              </CardTitle>
              <CardDescription className="text-gray-300 font-bold">
                Generate README using GitHub API + Gemini AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter GitHub repository URL (e.g., https://github.com/user/repo)"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="bg-black/50 border-2 border-white rounded-xl text-white placeholder:text-gray-400 font-bold"
                />
                <Button
                  onClick={() => setShowApiKeys(!showApiKeys)}
                  variant="outline"
                  className="bg-gray-700 hover:bg-gray-600 text-white rounded-xl border-2 border-white font-bold"
                >
                  <Key className="h-4 w-4" />
                </Button>
              </div>

              {showApiKeys && (
                <div className="space-y-3 p-4 bg-black/30 rounded-xl border border-white/20">
                  <div>
                    <label className="text-white font-bold text-sm mb-1 block">
                      GitHub Token (Optional - for private repos/higher rate limits)
                    </label>
                    <Input
                      type="password"
                      placeholder="ghp_..."
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                      className="bg-black/50 border-2 border-white rounded-xl text-white placeholder:text-gray-400 font-bold"
                    />
                  </div>
                  <p className="text-gray-400 text-xs">
                     GitHub token is optional but recommended for better rate limits.
                  </p>
                </div>
              )}

              <Button
                onClick={generateReadme}
                disabled={isGenerating || !repoUrl}
                className="w-full bg-white hover:bg-gray-200 text-black rounded-xl border-2 border-white font-bold shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing Repository & Generating...
                  </>
                ) : (
                  <>
                    <Github className="h-4 w-4 mr-2" />
                    Generate AI README
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {generatedReadme && (
            <>
              {/* Editable Markdown Source */}
              <Card className="bg-gray-800/50 border-4 border-white rounded-xl shadow">
                <CardHeader>
                  <CardTitle className="text-white font-black flex items-center justify-between">
                    Generated README (Markdown)
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

              {/* Live GitHub-Style Preview */}
              <Card className="bg-gray-800/50 border-4 border-white rounded-xl shadow">
                <CardHeader>
                  <CardTitle className="text-white font-black">Live Preview</CardTitle>
                </CardHeader>
                <CardContent className="markdown-body">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {generatedReadme}
                  </ReactMarkdown>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}