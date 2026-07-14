"use client"

import * as React from "react"
import Image, { ImageProps } from "next/image"

interface SafeImageProps extends Omit<ImageProps, 'src' | 'onError'> {
  src?: string | null
  fallback?: React.ReactNode
}

export function SafeImage({ src, fallback, alt, ...props }: SafeImageProps) {
  const [error, setError] = React.useState(false)

  const isValidUrl = (url: string | null | undefined): url is string => {
    if (!url || url.trim() === '') return false
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  if (!isValidUrl(src) || error) {
    return <>{fallback || null}</>
  }

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      onError={() => setError(true)}
    />
  )
}
