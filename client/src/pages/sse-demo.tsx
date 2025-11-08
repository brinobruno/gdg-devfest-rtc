import { useState } from 'react'
import { StatusIndicator } from '../components/status-indicator'
import { useSSE } from '../hooks/use-sse'
import type { PaymentResponse } from '../schemas/payment'
import { sseApi } from '../utils/api'

export const SSEDemo = () => {
	const [payment, setPayment] = useState<PaymentResponse | null>(null)
	const [isProcessing, setIsProcessing] = useState(false)
	const [pixKey, setPixKey] = useState('demo@example.com')
	const [amount, setAmount] = useState(100)

	const { connectionState, eventCount, lastEvent, connect, disconnect } =
		useSSE(
			payment
				? `http://localhost:3000/api/sse/payment/${payment.id}/stream`
				: '',
			{
				onMessage: (data) => {
					console.log('📡 SSE Demo: Received event', data)

					if (typeof data === 'object' && data !== null && 'type' in data) {
						const eventData = data as { type: string; status?: string }

						if (eventData.type === 'status' && 'status' in eventData) {
							setPayment((prev) =>
								prev ? { ...prev, status: eventData.status! } : null,
							)
						} else if (eventData.type === 'complete') {
							setIsProcessing(false)
							setTimeout(() => {
								disconnect()
							}, 1000)
						} else if (eventData.type === 'error') {
							setIsProcessing(false)
							disconnect()
						}
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

						<div className="card">
							<h3 className="text-lg font-semibold mb-3">
								📊 Connection Metrics
							</h3>
							<div className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span>Connection State:</span>
									<span
										className={`font-mono ${
											connectionState === 'open'
												? 'text-green-600 dark:text-green-400'
												: connectionState === 'connecting'
													? 'text-yellow-600 dark:text-yellow-400'
													: connectionState === 'error'
														? 'text-red-600 dark:text-red-400'
														: 'text-gray-600 dark:text-gray-400'
										}`}
									>
										{connectionState}
									</span>
								</div>
								<div className="flex justify-between">
									<span>Events Received:</span>
									<span className="font-mono">{eventCount}</span>
								</div>
								<div className="flex justify-between">
									<span>Last Event:</span>
									<span className="font-mono text-xs">
										{lastEvent &&
										typeof lastEvent === 'object' &&
										'timestamp' in lastEvent &&
										typeof lastEvent.timestamp === 'string'
											? new Date(lastEvent.timestamp).toLocaleTimeString()
											: 'None'}
									</span>
								</div>
							</div>
						</div>
					</div>

					<div className="space-y-6">
						<div className="card">
							<h3 className="text-lg font-semibold mb-3">
								🎓 Educational Context
							</h3>
							<div className="space-y-4 text-sm">
								<div>
									<h4 className="font-semibold text-blue-600 dark:text-blue-400">
										How SSE Works:
									</h4>
									<p className="text-gray-700 dark:text-gray-300">
										Server-Sent Events create a persistent HTTP connection where
										the server can push data to the client in real-time. The
										client opens an EventSource connection and listens for
										events.
									</p>
								</div>

								<div>
									<h4 className="font-semibold text-green-600 dark:text-green-400">
										When to Use:
									</h4>
									<ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
										<li>One-way real-time updates</li>
										<li>Live notifications</li>
										<li>Progress tracking</li>
										<li>Status updates</li>
										<li>Live feeds and dashboards</li>
									</ul>
								</div>

								<div>
									<h4 className="font-semibold text-yellow-600 dark:text-yellow-400">
										Pros:
									</h4>
									<ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
										<li>True real-time updates</li>
										<li>Lower server load than polling</li>
										<li>Automatic reconnection</li>
										<li>Works through firewalls</li>
										<li>Simple to implement</li>
									</ul>
								</div>

								<div>
									<h4 className="font-semibold text-red-600 dark:text-red-400">
										Cons:
									</h4>
									<ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
										<li>One-way communication only</li>
										<li>Limited browser support (older IE)</li>
										<li>Connection limits per domain</li>
										<li>No binary data support</li>
									</ul>
								</div>

								<div>
									<h4 className="font-semibold text-purple-600 dark:text-purple-400">
										E-commerce Use Cases:
									</h4>
									<ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
										<li>PIX payment confirmations</li>
										<li>Order status updates</li>
										<li>Live inventory notifications</li>
										<li>Real-time price changes</li>
										<li>Payment processing updates</li>
									</ul>
								</div>
							</div>
						</div>

						<div className="card">
							<h3 className="text-lg font-semibold mb-3">
								🔍 Technical Details
							</h3>
							<div className="space-y-2 text-xs font-mono bg-gray-50 dark:bg-gray-700 p-3 rounded">
								<div>
									<span className="text-blue-600 dark:text-blue-400">GET</span>{' '}
									/api/sse/payment/:id/stream
								</div>
								<div>
									<span className="text-gray-500 dark:text-gray-400">
										Content-Type:
									</span>{' '}
									text/event-stream
								</div>
								<div>
									<span className="text-gray-500 dark:text-gray-400">
										Connection:
									</span>{' '}
									keep-alive
								</div>
								<div>
									<span className="text-gray-500 dark:text-gray-400">
										Cache-Control:
									</span>{' '}
									no-cache
								</div>
								<div>
									<span className="text-gray-500 dark:text-gray-400">
										Format:
									</span>{' '}
									data: {'{JSON}'}\n\n
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
