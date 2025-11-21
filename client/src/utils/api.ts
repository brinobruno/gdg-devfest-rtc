import axios from 'axios'
import type { CreatePaymentRequest } from '../schemas/payment'

export const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const api = axios.create({
	baseURL: VITE_API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
})

export const pollingApi = {
	getStocks: () => api.get('/api/polling/stock'),
}

export const sseApi = {
	createPayment: (data: CreatePaymentRequest) =>
		api.post('/api/sse/payment', data),
	getPaymentStream: (id: string) =>
		new EventSource(`${VITE_API_BASE_URL}/api/sse/payment/${id}/stream`),
}

export const websocketApi = {
	createPayment: (data: CreatePaymentRequest) =>
		api.post('/api/websocket/payment', data),
	connectPayment: (id: string) =>
		new WebSocket(`ws://localhost:3000/api/websocket/payment/${id}`),
}
