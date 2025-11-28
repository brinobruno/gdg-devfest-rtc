import { useMemo, useState } from 'react'
import { StatusIndicator } from '../components/status-indicator'
import { ConnectionMetricsCard } from '../components/connection-metrics-card'
import { TechnicalDetailsCard } from '../components/technical-details-card'
import { SseEducationalContent } from './content/sse-educational-content'
import { useSSE } from '../hooks/use-sse'
import type { PaymentResponse } from '../schemas/payment'
import { sseApi, VITE_API_BASE_URL } from '../utils/api'

export const SSEDemo = () => {
	const [payment, setPayment] = useState<PaymentResponse | null>(null)
	const [isProcessing, setIsProcessing] = useState(false)
	const [pixKey, setPixKey] = useState('demo@example.com')
	const [amount, setAmount] = useState(100)

	const { connectionState, eventCount, lastEvent, connect, disconnect } =
		useSSE(
			payment
				? `${VITE_API_BASE_URL}/api/sse/payment/${payment.id}/stream`
				: '',
			{
				onMessage: (data) => {
					console.log('📡 SSE Demo: Received event', data)

					if (typeof data !== 'object' || data === null || !('type' in data)) return

					const { type, status } = data as { type: string; status?: string }

					if (type === 'status' && 'status' in (data as any)) {
						setPayment((prev) => (prev ? { ...prev, status: status! } : null))
						return
					}

					if (type === 'complete') {
						setIsProcessing(false)
						setTimeout(disconnect, 1000)
						return
					}

					if (type === 'error') {
						setIsProcessing(false)
						disconnect()
					}
				},
				onError: (error) => {
					console.error('SSE Error:', error)
					setIsProcessing(false)
				},
				onOpen: () => {
					console.log('📡 SSE Demo: Connection opened')
				},
				onClose: () => {
					console.log('📡 SSE Demo: Connection closed')
				},
			},
		)

		const connectionStateClass = useMemo(() => {
			const classes: Record<string, string> = {
				open: 'text-green-600 dark:text-green-400',
				connecting: 'text-yellow-600 dark:text-yellow-400',
				error: 'text-red-600 dark:text-red-400',
			}
			return classes[connectionState] ?? 'text-gray-600 dark:text-gray-400'
		}, [connectionState])

	const handlePayment = async () => {
		setIsProcessing(true)
		try {
			const response = await sseApi.createPayment({
				type: 'sse-pix',
				amount,
				metadata: { pixKey },
			})

			if (response.data.success) {
				setPayment(response.data.data)
				console.log('📡 SSE Demo: PIX payment initiated', response.data.data)
			}
		} catch (error) {
			console.error('Failed to create payment:', error)
			setIsProcessing(false)
		}
	}

	const resetDemo = () => {
		setPayment(null)
		setIsProcessing(false)
		disconnect()
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="max-w-6xl mx-auto px-4 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div className="space-y-6">
						<div className="card">
							<h2 className="text-2xl font-bold mb-4">📡 PIX Payment (SSE)</h2>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium mb-2">
										PIX Key:
									</label>
									<input
										type="text"
										value={pixKey}
										onChange={(e) => setPixKey(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-devfest focus:border-transparent dark:bg-gray-700 dark:text-white"
										placeholder="Enter PIX key"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">
										Amount:
									</label>
									<input
										type="number"
										value={amount}
										onChange={(e) => setAmount(parseFloat(e.target.value))}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-devfest focus:border-transparent dark:bg-gray-700 dark:text-white"
										min="1"
										step="0.01"
									/>
								</div>

								<button
									onClick={handlePayment}
									disabled={isProcessing}
									className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isProcessing
										? 'Processing...'
										: `Create PIX Payment - $${amount.toFixed(2)}`}
								</button>
							</div>

							{payment && (
								<div className="mt-6 space-y-4">
									<div className="flex items-center justify-between">
										<h3 className="font-semibold">Payment Status:</h3>
										<StatusIndicator status={payment.status} />
									</div>

									<div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
										<div className="grid grid-cols-2 gap-4 text-sm">
											<div>
												<span className="font-medium">Payment ID:</span>
												<div className="font-mono text-xs">{payment.id}</div>
											</div>
											<div>
												<span className="font-medium">Amount:</span>
												<div>${payment.amount.toFixed(2)}</div>
											</div>
											<div>
												<span className="font-medium">PIX Key:</span>
												<div className="font-mono text-xs">
													{payment.metadata &&
													typeof payment.metadata === 'object' &&
													'pixKey' in payment.metadata &&
													typeof payment.metadata.pixKey === 'string'
														? payment.metadata.pixKey
														: 'N/A'}
												</div>
											</div>
											<div>
												<span className="font-medium">Created:</span>
												<div>
													{new Date(payment.createdAt).toLocaleTimeString()}
												</div>
											</div>
										</div>
									</div>

									<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
										<h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
											📱 PIX QR Code
										</h4>
										<div className="bg-white dark:bg-gray-800 border-2 border-dashed border-green-300 dark:border-green-700 rounded-lg p-8 text-center">
											<div className="text-4xl mb-2">📱</div>
											<div className="text-sm text-gray-600 dark:text-gray-400">
												Scan with your banking app
											</div>
											<div className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-mono">
												PIX Key:{' '}
												{payment.metadata &&
												typeof payment.metadata === 'object' &&
												'pixKey' in payment.metadata &&
												typeof payment.metadata.pixKey === 'string'
													? payment.metadata.pixKey
													: 'N/A'}
											</div>
										</div>

										{payment.status === 'pending' && (
											<button
												onClick={() => {
													connect()
													console.log(
														'📡 SSE Demo: Starting PIX payment stream',
													)
												}}
												className="btn-primary w-full mt-4"
											>
												💳 Pay PIX - Start Payment Stream
											</button>
										)}
									</div>

									<button onClick={resetDemo} className="btn-secondary w-full">
										Reset Demo
									</button>
								</div>
							)}
						</div>

						<ConnectionMetricsCard
							title="📊 Connection Metrics"
							rows={[
								{
									label: 'Connection State:',
									value: connectionState,
									valueClassName: connectionStateClass,
								},
								{ label: 'Events Received:', value: eventCount },
								{
									label: 'Last Event:',
									value:
										lastEvent &&
										typeof lastEvent === 'object' &&
										'timestamp' in lastEvent &&
										typeof (lastEvent as any).timestamp === 'string'
											? new Date((lastEvent as any).timestamp).toLocaleTimeString()
											: 'None',
									valueClassName: 'text-xs',
								},
							]}
						/>
					</div>

					<div className="space-y-6">
						<SseEducationalContent />
						<TechnicalDetailsCard
							badge={{ text: 'GET', className: 'text-blue-600 dark:text-blue-400' }}
							endpoint="/api/sse/payment/:id/stream"
							details={[
								{ label: 'Content-Type', value: 'text/event-stream' },
								{ label: 'Connection', value: 'keep-alive' },
								{ label: 'Cache-Control', value: 'no-cache' },
								{ label: 'Format', value: 'data: {JSON}\\n\\n' },
							]}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
