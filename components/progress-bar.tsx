"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

let progressTimer: NodeJS.Timeout

export function startProgress() {
  const bar = document.getElementById("progress-bar")
  if (!bar) return
  
  clearTimeout(progressTimer)
  bar.style.width = "10%"
  bar.style.opacity = "1"
  setTimeout(() => bar.style.width = "70%", 100)
}

function completeProgress() {
  const bar = document.getElementById("progress-bar")
  if (!bar) return
  
  bar.style.width = "100%"
  progressTimer = setTimeout(() => bar.style.opacity = "0", 200)
}

export function ProgressBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    completeProgress()
  }, [pathname, searchParams])

  return (
    <div
      id="progress-bar"
      className="fixed top-0 left-0 h-[3px] bg-primary z-50 transition-all duration-300 ease-out"
      style={{ width: "0%", opacity: 0 }}
    />
  )
}
