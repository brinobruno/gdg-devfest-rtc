import { Elysia } from 'elysia'
import { logger } from '..'
import { StockRepository } from '../domain/stock'

const stockRepo = new StockRepository()

export const pollingRoutes = new Elysia({ prefix: '/api/polling' }).get(
	'/stock',
	async () => {
		try {
			const stocks = await stockRepo.getAllStocks()
			logger.info('Stocks fetched successfully')
			return {
				success: true,
				data: stocks.map((stock) => ({
					...stock,
					lastUpdated: stock.lastUpdated.toISOString(),
				})),
			}
		} catch (e) {
			logger.error(e, 'Error getting stocks')
			return {
				success: false,
				error: 'Error getting stocks',
			}
		}
	},
)
