import { Elysia, sse, t } from 'elysia'
import {
	PaymentRepository,
	PaymentStatus,
	PaymentType,
} from '../domain/payment'

const paymentRepo = new PaymentRepository()

export const sseRoutes = new Elysia({ prefix: '/api/sse' })
	.post(
		'/payment',
		async ({ body }) => {
			const metadata = body.metadata
			const pixKey = metadata.pixKey

			const payment = await paymentRepo.createPayment(
				PaymentType.SSE_PIX,
				body.amount,
				{ pixKey },
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
				type: t.Literal('sse-pix'),
				amount: t.Number({ minimum: 0 }),
				metadata: t.Object({
					pixKey: t.String(),
				}),
			}),
		},
	)

	.get(
		'/payment/:id/stream',
		async function* ({ params, set }) {
			const payment = await paymentRepo.getPayment(params.id)
			if (!payment) {
				set.status = 404
				return { error: 'Payment not found' }
			}

			try {
				yield sse({
					event: 'status',
					data: {
						type: 'status',
						status: PaymentStatus.PENDING,
						message: 'Payment initiated, waiting for PIX confirmation...',
						timestamp: new Date().toISOString(),
					},
				})

				await new Promise((resolve) => setTimeout(resolve, 6000))

				yield sse({
					event: 'status',
					data: {
						type: 'status',
						status: PaymentStatus.PROCESSING,
						message: 'PIX payment detected, processing...',
						timestamp: new Date().toISOString(),
					},
				})

				await paymentRepo.updatePaymentStatus(
					params.id,
					PaymentStatus.PROCESSING,
				)

				await new Promise((resolve) => setTimeout(resolve, 6000))

				yield sse({
					event: 'status',
					data: {
						type: 'status',
						status: PaymentStatus.IN_TRANSIT,
						message: 'Payment in transit to merchant account...',
						timestamp: new Date().toISOString(),
					},
				})

				await paymentRepo.updatePaymentStatus(
					params.id,
					PaymentStatus.IN_TRANSIT,
				)

				await new Promise((resolve) => setTimeout(resolve, 6000))

				const success = Math.random() > 0.1
				const finalStatus = success
					? PaymentStatus.COMPLETED
					: PaymentStatus.FAILED

				yield sse({
					event: 'status',
					data: {
						type: 'status',
						status: finalStatus,
						message: success
							? 'Payment completed successfully!'
							: 'Payment failed due to insufficient funds',
						timestamp: new Date().toISOString(),
					},
				})

				await paymentRepo.updatePaymentStatus(params.id, finalStatus)

				yield sse({
					event: 'complete',
					data: {
						type: 'complete',
						success,
						timestamp: new Date().toISOString(),
					},
				})
			} catch (error) {
				console.error('Payment processing failed:', error)
				yield sse({
					event: 'error',
					data: {
						type: 'error',
						error: 'Payment processing failed',
						timestamp: new Date().toISOString(),
					},
				})
			}
		},
		{
			params: t.Object({
				id: t.String(),
			}),
		},
	)
