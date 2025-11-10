export enum PaymentStatus {
	PENDING = 'pending',
	PROCESSING = 'processing',
	IN_TRANSIT = 'in_transit',
	OTP_SENT = 'otp_sent',
	OTP_VERIFIED = 'otp_verified',
	COMPLETED = 'completed',
	FAILED = 'failed',
	CANCELED = 'canceled',
}

export enum PaymentType {
	POLLING_STOCK = 'polling-stock',
	SSE_PIX = 'sse-pix',
	WEBSOCKET_OTP = 'websocket-otp',
}

export type PaymentMetadata = Record<string, string | number | boolean>

export interface Payment {
	id: string
	type: PaymentType
	amount: number
	status: PaymentStatus
	createdAt: Date
	updatedAt: Date
	metadata?: PaymentMetadata
}

export class PaymentRepository {
	private readonly payments: Map<string, Payment> = new Map()

	async createPayment(
		type: PaymentType,
		amount: number,
		metadata?: PaymentMetadata,
	): Promise<Payment> {
		const payment: Payment = {
			id: this.generateId(),
			type,
			amount,
			status: PaymentStatus.PENDING,
			createdAt: new Date(),
			updatedAt: new Date(),
			metadata,
		}

		this.payments.set(payment.id, payment)

		await this.simulateDelay()
		return payment
	}

	async getPayment(id: string): Promise<Payment | null> {
		await this.simulateDelay()
		return this.payments.get(id) || null
	}

	async updatePaymentStatus(
		id: string,
		status: PaymentStatus,
	): Promise<Payment | null> {
		const payment = this.payments.get(id)
		if (!payment) return null

		payment.status = status
		payment.updatedAt = new Date()

		await this.simulateDelay()
		return payment
	}

	async processPayment(id: string): Promise<Payment | null> {
		const payment = this.payments.get(id)
		if (!payment) return null

		payment.status = PaymentStatus.PROCESSING
		payment.updatedAt = new Date()

		await this.simulateDelay()
		return payment
	}

	async completePayment(
		id: string,
		success: boolean = true,
	): Promise<Payment | null> {
		const payment = this.payments.get(id)
		if (!payment) return null

		payment.status = success ? PaymentStatus.COMPLETED : PaymentStatus.FAILED
		payment.updatedAt = new Date()

		await this.simulateDelay()
		return payment
	}

	private generateId(): string {
		return Math.random().toString(36).substring(2, 15)
	}

	private async simulateDelay(): Promise<void> {
		const delay = Bun.env.NODE_ENV === 'test' ? 0 : 3000
		return new Promise((resolve) => setTimeout(resolve, delay))
	}
}
