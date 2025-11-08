import { useCallback, useEffect, useRef, useState } from 'react'

interface UseSSEOptions {
	onMessage?: (data: unknown) => void
	onError?: (error: unknown) => void
	onOpen?: () => void
	onClose?: () => void
}

export const useSSE = (url: string, options: UseSSEOptions = {}) => {
	const { onMessage, onError, onOpen, onClose } = options
	const [connectionState, setConnectionState] = useState<
		'connecting' | 'open' | 'closed' | 'error'
	>('connecting')
	const [eventCount, setEventCount] = useState(0)
	const [lastEvent, setLastEvent] = useState<Record<string, unknown> | null>(
		null,
	)
	const eventSourceRef = useRef<EventSource | null>(null)
	const completedRef = useRef(false)

	const connect = useCallback(() => {
		if (eventSourceRef.current) {
			eventSourceRef.current.close()
		}

		setConnectionState('connecting')
		setEventCount(0)
		completedRef.current = false

		const eventSource = new EventSource(url)
		eventSourceRef.current = eventSource

		eventSource.onopen = () => {
			setConnectionState('open')
			onOpen?.()
		}

		eventSource.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data)
				setLastEvent(data)
				setEventCount((prev) => prev + 1)
				onMessage?.(data)
			} catch (err) {
				console.error('Error parsing SSE message:', err)
			}
		}

		eventSource.addEventListener('status', (event) => {
			try {
				const data = JSON.parse(event.data)
				setLastEvent(data)
				setEventCount((prev) => prev + 1)
				onMessage?.(data)
			} catch (err) {
				console.error('Error parsing SSE status message:', err)
			}
		})

		eventSource.addEventListener('complete', (event) => {
			try {
				const data = JSON.parse(event.data)
				setLastEvent(data)
				setEventCount((prev) => prev + 1)
				completedRef.current = true // Mark as completed
				onMessage?.(data)
			} catch (err) {
				console.error('Error parsing SSE complete message:', err)
			}
		})

		eventSource.onerror = (error) => {
			if (
				completedRef.current ||
				eventSource.readyState === EventSource.CLOSED
			) {
				setConnectionState('closed')
				onClose?.()
				return
			}

			console.log('SSE Connection error:', error)
			setConnectionState('error')
			onError?.(error)
		}

		eventSource.addEventListener('close', () => {
			setConnectionState('closed')
			onClose?.()
		})
	}, [url, onMessage, onError, onOpen, onClose])

	const disconnect = useCallback(() => {
		if (eventSourceRef.current) {
			eventSourceRef.current.close()
			eventSourceRef.current = null
			setConnectionState('closed')
		}
	}, [])

	useEffect(() => {
		return () => {
			disconnect()
		}
	}, [disconnect])

	return {
		connectionState,
		eventCount,
		lastEvent,
		connect,
		disconnect,
	}
}
