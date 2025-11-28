import { useMemo, useState } from 'react'
import { StatusIndicator } from '../components/status-indicator'
import { ConnectionMetricsCard } from '../components/connection-metrics-card'
import { TechnicalDetailsCard } from '../components/technical-details-card'
import { WebSocketEducationalContent } from './content/web-socket-educational-content'
import { useWebSocket } from '../hooks/use-web-socket'
import type { PaymentResponse } from '../schemas/payment'
import { websocketApi } from '../utils/api'

export const WebSocketDemo = () => {
	const [payment, setPayment] = useState<PaymentResponse | null>(null)
	const [isProcessing, setIsProcessing] = useState(false)
	const [otp, setOtp] = useState('')
	const [showOtpInput, setShowOtpInput] = useState(false)
	const [cardNumber, setCardNumber] = useState('**** **** **** 1234')
	const [amount, setAmount] = useState(100)

	const {
		connectionState,
		messagesSent,
		messagesReceived,
		lastMessage,
		connect,
		disconnect,
		sendMessage,
	} = useWebSocket(
		payment ? `ws://localhost:3000/api/websocket/payment/${payment.id}` : '',
		{
			onMessage: (data) => {
				console.log('🔌 WebSocket Demo: Received message', data)

				if (typeof data !== 'object' || data === null || !('type' in data)) return

				const { type, status, otp } = data as {
					type: string
					status?: string
					otp?: string
				}

				if (type === 'connected') {
					console.log('🔌 WebSocket Demo: Connected to server')
					return
				}

				if (type === 'status' && 'status' in (data as any)) {
					setPayment((prev) => (prev ? { ...prev, status: status! } : null))
					return
				}

				if (type === 'otp_sent') {
					setShowOtpInput(true)
					if ('status' in (data as any)) {
						setPayment((prev) => (prev ? { ...prev, status: status! } : null))
					}
					if ('otp' in (data as any)) {
						console.log('🔌 WebSocket Demo: OTP sent:', otp)
					}
					return
				}

				if (type === 'complete') {
					setIsProcessing(false)
					setShowOtpInput(false)
					disconnect()
					return
				}

				if (type === 'error') {
					setIsProcessing(false)
					setShowOtpInput(false)
					disconnect()
				}
			},
			onError: (error) => {
				console.error('WebSocket Error:', error)
				setIsProcessing(false)
			},
			onOpen: () => {
				console.log('🔌 WebSocket Demo: Connection opened')
			},
			onClose: () => {
				console.log('🔌 WebSocket Demo: Connection closed')
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
			const response = await websocketApi.createPayment({
				type: 'websocket-otp',
				amount,
				metadata: { cardNumber },
			})

			if (response.data.success) {
				setPayment(response.data.data)
				console.log(
					'🔌 WebSocket Demo: Credit card payment initiated',
					response.data.data,
				)

				const wsUrl = `ws://localhost:3000/api/websocket/payment/${response.data.data.id}`
				console.log('🔌 WebSocket Demo: Connecting to WebSocket...', wsUrl)
				connect(wsUrl)
			}
		} catch (error) {
			console.error('Failed to create payment:', error)
			setIsProcessing(false)
		}
	}

	const startPayment = () => {
		console.log('🔌 WebSocket Demo: startPayment called')
		console.log('🔌 WebSocket Demo: payment exists:', !!payment)
		console.log('🔌 WebSocket Demo: connectionState:', connectionState)

		if (payment && connectionState === 'open') {
			sendMessage({ type: 'start_payment' })
			console.log('🔌 WebSocket Demo: Sending start_payment message')
		} else {
			console.log(
				'🔌 WebSocket Demo: Cannot send message - connection state:',
				connectionState,
			)
			if (!payment) {
				console.log('🔌 WebSocket Demo: No payment created yet')
			}
		}
	}

	const verifyOtp = () => {
		if (otp.length === 6) {
			sendMessage({ type: 'verify_otp', otp })
		}
	}

	const resetDemo = () => {
		setPayment(null)
		setIsProcessing(false)
		setShowOtpInput(false)
		setOtp('')
		disconnect()
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="max-w-6xl mx-auto px-4 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div className="space-y-6">
						<div className="card">
							<h2 className="text-2xl font-bold mb-4">
								🔌 Credit Card Payment (WebSocket)
							</h2>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium mb-2">
										Card Number:
									</label>
									<input
										type="text"
										value={cardNumber}
										onChange={(e) => setCardNumber(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-devfest focus:border-transparent dark:bg-gray-700 dark:text-white"
										placeholder="Enter card number"
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
										: `Create Payment - $${amount.toFixed(2)}`}
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
												<span className="font-medium">Card:</span>
												<div className="font-mono text-xs">
													{payment.metadata &&
													typeof payment.metadata === 'object' &&
													'cardNumber' in payment.metadata &&
													typeof payment.metadata.cardNumber === 'string'
														? payment.metadata.cardNumber
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

									{payment.status === 'pending' && (
										<button
											onClick={startPayment}
											disabled={connectionState !== 'open'}
											className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
										>
											{connectionState === 'open'
												? 'Start Payment Processing'
												: `Connect First (${connectionState})`}
										</button>
									)}

									{showOtpInput && (
										<div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
											<h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
												📱 OTP Verification
											</h4>
											<p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
												We've sent a 6-digit code to your registered mobile
												number
											</p>
											<div className="flex space-x-2">
												<input
													type="text"
													value={otp}
													onChange={(e) =>
														setOtp(
															e.target.value.replace(/\D/g, '').slice(0, 6),
														)
													}
													className="flex-1 px-3 py-2 border border-blue-300 dark:border-blue-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-mono text-lg dark:bg-gray-700 dark:text-white"
													placeholder="000000"
													maxLength={6}
												/>
												<button
													onClick={verifyOtp}
													disabled={otp.length !== 6}
													className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
												>
													Verify
												</button>
											</div>
										</div>
									)}

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
								{ label: 'Messages Sent:', value: messagesSent },
								{ label: 'Messages Received:', value: messagesReceived },
								{
									label: 'Last Message:',
									value:
										lastMessage &&
										typeof lastMessage === 'object' &&
										lastMessage !== null &&
										'timestamp' in lastMessage &&
										typeof (lastMessage as any).timestamp === 'string'
											? new Date((lastMessage as any).timestamp).toLocaleTimeString()
											: 'None',
									valueClassName: 'text-xs',
								},
							]}
						/>
					</div>

					<div className="space-y-6">
						<WebSocketEducationalContent />

						<TechnicalDetailsCard
							badge={{ text: 'WS', className: 'text-blue-600 dark:text-blue-400' }}
							endpoint="ws://localhost:3000/api/websocket/payment/:id"
							details={[
								{ label: 'Protocol', value: 'WebSocket' },
								{ label: 'Format', value: 'JSON messages' },
								{ label: 'Handshake', value: 'HTTP Upgrade' },
								{ label: 'Persistence', value: 'Until closed' },
							]}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
