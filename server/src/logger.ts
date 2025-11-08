import { createPinoLogger } from '@bogeychan/elysia-logger'

export const l = createPinoLogger({
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
		},
	},
})
