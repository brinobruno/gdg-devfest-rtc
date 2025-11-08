import { Elysia, t } from 'elysia'
import {
	PaymentRepository,
	PaymentStatus,
	PaymentType,
} from '../domain/payment'
import { logger } from '..'

const paymentRepo = new PaymentRepository()

interface WebSocketMessage {
	type: string
	otp?: string
}

interface WebSocketContext {
	otp?: string
}

export const websocketRoutes = new Elysia({ prefix: '/api/websocket' })
	.post(
		'/payment',
		async ({ body }) => {
			const metadata = body.metadata
			const cardNumber =
				typeof metadata?.cardNumber === 'string'
					? metadata.cardNumber
					: '**** **** **** 1234'

			const payment = await paymentRepo.createPayment(
				PaymentType.WEBSOCKET_OTP,
				body.amount,
				{
					cardNumber,
					otpSent: false,
				},
			)

			return {
				success: true,
				data: {
					...payment,
					createdAt: payment.createdAt.toISOString(),
					updatedAt: payment.updatedAt.toISOString(),
				},
			}
		},
		{
			body: t.Object({
				type: t.Literal('websocket-otp'),
				amount: t.Number({ minimum: 0 }),
				metadata: t.Object({
					cardNumber: t.String(),
				}),
			}),
		},
	)

	.ws('/payment/:id', {
		params: t.Object({
			id: t.String(),
		}),
		message: async (ws, message) => {
			const { type, otp } = message as WebSocketMessage

			try {
				if (type === 'start_payment') {
					const payment = await paymentRepo.getPayment(ws.data.params.id)
					if (!payment) {
						ws.send(
							JSON.stringify({
								type: 'error',
								message: 'Payment not found',
							}),
						)
						return
					}

					ws.send(
						JSON.stringify({
							type: 'status',
							status: PaymentStatus.PROCESSING,
							message: 'Processing credit card payment...',
							timestamp: new Date().toISOString(),
						}),
					)

					await paymentRepo.updatePaymentStatus(
						ws.data.params.id,
						PaymentStatus.PROCESSING,
					)

					setTimeout(async () => {
						const otpCode = Math.floor(
							100000 + Math.random() * 900000,
						).toString()

						ws.send(
							JSON.stringify({
								type: 'otp_sent',
								status: PaymentStatus.OTP_SENT,
								message: 'OTP sent to your registered mobile number',
								otp: otpCode,
								timestamp: new Date().toISOString(),
							}),
						)

						await paymentRepo.updatePaymentStatus(
							ws.data.params.id,
							PaymentStatus.OTP_SENT,
						)

						;(ws.data as WebSocketContext).otp = otpCode
					}, 6000)
				} else if (type === 'verify_otp') {
					const payment = await paymentRepo.getPayment(ws.data.params.id)
					if (!payment) {
						ws.send(
							JSON.stringify({
								type: 'error',
								message: 'Payment not found',
							}),
						)
						return
					}

					const context = ws.data as WebSocketContext
					const expectedOTP = context.otp
					const isValid = otp === expectedOTP

					if (isValid) {
						ws.send(
							JSON.stringify({
								type: 'status',
								status: PaymentStatus.OTP_VERIFIED,
								message: 'OTP verified successfully!',
								timestamp: new Date().toISOString(),
							}),
						)

						await paymentRepo.updatePaymentStatus(
							ws.data.params.id,
							PaymentStatus.OTP_VERIFIED,
						)

						setTimeout(async () => {
							const success = Math.random() > 0.1
							const finalStatus = success
								? PaymentStatus.COMPLETED
								: PaymentStatus.FAILED

							ws.send(
								JSON.stringify({
									type: 'status',
									status: finalStatus,
									message: success
										? 'Payment completed successfully!'
										: 'Payment failed - card declined',
									timestamp: new Date().toISOString(),
								}),
							)

							await paymentRepo.updatePaymentStatus(
								ws.data.params.id,
								finalStatus,
							)

							ws.send(
								JSON.stringify({
									type: 'complete',
									success,
									timestamp: new Date().toISOString(),
								}),
							)

							ws.close()
						}, 6000)
					} else {
						ws.send(
							JSON.stringify({
								type: 'error',
								message: 'Invalid OTP. Please try again.',
								timestamp: new Date().toISOString(),
							}),
						)
					}
				}
			} catch (error) {
				console.error('WebSocket error:', error)
				ws.send(
					JSON.stringify({
						type: 'error',
						message: 'Invalid message format',
						timestamp: new Date().toISOString(),
					}),
				)
			}
		},
		open: (ws) => {
			ws.send(
				JSON.stringify({
					type: 'connected',
					message: 'WebSocket connection established',
					timestamp: new Date().toISOString(),
				}),
			)
		},
		close: (ws) => {
			logger.info(
				{ paymentId: ws.data.params.id },
				'WebSocket connection closed',
			)
		},
	})
