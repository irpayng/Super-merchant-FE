"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { navigation } from "@/lib/navigation"

export function Breadcrumb() {
  const pathname = usePathname()
  
  const getBreadcrumbs = () => {
    if (pathname === "/") return [{ name: "Dashboard", url: "/" }]
    
    const segments = pathname.split("/").filter(Boolean)
    const breadcrumbs: { name: string; url: string }[] = []
    
    for (const section of navigation) {
      for (const item of section.items) {
        if (item.url === pathname) {
          breadcrumbs.push({ name: item.name, url: item.url })
          return breadcrumbs
        }
        if (item.children) {
          for (const child of item.children) {
            if (child.url === pathname) {
              breadcrumbs.push({ name: item.name, url: item.url || "#" })
              breadcrumbs.push({ name: child.name, url: child.url })
              return breadcrumbs
            }
          }
        }
      }
    }
    
    return segments.map((segment, i) => ({
      name: segment.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      url: "/" + segments.slice(0, i + 1).join("/")
    }))
  }
  
  const breadcrumbs = getBreadcrumbs()
  
  return (
    <nav className="flex items-center space-x-2 text-sm px-6 py-3 mt-4 bg-card border-b border-border">
      <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      {breadcrumbs.map((crumb, i) => (
        <div key={crumb.url} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          {i === breadcrumbs.length - 1 ? (
            <span className="font-medium text-foreground">{crumb.name}</span>
          ) : (
            <Link href={crumb.url} className="text-muted-foreground hover:text-foreground transition-colors">
              {crumb.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
