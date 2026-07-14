'use client'

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { getAuthToken } from '@/lib/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const STORAGE_KEY = 'dispute_unread_ids'

interface DisputeNotificationContextType {
    unreadDisputeIds: Set<number>
    unreadCount: number
    isUnread: (disputeId: number) => boolean
    markAsRead: (disputeId: number) => void
}

const DisputeNotificationContext = createContext<DisputeNotificationContextType | null>(null)

function loadUnreadIds(): Set<number> {
    try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
        if (raw) return new Set(JSON.parse(raw) as number[])
    } catch { /* ignore */ }
    return new Set()
}

function saveUnreadIds(ids: Set<number>) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)))
}

/**
 * Provider that connects to the global dispute notification SSE stream.
 * Tracks which disputes have unread user messages and persists to localStorage.
 */
export function DisputeNotificationProvider({ children }: { children: React.ReactNode }) {
    const [unreadDisputeIds, setUnreadDisputeIds] = useState<Set<number>>(loadUnreadIds)
    const eventSourceRef = useRef<EventSource | null>(null)
    const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const retryCountRef = useRef(0)

    const markAsRead = useCallback((disputeId: number) => {
        setUnreadDisputeIds(prev => {
            const next = new Set(prev)
            next.delete(disputeId)
            saveUnreadIds(next)
            return next
        })
    }, [])

    const isUnread = useCallback((disputeId: number) => {
        return unreadDisputeIds.has(disputeId)
    }, [unreadDisputeIds])

    useEffect(() => {
        function connect() {
            if (!API_BASE_URL) return

            if (eventSourceRef.current) {
                eventSourceRef.current.close()
            }

            const token = getAuthToken()
            const url = `${API_BASE_URL}/dispute-notifications/stream?token=${encodeURIComponent(token || '')}`

            const es = new EventSource(url)
            eventSourceRef.current = es

            es.addEventListener('connected', () => {
                retryCountRef.current = 0
            })

            es.addEventListener('new_user_message', (event) => {
                try {
                    const data = JSON.parse(event.data)
                    setUnreadDisputeIds(prev => {
                        const next = new Set(prev)
                        next.add(data.dispute_id)
                        saveUnreadIds(next)
                        return next
                    })
                } catch { /* ignore malformed */ }
            })

            es.addEventListener('error', () => {
                if (es.readyState === EventSource.CLOSED) {
                    es.close()
                    const delay = Math.min(1000 * Math.pow(2, retryCountRef.current), 30000)
                    retryCountRef.current++
                    retryTimerRef.current = setTimeout(connect, delay)
                }
            })
        }

        connect()

        return () => {
            if (retryTimerRef.current) clearTimeout(retryTimerRef.current)
            eventSourceRef.current?.close()
        }
    }, [])

    return (
        <DisputeNotificationContext.Provider value={{
            unreadDisputeIds,
            unreadCount: unreadDisputeIds.size,
            isUnread,
            markAsRead,
        }}>
            {children}
        </DisputeNotificationContext.Provider>
    )
}

export function useDisputeNotifications() {
    const context = useContext(DisputeNotificationContext)
    if (!context) {
        // Return a no-op fallback if used outside provider (shouldn't happen)
        return {
            unreadDisputeIds: new Set<number>(),
            unreadCount: 0,
            isUnread: () => false,
            markAsRead: () => {},
        }
    }
    return context
}
