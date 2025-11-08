import { z } from 'zod'

export const CreatePaymentSchema = z.object({
	type: z.enum(['polling-stock', 'sse-pix', 'websocket-otp']),
	amount: z.number().positive(),
	metadata: z.unknown().optional(),
})

export const PaymentResponseSchema = z.object({
	id: z.string(),
	type: z.string(),
	amount: z.number(),
	status: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
	metadata: z.unknown().optional(),
})

export const OTPVerificationSchema = z.object({
	otp: z.string().length(6),
})

export type CreatePaymentRequest = z.infer<typeof CreatePaymentSchema>
export type PaymentResponse = z.infer<typeof PaymentResponseSchema>

export type OTPVerificationRequest = z.infer<typeof OTPVerificationSchema>
