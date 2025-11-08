import { useCallback, useEffect, useRef, useState } from 'react'

interface UseWebSocketOptions {
	onMessage?: (data: unknown) => void
	onError?: (error: unknown) => void
	onOpen?: () => void
	onClose?: () => void
}

export const useWebSocket = (
	url: string,
	options: UseWebSocketOptions = {},
) => {
	const { onMessage, onError, onOpen, onClose } = options
	const [connectionState, setConnectionState] = useState<
		'connecting' | 'open' | 'closed' | 'error'
	>('connecting')
	const [messagesSent, setMessagesSent] = useState(0)
	const [messagesReceived, setMessagesReceived] = useState(0)
	const [lastMessage, setLastMessage] = useState<Record<
		string,
		unknown
	> | null>(null)
	const websocketRef = useRef<WebSocket | null>(null)

	const connect = useCallback(
		(customUrl?: string) => {
			if (websocketRef.current) {
				websocketRef.current.close()
			}

			const targetUrl = customUrl || url
			if (!targetUrl) {
				console.log('WebSocket: No URL provided, skipping connection')
				return
			}

			console.log('WebSocket: Attempting to connect to', targetUrl)
			setConnectionState('connecting')
			setMessagesSent(0)
			setMessagesReceived(0)

			const ws = new WebSocket(targetUrl)
			websocketRef.current = ws

			ws.onopen = () => {
				console.log('WebSocket: Connection opened successfully')
				setConnectionState('open')
				onOpen?.()
			}

			ws.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data)
					console.log('WebSocket: Received message', data)
					setLastMessage(data)
					setMessagesReceived((prev) => prev + 1)

					onMessage?.(data)
				} catch (err) {
					console.error('Error parsing WebSocket message:', err)
				}
			}

			ws.onerror = (error) => {
				console.error('WebSocket: Connection error', error)
				setConnectionState('error')
				onError?.(error)
			}

			ws.onclose = (event) => {
				console.log('WebSocket: Connection closed', event.code, event.reason)
				setConnectionState('closed')
				onClose?.()
			}
		},
		[url, onMessage, onError, onOpen, onClose],
	)

	const sendMessage = useCallback((message: unknown) => {
		if (
			websocketRef.current &&
			websocketRef.current.readyState === WebSocket.OPEN
		) {
			const messageStr =
				typeof message === 'string' ? message : JSON.stringify(message)
			websocketRef.current.send(messageStr)
			setMessagesSent((prev) => prev + 1)
		}
	}, [])

	const disconnect = useCallback(() => {
		if (websocketRef.current) {
			websocketRef.current.close()
			websocketRef.current = null
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
		messagesSent,
		messagesReceived,
		lastMessage,
		connect,
		disconnect,
		sendMessage
	}
}
