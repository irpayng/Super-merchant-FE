import { useEffect, useRef, useCallback, useState } from 'react'
import { getAuthToken } from '@/lib/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface SSEConversation {
    id: number
    dispute_id: number
    sender_type: 'user' | 'admin' | 'agent'
    sender_name: string | null
    message: string
    created_at: string
}

interface UseDisputeSSEOptions {
    disputeId: number | null
    enabled?: boolean
    onMessage?: (message: SSEConversation) => void
}

/**
 * Hook for subscribing to real-time dispute conversation updates via SSE.
 *
 * Opens an EventSource connection to GET /disputes/{id}/stream.
 * Listens for "new_message" events and calls onMessage with the parsed conversation.
 * Automatically reconnects on connection loss with exponential backoff.
 */
export function useDisputeSSE({ disputeId, enabled = true, onMessage }: UseDisputeSSEOptions) {
    const [connected, setConnected] = useState(false)
    const eventSourceRef = useRef<EventSource | null>(null)
    const onMessageRef = useRef(onMessage)
    const retryCountRef = useRef(0)
    const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Keep callback ref fresh without triggering reconnect
    useEffect(() => {
        onMessageRef.current = onMessage
    })

    const disconnect = useCallback(() => {
        if (retryTimerRef.current) {
            clearTimeout(retryTimerRef.current)
            retryTimerRef.current = null
        }
        if (eventSourceRef.current) {
            eventSourceRef.current.close()
            eventSourceRef.current = null
        }
        setConnected(false)
    }, [])

    const connect = useCallback(() => {
        if (!disputeId || !API_BASE_URL) return

        // Close existing connection
        if (eventSourceRef.current) {
            eventSourceRef.current.close()
        }

        const token = getAuthToken()
        // EventSource doesn't support custom headers, so pass token as query param
        const url = `${API_BASE_URL}/disputes/${disputeId}/stream?token=${encodeURIComponent(token || '')}`

        const es = new EventSource(url)
        eventSourceRef.current = es

        es.addEventListener('connected', () => {
            setConnected(true)
            retryCountRef.current = 0
        })

        es.addEventListener('new_message', (event) => {
            try {
                const data: SSEConversation = JSON.parse(event.data)
                onMessageRef.current?.(data)
            } catch (e) {
                // Ignore malformed events
            }
        })

        es.addEventListener('error', () => {
            // EventSource auto-reconnects on some errors, but if it closes we retry manually
            if (es.readyState === EventSource.CLOSED) {
                setConnected(false)
                es.close()

                // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
                const delay = Math.min(1000 * Math.pow(2, retryCountRef.current), 30000)
                retryCountRef.current++

                retryTimerRef.current = setTimeout(() => {
                    connect()
                }, delay)
            }
        })
    }, [disputeId])

    useEffect(() => {
        if (enabled && disputeId) {
            connect()
        } else {
            disconnect()
        }

        return () => {
            disconnect()
        }
    }, [disputeId, enabled, connect, disconnect])

    return { connected, disconnect }
}
