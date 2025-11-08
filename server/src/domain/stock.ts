export interface StockPrice {
	symbol: string
	price: number
	change: number
	changePercent: number
	lastUpdated: Date
}

export class StockRepository {
	private readonly stocks: Map<string, StockPrice> = new Map()

	constructor() {
		this.initializeStocks()
	}

	private initializeStocks() {
		const stockData = [
			{ symbol: 'AAPL', basePrice: 150 },
			{ symbol: 'GOOGL', basePrice: 140 },
			{ symbol: 'MSFT', basePrice: 300 },
			{ symbol: 'TSLA', basePrice: 200 },
			{ symbol: 'AMZN', basePrice: 130 },
		]

		stockData.forEach(({ symbol, basePrice }) => {
			const variation = (Math.random() - 0.5) * 0.1
			const price = basePrice * (1 + variation)

			this.stocks.set(symbol, {
				symbol,
				price: price,
				change: 0,
				changePercent: 0,
				lastUpdated: new Date(),
			})
		})
	}

	async getStockPrice(symbol: string): Promise<StockPrice | null> {
		await this.simulateDelay()

		const stock = this.stocks.get(symbol)
		if (!stock) return null

		const volatility = Math.random() * 0.015 + 0.005
		const direction = Math.random() > 0.5 ? 1 : -1
		const changePercent = direction * volatility
		const change = stock.price * changePercent
		const newPrice = Math.max(1, stock.price + change)

		stock.price = newPrice
		stock.change = change
		stock.changePercent = changePercent * 100
		stock.lastUpdated = new Date()

		return stock
	}

	async getAllStocks(): Promise<StockPrice[]> {
		await this.simulateDelay()

		for (const stock of this.stocks.values()) {
			const volatility = Math.random() * 0.012 + 0.003
			const direction = Math.random() > 0.5 ? 1 : -1
			const changePercent = direction * volatility
			const change = stock.price * changePercent
			const newPrice = Math.max(1, stock.price + change)

			stock.price = newPrice
			stock.change = change
			stock.changePercent = changePercent * 100
			stock.lastUpdated = new Date()
		}

		return Array.from(this.stocks.values())
	}

	private async simulateDelay(): Promise<void> {
		const delay = Bun.env.NODE_ENV === 'test' ? 0 : 6000
		return new Promise((resolve) => setTimeout(resolve, delay))
	}
}
