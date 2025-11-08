import { useCallback, useEffect, useRef, useState } from 'react'

interface UsePollingOptions<T = unknown> {
	interval?: number
	enabled?: boolean
	maxTime: number
	onSuccess?: (data: T) => void
	onError?: (error: unknown) => void
}

export const usePolling = <T = unknown>(
	url: string,
	options: UsePollingOptions<T>,
) => {
	const {
		interval = 5000,
		enabled = true,
		maxTime,
		onSuccess,
		onError,
	} = options

	const [data, setData] = useState<T | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)
	const [requestCount, setRequestCount] = useState(0)

	const abortControllerRef = useRef<AbortController | null>(null)
	const startTimeRef = useRef<number | null>(null)

	const fetchData = useCallback(async () => {
		if (!enabled || !url) return

		const elapsed = Date.now() - (startTimeRef.current ?? Date.now())
		if (elapsed >= maxTime) {
			return
		}

		setLoading(true)

		try {
			abortControllerRef.current?.abort()

			abortControllerRef.current = new AbortController()
			const response = await fetch(url, {
				signal: abortControllerRef.current.signal,
			})

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const result = await response.json()
			setData(result)
			setRequestCount((prev) => prev + 1)
			setError(null)
			onSuccess?.(result)
		} catch (err: unknown) {
			if (err instanceof Error && err.name !== 'AbortError') {
				setError(err)
				onError?.(err)
			}
		} finally {
			setLoading(false)
		}
	}, [url, enabled, maxTime, onSuccess, onError])

	useEffect(() => {
		if (!enabled || !url) return

		startTimeRef.current = Date.now()
		fetchData()

		const intervalId = setInterval(fetchData, interval)

		return () => {
			clearInterval(intervalId)
			abortControllerRef.current?.abort()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [interval, enabled, url])

	const stop = useCallback(() => {
		abortControllerRef.current?.abort()
		startTimeRef.current = null
	}, [])

	return {
		data,
		loading,
		error,
		stop,
		requestCount,
		refetch: fetchData,
	}
}
