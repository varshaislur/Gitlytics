"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Github, User, GitBranch, Star, MapPin, LinkIcon, Loader2, Brain, TrendingUp, Code, Users, Target, Lightbulb, Award } from "lucide-react"

interface GitHubUser {
  login: string
  name: string
  bio: string
  avatar_url: string
  html_url: string
  followers: number
  following: number
  public_repos: number
  created_at: string
  location: string
  blog: string
  company: string
}

interface GitHubRepo {
  name: string
  description: string
  stargazers_count: number
  forks_count: number
  language: string
  created_at: string
  updated_at: string
  html_url: string
}

// Component to format and display AI analysis
const FormattedAnalysis = ({ analysis }: { analysis: string }) => {
  // Function to parse the analysis into sections
  // Function to parse the analysis into sections
const parseAnalysis = (text: string) => {
  const sections = []
  const lines = text.split('\n').filter(line => line.trim() !== '')
  
  let currentSection = { title: '', content: '', icon: Brain }
  let isInSection = false
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    
    // Check if this line is a section header - look for **text** or numbered sections
    const boldHeaderMatch = trimmedLine.match(/^\*\*(.*?)\*\*$/)
    const numberedHeaderMatch = trimmedLine.match(/^\*\*(\d+\.?\s*.*?)\*\*$/)
    
    const isHeader = (
      boldHeaderMatch || 
      numberedHeaderMatch ||
      (trimmedLine.match(/^\d+\./) && trimmedLine.length < 100) ||
      (trimmedLine.toLowerCase().includes('summary') && trimmedLine.length < 100) ||
      (trimmedLine.toLowerCase().includes('assessment') && trimmedLine.length < 100) ||
      (trimmedLine.toLowerCase().includes('analysis') && trimmedLine.length < 100) ||
      (trimmedLine.toLowerCase().includes('expertise') && trimmedLine.length < 100) ||
      (trimmedLine.toLowerCase().includes('involvement') && trimmedLine.length < 100) ||
      (trimmedLine.toLowerCase().includes('recommendations') && trimmedLine.length < 100) ||
      (trimmedLine.toLowerCase().includes('growth') && trimmedLine.length < 100)
    )
    
    if (isHeader) {
      // Save previous section if it exists
      if (isInSection && currentSection.title) {
        sections.push({ ...currentSection })
      }
      
      // Extract title from bold markdown or use the line as-is
      let title = trimmedLine
      if (boldHeaderMatch) {
        title = boldHeaderMatch[1]
      } else if (numberedHeaderMatch) {
        title = numberedHeaderMatch[1].replace(/^\d+\.?\s*/, '')
      } else {
        title = title.replace(/^\d+\.?\s*/, '')
      }
      
      currentSection = {
        title: title,
        content: '',
        icon: getSectionIcon(title)
      }
      isInSection = true
    } else if (isInSection) {
      // Add content to current section
      currentSection.content += (currentSection.content ? '\n' : '') + trimmedLine
    } else if (!isInSection) {
      // Handle content before first section
      if (!sections.length) {
        sections.push({
          title: 'Overview',
          content: trimmedLine,
          icon: Brain
        })
      } else {
        sections[0].content += '\n' + trimmedLine
      }
    }
  }
  
  // Add the last section
  if (isInSection && currentSection.title) {
    sections.push(currentSection)
  }
  
  return sections.filter(section => section.content.trim() !== '')
}
  
  // Function to get appropriate icon for each section
  const getSectionIcon = (title: string) => {
    const lowerTitle = title.toLowerCase()
    if (lowerTitle.includes('summary') || lowerTitle.includes('profile')) return User
    if (lowerTitle.includes('skill') || lowerTitle.includes('technical')) return Code
    if (lowerTitle.includes('activity') || lowerTitle.includes('engagement')) return TrendingUp
    if (lowerTitle.includes('quality') || lowerTitle.includes('impact')) return Award
    if (lowerTitle.includes('expertise') || lowerTitle.includes('areas')) return Target
    if (lowerTitle.includes('collaboration') || lowerTitle.includes('community')) return Users
    if (lowerTitle.includes('recommendation') || lowerTitle.includes('growth')) return Lightbulb
    return Brain
  }
  
  // Function to format markdown-style bold text
const formatMarkdownText = (text: string) => {
  // Replace **text** with bold spans using a more direct approach
  return text.split(/(\*\*[^*]+\*\*)/).map((part, index) => {
    if (part.match(/^\*\*[^*]+\*\*$/)) {
      const boldText = part.slice(2, -2)
      return (
        <span key={index} className="text-white font-black">
          {boldText}
        </span>
      )
    }
    return part
  })
}

  // Function to format content within each section
