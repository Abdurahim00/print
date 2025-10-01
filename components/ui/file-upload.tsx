"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageIcon, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useAppSelector } from "@/lib/redux/hooks"
import { translations } from "@/lib/constants"

interface FileUploadProps {
  value?: string
  onChange: (value: string) => void
  accept?: string
  maxSize?: number
  className?: string
  label?: string
  error?: string
}

export function FileUpload({
  value,
  onChange,
  className,
  label,
  error,
}: FileUploadProps) {
  const { language } = useAppSelector((state) => state.app)
  const t = translations[language]

  const [urlInput, setUrlInput] = useState<string>(value || "")

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setUrlInput(url)
    onChange(url)
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}

      <div className="space-y-3">
        <div className="relative">
          <Input
            type="url"
            value={urlInput}
            onChange={handleUrlChange}
            placeholder="https://example.com/image.jpg"
            className={cn(
              "pr-10",
              error && "border-red-300 dark:border-red-600"
            )}
          />
          <ExternalLink className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>

        {urlInput && (
          <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4">
            <Image
              src={urlInput || "/placeholder.jpg"}
              alt="Preview"
              width={200}
              height={150}
              className="mx-auto rounded-lg object-cover max-h-40"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.jpg"
              }}
            />
            <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-2">
              Image preview
            </p>
          </div>
        )}

        {!urlInput && (
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 mb-2" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Enter an image URL above
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
              Supported: JPG, PNG, WEBP, GIF
            </p>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}
