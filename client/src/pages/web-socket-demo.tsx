import { useState } from 'react'
import { StatusIndicator } from '../components/status-indicator'
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

				if (typeof data === 'object' && data !== null && 'type' in data) {
					const eventData = data as {
						type: string
						status?: string
						otp?: string
					}

					if (eventData.type === 'connected') {
						console.log('🔌 WebSocket Demo: Connected to server')
					} else if (eventData.type === 'status' && 'status' in eventData) {
						setPayment((prev) =>
							prev ? { ...prev, status: eventData.status! } : null,
						)
					} else if (eventData.type === 'otp_sent') {
						setShowOtpInput(true)
						if ('status' in eventData) {
							setPayment((prev) =>
								prev ? { ...prev, status: eventData.status! } : null,
							)
						}
						if ('otp' in eventData) {
							console.log('🔌 WebSocket Demo: OTP sent:', eventData.otp)
						}
					} else if (eventData.type === 'complete') {
						setIsProcessing(false)
						setShowOtpInput(false)
						disconnect()
					} else if (eventData.type === 'error') {
						setIsProcessing(false)
						setShowOtpInput(false)
						disconnect()
					}
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
									<span>Messages Sent:</span>
									<span className="font-mono">{messagesSent}</span>
								</div>
								<div className="flex justify-between">
									<span>Messages Received:</span>
									<span className="font-mono">{messagesReceived}</span>
								</div>
								<div className="flex justify-between">
									<span>Last Message:</span>
									<span className="font-mono text-xs">
										{lastMessage &&
										typeof lastMessage === 'object' &&
										lastMessage !== null &&
										'timestamp' in lastMessage &&
										typeof lastMessage.timestamp === 'string'
											? new Date(lastMessage.timestamp).toLocaleTimeString()
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
										How WebSockets Work:
									</h4>
									<p className="text-gray-700 dark:text-gray-300">
										WebSockets establish a persistent, full-duplex connection
										between client and server. Both sides can send messages at
										any time without the overhead of HTTP headers.
									</p>
								</div>

								<div>
									<h4 className="font-semibold text-green-600 dark:text-green-400">
										When to Use:
									</h4>
									<ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
										<li>Bidirectional real-time communication</li>
										<li>Interactive applications</li>
										<li>Collaborative tools</li>
										<li>Gaming applications</li>
										<li>Live chat systems</li>
									</ul>
								</div>

								<div>
									<h4 className="font-semibold text-yellow-600 dark:text-yellow-400">
										Pros:
									</h4>
									<ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
										<li>True real-time bidirectional communication</li>
										<li>Low latency</li>
										<li>Efficient (no HTTP overhead)</li>
										<li>Supports binary data</li>
										<li>Persistent connection</li>
									</ul>
								</div>

								<div>
									<h4 className="font-semibold text-red-600 dark:text-red-400">
										Cons:
									</h4>
									<ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
										<li>More complex to implement</li>
										<li>Firewall/proxy issues</li>
										<li>Connection state management</li>
										<li>Higher resource usage</li>
										<li>No automatic reconnection</li>
									</ul>
								</div>

								<div>
									<h4 className="font-semibold text-purple-600 dark:text-purple-400">
										E-commerce Use Cases:
									</h4>
									<ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
										<li>OTP verification flows</li>
										<li>Live customer support chat</li>
										<li>Real-time bidding/auctions</li>
										<li>Collaborative shopping carts</li>
										<li>Live payment confirmations</li>
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
									<span className="text-blue-600 dark:text-blue-400">WS</span>{' '}
									ws://localhost:3000/api/websocket/payment/:id
								</div>
								<div>
									<span className="text-gray-500 dark:text-gray-400">
										Protocol:
									</span>{' '}
									WebSocket
								</div>
								<div>
									<span className="text-gray-500 dark:text-gray-400">
										Format:
									</span>{' '}
									JSON messages
								</div>
								<div>
									<span className="text-gray-500 dark:text-gray-400">
										Handshake:
									</span>{' '}
									HTTP Upgrade
								</div>
								<div>
									<span className="text-gray-500 dark:text-gray-400">
										Persistence:
									</span>{' '}
									Until closed
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