// Function to format content within each section
const formatContent = (content: string) => {
  return content.split('\n').map((line, index) => {
    const trimmedLine = line.trim()
    if (!trimmedLine) return null
    
    // Check if it's a bullet point
    if (trimmedLine.startsWith('*') && !trimmedLine.startsWith('**')) {
      const bulletContent = trimmedLine.substring(1).trim()
      return (
        <li key={index} className="ml-4 text-gray-200 font-medium leading-relaxed list-disc">
          <span>{formatMarkdownText(bulletContent)}</span>
        </li>
      )
    }
    
    // Check if it's a sub-header (short line that might be a category)
    if (trimmedLine.length < 80 && (trimmedLine.endsWith(':') || trimmedLine.match(/^\*\*[^*]+\*\*:?/))) {
      const headerText = trimmedLine.replace(':', '')
      return (
        <h5 key={index} className="text-white font-bold mt-4 mb-2 text-lg">
          <span>{formatMarkdownText(headerText)}</span>
        </h5>
      )
    }
    
    // Regular paragraph
    return (
      <p key={index} className="text-gray-200 font-medium leading-relaxed mb-3">
        <span>{formatMarkdownText(trimmedLine)}</span>
      </p>
    )
  }).filter(Boolean)
}
  
  const sections = parseAnalysis(analysis)
  
  if (sections.length === 0) {
    return (
      <div className="text-gray-200 font-medium leading-relaxed whitespace-pre-wrap">
        {analysis}
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {sections.map((section, index) => {
        const IconComponent = section.icon
        return (
          <div key={index} className="border-l-4 border-white pl-6">
            <div className="flex items-center gap-3 mb-4">
              <IconComponent className="h-6 w-6 text-white" />
              <h4 className="text-xl font-black text-white">{section.title}</h4>
            </div>
            <div className="space-y-2">
              {section.content.includes('-') || section.content.includes('•') || section.content.includes('*')? (
                <ul className="space-y-2">
                  {formatContent(section.content)}
                </ul>
              ) : (
                <div>
                  {formatContent(section.content)}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function UserProfileAnalyzer() {
  const [profileUrl, setProfileUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState<GitHubUser | null>(null)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [analysis, setAnalysis] = useState("")
  const [error, setError] = useState("")

  const extractUsername = (url: string) => {
    const match = url.match(/github\.com\/([^/]+)/)
    return match ? match[1] : url
  }

  const fetchGitHubData = async (username: string) => {
    try {
      // Fetch user data
      const userResponse = await fetch(`https://api.github.com/users/${username}`)
      if (!userResponse.ok) throw new Error("User not found")
      const user = await userResponse.json()

      // Fetch repositories
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=20`)
      if (!reposResponse.ok) throw new Error("Failed to fetch repositories")
      const repositories = await reposResponse.json()

      return { user, repositories }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to fetch GitHub data")
    }
  }

const analyzeWithGemini = async (user: GitHubUser, repositories: GitHubRepo[]) => {
  try {
    
    const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY 
    
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables.')
    }

    const prompt = `Analyze this GitHub profile and provide comprehensive insights in a well-structured format:

User Profile:
- Name: ${user.name || user.login}
- Bio: ${user.bio || "No bio provided"}
- Location: ${user.location || "Not specified"}
- Company: ${user.company || "Not specified"}
- Followers: ${user.followers}
- Following: ${user.following}
- Public Repositories: ${user.public_repos}
- Account Created: ${new Date(user.created_at).toLocaleDateString()}

Top Repositories:
${repositories
  .slice(0, 10)
  .map(
    (repo) => `
- ${repo.name}: ${repo.description || "No description"}
  Language: ${repo.language || "Not specified"}
  Stars: ${repo.stargazers_count}
  Forks: ${repo.forks_count}
  Last Updated: ${new Date(repo.updated_at).toLocaleDateString()}
`,
  )
  .join("")}

Please provide a detailed analysis with the following sections (use clear headings for each):

1. Developer Profile Summary
2. Technical Skills Assessment
3. Activity and Engagement Analysis
4. Project Quality and Impact Assessment
5. Areas of Expertise
6. Collaboration and Community Involvement
7. Recommendations for Growth

For each section, use bullet points where appropriate and provide specific, actionable insights. Make the analysis professional, detailed, and well-structured.`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Gemini API Error:', errorData)
      throw new Error(`Gemini API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    // Extract the generated text from Gemini's response format
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text
    } else {
      throw new Error('Unexpected response format from Gemini API')
    }
    
  } catch (err) {
    console.error('Gemini analysis error:', err)
    if (err instanceof Error) {
      throw new Error(`Failed to generate AI analysis: ${err.message}`)
    }
    throw new Error('Failed to generate AI analysis')
  }
}


  const handleAnalyze = async () => {
    if (!profileUrl.trim()) {
      setError("Please enter a GitHub profile URL or username")
      return
    }

    setLoading(true)
    setError("")
    setAnalysis("")

    try {
      const username = extractUsername(profileUrl.trim())
      const { user, repositories } = await fetchGitHubData(username)

      setUserData(user)
      setRepos(repositories)

      const aiAnalysis = await analyzeWithGemini(user, repositories)
      setAnalysis(aiAnalysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Navigation currentPage="Profile Analysis" />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">PROFILE ANALYZER</h1>
            <p className="text-xl text-gray-300 font-bold">Get AI-powered insights into any GitHub developer profile</p>
          </div>

          {/* Input Section */}
          <Card className="p-6 bg-gray-800/60 backdrop-blur-md border-4 border-white rounded-xl shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)]">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  placeholder="Enter GitHub profile URL or username (e.g., octocat)"
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                  className="flex-1 bg-black/40 border-2 border-white text-white placeholder-gray-400 rounded-xl font-bold text-lg p-4"
                  onKeyPress={(e) => e.key === "Enter" && handleAnalyze()}
                />
                <Button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="bg-white hover:bg-gray-200 text-black rounded-xl border-2 border-white font-bold shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] px-8 py-4 text-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Github className="h-5 w-5 mr-2" />
                      Analyze Profile
                    </>
                  )}
                </Button>
              </div>

              {error && (
                <div className="p-4 bg-red-500/20 border-2 border-red-500 rounded-xl">
                  <p className="text-red-300 font-bold">{error}</p>
                </div>
              )}
            </div>
          </Card>

          {/* User Profile Card */}
          {userData && (
            <Card className="p-6 bg-gray-800/60 backdrop-blur-md border-4 border-white rounded-xl shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)]">
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={userData.avatar_url || "/placeholder.svg"}
                  alt={userData.name || userData.login}
                  className="w-32 h-32 rounded-xl border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]"
                />
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-3xl font-black text-white">{userData.name || userData.login}</h2>
                    <p className="text-gray-300 font-bold">@{userData.login}</p>
                  </div>

                  {userData.bio && <p className="text-gray-200 font-medium">{userData.bio}</p>}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-black text-white">{userData.public_repos}</div>
                      <div className="text-sm text-gray-400 font-bold">Repositories</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-white">{userData.followers}</div>
                      <div className="text-sm text-gray-400 font-bold">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-white">{userData.following}</div>
                      <div className="text-sm text-gray-400 font-bold">Following</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-white">
                        {new Date(userData.created_at).getFullYear()}
                      </div>
                      <div className="text-sm text-gray-400 font-bold">Joined</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                    {userData.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {userData.location}
                      </div>
                    )}
                    {userData.company && (
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {userData.company}
                      </div>
                    )}
                    {userData.blog && (
                      <div className="flex items-center gap-1">
                        <LinkIcon className="h-4 w-4" />
                        <a href={userData.blog} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                          {userData.blog}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* AI Analysis */}
          {analysis && (
            <Card className="p-6 bg-gray-800/60 backdrop-blur-md border-4 border-white rounded-xl shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)]">
              <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                <Brain className="h-6 w-6" />
                AI Analysis Report
              </h3>
              <FormattedAnalysis analysis={analysis} />
            </Card>
          )}

          {/* Top Repositories */}
          {repos.length > 0 && (
            <Card className="p-6 bg-gray-800/60 backdrop-blur-md border-4 border-white rounded-xl shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)]">
              <h3 className="text-2xl font-black text-white mb-4 flex items-center gap-2">
                <GitBranch className="h-6 w-6" />
                Top Repositories
              </h3>
              <div className="grid gap-4">
                {repos.slice(0, 6).map((repo) => (
                  <div key={repo.name} className="p-4 bg-black/40 rounded-xl border-2 border-gray-600">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-bold text-white">{repo.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          {repo.stargazers_count}
                        </div>
                        <div className="flex items-center gap-1">
                          <GitBranch className="h-4 w-4" />
                          {repo.forks_count}
                        </div>
                      </div>
                    </div>
                    {repo.description && <p className="text-gray-300 text-sm mb-2">{repo.description}</p>}
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span className="font-bold">{repo.language || "No language"}</span>
                      <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}