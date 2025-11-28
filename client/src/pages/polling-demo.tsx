import { Activity, useState } from 'react'
import { ConnectionMetricsCard } from '../components/connection-metrics-card'
import { TechnicalDetailsCard } from '../components/technical-details-card'
import { usePolling } from '../hooks/use-polling'
import type { StockPriceResponse } from '../schemas/stock'
import { VITE_API_BASE_URL } from '../utils/api'
import { PollingEducationalContent } from './content/polling-educational-content'

type Stock = StockPriceResponse['data'][number]

export const PollingDemo = () => {
	const [stocks, setStocks] = useState<Stock[]>([])
	const [selectedStock, setSelectedStock] = useState<Stock | null>(null)

	const { loading: stocksLoading, requestCount: stocksRequestCount } =
		usePolling<StockPriceResponse>(`${VITE_API_BASE_URL}/api/polling/stock`, {
			interval: 10000, // 10s
			enabled: true,
			maxTime: 30000, // 30s
			onSuccess: (data) => {
				if (data.success) {
					setStocks(data.data)
					if (selectedStock) {
						const updatedStock = data.data.find(
							(s) => s.symbol === selectedStock.symbol,
						)
						if (updatedStock) {
							setSelectedStock(updatedStock)
						}
					} else {
						setSelectedStock(data.data[0])
					}
				}
			},
		})

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="max-w-6xl mx-auto px-4 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div className="space-y-6">
						<div className="card">
							<h2 className="text-2xl font-bold mb-4">
								📊 Stock Purchase (Polling)
							</h2>

							<Activity
								mode={
									stocksLoading && stocks.length <= 0 ? 'visible' : 'hidden'
								}
							>
								loading...
							</Activity>

							<Activity mode={stocks.length > 0 ? 'visible' : 'hidden'}>
								<div>
									<div className="mb-6">
										<span className="block text-sm font-medium mb-2">
											Select Stock:
										</span>
										<div className="grid grid-cols-2 gap-2">
											{stocks.map((stock) => (
												<button
													key={stock.symbol}
													onClick={() => setSelectedStock(stock)}
													className={`p-3 rounded-lg border text-left transition-colors ${
														selectedStock?.symbol === stock.symbol
															? 'border-devfest bg-blue-50 dark:bg-gray-700'
															: 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
													}`}
												>
													<div className="font-semibold">{stock.symbol}</div>
													<div className="text-sm text-gray-600 dark:text-gray-400">
														${stock.price.toFixed(2)}
														<span
															className={`ml-2 ${stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
														>
															{stock.change >= 0 ? '+' : ''}
															{stock.change.toFixed(2)} (
															{stock.changePercent.toFixed(2)}%)
														</span>
													</div>
												</button>
											))}
										</div>
									</div>

									<div className="mb-6">
										<button
											disabled
											className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
										>
											{`Buy ${selectedStock?.symbol} for $${selectedStock?.price.toFixed(2)}`}
										</button>
									</div>
								</div>
							</Activity>
						</div>

						<ConnectionMetricsCard
							title="📈 Connection Metrics"
							rows={[
								{
									label: 'Stock Polling:',
									value: stocksLoading ? 'Polling...' : 'Active',
									valueClassName: stocksLoading
										? 'text-blue-600 dark:text-blue-400'
										: 'text-green-600 dark:text-green-400',
								},
								{ label: 'Stock Requests:', value: stocksRequestCount },
								{ label: 'Stock Interval:', value: '10s' },
								{ label: 'Payment Interval:', value: '3s' },
							]}
						/>
					</div>

					<div className="space-y-6">
						<PollingEducationalContent />

						<TechnicalDetailsCard
							badge={{
								text: 'GET',
								className: 'text-blue-600 dark:text-blue-400',
							}}
							endpoint="/api/polling/stock"
							details={[
								{ label: 'Method', value: 'HTTP GET' },
								{ label: 'Response', value: 'JSON' },
								{ label: 'Headers', value: 'Content-Type: application/json' },
							]}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
