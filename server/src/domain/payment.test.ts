import { describe, expect, it } from 'bun:test'
import { PaymentRepository, PaymentStatus, PaymentType } from './payment'

describe('Payment repository', () => {
  it('creates a payment', async () => {
    const paymentRepo = new PaymentRepository()
    const payment = await paymentRepo.createPayment(PaymentType.SSE_PIX, 100)
    expect(payment).toBeDefined()
    expect(payment.id).toBeDefined()
    expect(payment.type).toBe(PaymentType.SSE_PIX)
    expect(payment.amount).toBe(100)
  })

  it('gets a payment', async () => {
    const paymentRepo = new PaymentRepository()
    const payment = await paymentRepo.createPayment(PaymentType.SSE_PIX, 100)
    const retrievedPayment = await paymentRepo.getPayment(payment.id)
    expect(retrievedPayment).toBeDefined()
    expect(retrievedPayment?.id).toBe(payment.id)
    expect(retrievedPayment?.type).toBe(PaymentType.SSE_PIX)
    expect(retrievedPayment?.amount).toBe(100)
  })

  it('updates a payment status', async () => {
    const paymentRepo = new PaymentRepository()
    const payment = await paymentRepo.createPayment(PaymentType.SSE_PIX, 100)
    const updatedPayment = await paymentRepo.updatePaymentStatus(payment.id, PaymentStatus.PROCESSING)
    expect(updatedPayment).toBeDefined()
    expect(updatedPayment?.id).toBe(payment.id)
    expect(updatedPayment?.type).toBe(PaymentType.SSE_PIX)
    expect(updatedPayment?.amount).toBe(100)
    expect(updatedPayment?.status).toBe(PaymentStatus.PROCESSING)
  })

  it('processes a payment', async () => {
    const paymentRepo = new PaymentRepository()
    const payment = await paymentRepo.createPayment(PaymentType.SSE_PIX, 100)
    const processedPayment = await paymentRepo.processPayment(payment.id)
    expect(processedPayment).toBeDefined()
    expect(processedPayment?.id).toBe(payment.id)
    expect(processedPayment?.type).toBe(PaymentType.SSE_PIX)
    expect(processedPayment?.amount).toBe(100)
    expect(processedPayment?.status).toBe(PaymentStatus.PROCESSING)
  })

  it('completes a payment', async () => {
    const paymentRepo = new PaymentRepository()
    const payment = await paymentRepo.createPayment(PaymentType.SSE_PIX, 100)
    const completedPayment = await paymentRepo.completePayment(payment.id)
    expect(completedPayment).toBeDefined()
    expect(completedPayment?.id).toBe(payment.id)
    expect(completedPayment?.type).toBe(PaymentType.SSE_PIX)
    expect(completedPayment?.amount).toBe(100)
    expect(completedPayment?.status).toBe(PaymentStatus.COMPLETED)
  })
})