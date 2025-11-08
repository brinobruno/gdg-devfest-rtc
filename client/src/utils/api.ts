import axios from 'axios'
import type { CreatePaymentRequest } from '../schemas/payment'

const API_BASE_URL = 'http://localhost:3000'

export const api = axios.create({
	baseURL: API_BASE_URL,
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
		new EventSource(`${API_BASE_URL}/api/sse/payment/${id}/stream`),
}

export const websocketApi = {
	createPayment: (data: CreatePaymentRequest) =>
		api.post('/api/websocket/payment', data),
	connectPayment: (id: string) =>
		new WebSocket(`ws://localhost:3000/api/websocket/payment/${id}`),
}
