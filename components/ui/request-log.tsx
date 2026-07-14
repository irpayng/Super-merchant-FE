"use client"

import { HeaderCard } from "@/components/ui/header-card"
import { CodeBlock } from "@/components/ui/code-block"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface RequestLogProps {
  title: string
  description: string
  request: any
  response: any
}

export function RequestLog({ title, description, request, response }: RequestLogProps) {
  const [activeTab, setActiveTab] = useState("request")

  return (
    <HeaderCard title={title} description={description}>
      <div className="flex border-b -mx-6 px-6">
        <Button
          onClick={() => setActiveTab("request")}
          variant="tab"
          className={activeTab === "request" ? "text-[#FC6401] border-b-2 border-[#FC6401]" : "text-gray-600 dark:text-gray-400"}
        >
          Request
        </Button>
        <Button
          onClick={() => setActiveTab("response")}
          variant="tab"
          className={activeTab === "response" ? "text-[#FC6401] border-b-2 border-[#FC6401]" : "text-gray-600 dark:text-gray-400"}
        >
          Response
        </Button>
      </div>
      <div className="mt-4">
        <CodeBlock content={activeTab === "request" ? request : response} />
      </div>
    </HeaderCard>
  )
}
