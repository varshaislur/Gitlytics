import Link from "next/link"
import { Github, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavigationProps {
  currentPage: string
}

export default function Navigation({ currentPage }: NavigationProps) {
  return (
    <header className="border-b-4 border-white p-4 sm:p-6 bg-black/60 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4">
          <Github className="h-8 w-8 text-white" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">GITHUB STATS</h1>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-white font-bold text-sm hidden sm:block">{currentPage}</span>
          <Link href="/">
            <Button className="bg-white hover:bg-gray-200 text-black rounded-xl border-2 border-white font-bold shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
