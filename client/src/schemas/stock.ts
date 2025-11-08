import { z } from 'zod'

export const StockPriceSchema = z.object({
	symbol: z.string(),
	price: z.number(),
	change: z.number(),
	changePercent: z.number(),
	lastUpdated: z.string(),
})

export const StockPriceResponseSchema = z.object({
	data: z.array(StockPriceSchema),
	success: z.boolean(),
})

export type StockPriceResponse = z.infer<typeof StockPriceResponseSchema>
