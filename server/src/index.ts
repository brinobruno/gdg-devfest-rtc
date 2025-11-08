import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'
import { l } from './logger'
import { pollingRoutes } from './routes/polling'
import { sseRoutes } from './routes/sse'
import { websocketRoutes } from './routes/websocket'

export const logger = l

export const app = new Elysia()
	.use(
		cors({
			origin: true,
			credentials: true,
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control'],
		}),
	)
	.get('/health', () => {
		logger.info('Health check')
		return {
			status: 'ok',
		}
	})
	.use(pollingRoutes)
	.use(sseRoutes)
	.use(websocketRoutes)
	.listen(3000)

if (Bun.env.NODE_ENV !== 'test') {
	console.log(`RTC API is running at ${app.server?.hostname}:${app.server?.port}`)
	console.log(`📊 Available endpoints:`)
	console.log(`   - Polling: http://localhost:3000/api/polling`)
	console.log(`   - SSE: http://localhost:3000/api/sse`)
	console.log(`   - WebSocket: ws://localhost:3000/api/websocket`)
}
