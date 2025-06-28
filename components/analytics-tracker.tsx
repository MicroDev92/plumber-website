"use client"

import { useEffect } from "react"
import { trackPageView } from "@/lib/analytics"

interface AnalyticsTrackerProps {
  page: string
}

export function AnalyticsTracker({ page }: AnalyticsTrackerProps) {
  useEffect(() => {
    // Simple page view tracking (free)
    trackPageView(page)
  }, [page])

  return null
}
