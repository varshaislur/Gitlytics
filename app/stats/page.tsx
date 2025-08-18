"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Star, GitFork, Eye, Calendar, ChevronDown, ChevronUp, GitCommit, User, Clock } from "lucide-react"
import Navigation from "@/components/navigation"

interface Commit {
  sha: string
  commit: {
    message: string
    author: {
      name: string
      date: string
    }
  }
  author: {
    login?: string
    avatar_url?: string
  } | null
}

export default function StatsPage() {
  const [repoUrl, setRepoUrl] = useState("")
  const [repoData, setRepoData] = useState<any>(null)
  const [commits, setCommits] = useState<Commit[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingCommits, setLoadingCommits] = useState(false)
  const [showCommits, setShowCommits] = useState(false)

  const fetchCommits = async (owner: string, repo: string) => {
    setLoadingCommits(true)
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`)
      const data = await response.json()
      
      if (response.ok) {
        setCommits(data)
      } else {
        console.error("Failed to fetch commits:", data.message)
        setCommits([])
      }
    } catch (error) {
      console.error("Error fetching commits:", error)
      setCommits([])
    } finally {
      setLoadingCommits(false)
    }
  }

  const fetchRepoStats = async () => {
    if (!repoUrl) return

    setLoading(true)
    try {
      // Extract owner/repo from URL
      const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
      if (!match) throw new Error("Invalid GitHub URL")

      const [, owner, repo] = match
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`)
      const data = await response.json()

      if (response.ok) {
        setRepoData(data)
        // Fetch commits automatically
        await fetchCommits(owner, repo)
      } else {
        throw new Error(data.message || "Failed to fetch repository")
      }
    } catch (error) {
      console.error("Error fetching repo:", error)
      alert("Failed to fetch repository stats. Please check the URL and try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleCommits = () => {
    setShowCommits(!showCommits)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateMessage = (message: string, maxLength: number = 80) => {
    const firstLine = message.split('\n')[0]
    return firstLine.length > maxLength ? firstLine.substring(0, maxLength) + '...' : firstLine
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-2 sm:p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto backdrop-blur-xl bg-gray-900/80 border-4 border-white rounded-3xl shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] overflow-hidden">
        <Navigation currentPage="REPOSITORY STATS" />

        <div className="p-4 sm:p-6 space-y-6">
          <Card className="bg-gray-800/50 border-4 border-white rounded-xl shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
            <CardHeader>
              <CardTitle className="text-white font-black text-xl">REPOSITORY ANALYZER</CardTitle>
              <CardDescription className="text-gray-300 font-bold">
                Enter a GitHub repository URL to view detailed statistics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="https://github.com/owner/repository"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="bg-black/50 border-2 border-white rounded-xl text-white placeholder:text-gray-400 font-bold"
                />
                <Button
                  onClick={fetchRepoStats}
                  disabled={loading}
                  className="bg-white hover:bg-gray-200 text-black rounded-xl border-2 border-white font-bold shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]"
                >
                  {loading ? "Loading..." : "Analyze"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {repoData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-4 border-white rounded-xl shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                <CardHeader>
                  <CardTitle className="text-white font-black flex items-center gap-2">
                    <Github className="h-5 w-5" />
                    {repoData.name}
                  </CardTitle>
                  <CardDescription className="text-gray-300 font-bold">
                    {repoData.description || "No description available"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-yellow-500 text-black font-bold border-2 border-white">
                      <Star className="h-3 w-3 mr-1" />
                      {repoData.stargazers_count} stars
                    </Badge>
                    <Badge className="bg-blue-500 text-white font-bold border-2 border-white">
                      <GitFork className="h-3 w-3 mr-1" />
                      {repoData.forks_count} forks
                    </Badge>
                    <Badge className="bg-green-500 text-black font-bold border-2 border-white">
                      <Eye className="h-3 w-3 mr-1" />
                      {repoData.watchers_count} watchers
                    </Badge>
                  </div>
                  <div className="text-white space-y-2">
                    <p className="font-bold">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Created: {new Date(repoData.created_at).toLocaleDateString()}
                    </p>
                    <p className="font-bold">Language: {repoData.language || "Not specified"}</p>
                    <p className="font-bold">Size: {(repoData.size / 1024).toFixed(2)} MB</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-4 border-white rounded-xl shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                <CardHeader>
                  <CardTitle className="text-white font-black">REPOSITORY INFO</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-white space-y-3">
                    <div>
                      <p className="font-bold text-gray-300">Owner:</p>
                      <p className="font-black">{repoData.owner.login}</p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-300">Default Branch:</p>
                      <p className="font-black">{repoData.default_branch}</p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-300">Open Issues:</p>
                      <p className="font-black">{repoData.open_issues_count}</p>
                    </div>
                    <div>
                      <p className="font-bold text-gray-300">License:</p>
                      <p className="font-black">{repoData.license?.name || "No license"}</p>
                    </div>
                    <Button
                      onClick={() => window.open(repoData.html_url, "_blank")}
                      className="w-full bg-white hover:bg-gray-200 text-black rounded-xl border-2 border-white font-bold shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]"
                    >
                      View on GitHub
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {repoData && (
            <Card className="bg-gray-800/50 border-4 border-white rounded-xl shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white font-black flex items-center gap-2">
                    <GitCommit className="h-5 w-5" />
                    RECENT COMMITS
                  </CardTitle>
                  <Button
                    onClick={toggleCommits}
                    variant="ghost"
                    className="text-white hover:bg-gray-700 p-2"
                  >
                    {showCommits ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </Button>
                </div>
                <CardDescription className="text-gray-300 font-bold">
                  Latest 100 commits from the repository
                </CardDescription>
              </CardHeader>
              
              {showCommits && (
                <CardContent>
                  {loadingCommits ? (
                    <div className="text-white font-bold text-center py-4">Loading commits...</div>
                  ) : commits.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {commits.map((commit) => (
                        <div
                          key={commit.sha}
                          className="bg-gray-700/50 border-2 border-gray-600 rounded-lg p-4 space-y-2"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-bold text-sm leading-tight">
                                {truncateMessage(commit.commit.message)}
                              </p>
                            </div>
                            <Badge className="bg-gray-600 text-white font-bold border border-gray-500 ml-2 text-xs">
                              {commit.sha.substring(0, 7)}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 text-gray-300">
                              <User className="h-3 w-3" />
                              <span className="font-bold">
                                {commit.author?.login || commit.commit.author.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-400">
                              <Clock className="h-3 w-3" />
                              <span className="font-bold">
                                {formatDate(commit.commit.author.date)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 font-bold text-center py-4">
                      No commits found or failed to load commits.
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}