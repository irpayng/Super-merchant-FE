import { SafeImage } from "@/components/ui/safe-image"
import { Badge } from "@/components/ui/badge"
import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import * as React from "react"

interface EntityHeaderProps {
  imageSrc: string
  name: string
  email: string
  status: string
  onMoreClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  moreActions?: Array<{ label: string; icon: any; onClick: () => void }>
}

export function EntityHeader({ imageSrc, name, email, status, onMoreClick, moreActions }: EntityHeaderProps) {
  const [showMenu, setShowMenu] = React.useState(false)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  const handleMoreClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (moreActions && moreActions.length > 0) {
      e.stopPropagation()
      setShowMenu(!showMenu)
    } else {
      onMoreClick?.(e)
    }
  }
  return (
    <div className="rounded-xl p-6 border border-border bg-secondary dark:bg-primary/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SafeImage src={imageSrc} alt={name} width={80} height={80} className="w-20 h-20 rounded-full shadow-sm" />
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-primary dark:text-white">{name}</h2>
            <p className="text-primary dark:text-white">{email}</p>
          </div>
          <Badge variant={status === "Active" ? "success" : status === "Suspended" ? "error" : "default"}>{status}</Badge>
        </div>
        <div className="relative">
          <Button
            ref={buttonRef}
            onClick={handleMoreClick}
            variant="secondary"
          >
            <MoreVertical className="h-4 w-4" /> More
          </Button>
          {showMenu && moreActions && (
            <>
              <div className="fixed inset-0 z-[9999]" onClick={() => setShowMenu(false)} />
              <div
                className="absolute right-0 top-full mt-2 bg-card border border-border rounded-lg shadow-lg z-[10000] py-1 min-w-[200px]"
              >
                {moreActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setShowMenu(false)
                        action.onClick()
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-accent text-foreground flex items-center gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {action.label}
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
