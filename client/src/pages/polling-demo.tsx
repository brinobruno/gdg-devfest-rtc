import { Activity, useState } from 'react'
import { usePolling } from '../hooks/use-polling'
import type { StockPriceResponse } from '../schemas/stock'

type Stock = StockPriceResponse['data'][number]

export const PollingDemo = () => {
	const [stocks, setStocks] = useState<Stock[]>([])
	const [selectedStock, setSelectedStock] = useState<Stock | null>(null)

	const {
		loading: stocksLoading,
		requestCount: stocksRequestCount,
	} = usePolling<StockPriceResponse>(
		'http://localhost:3000/api/polling/stock',
		{
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
		},
	)

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

						<div className="card">
							<h3 className="text-lg font-semibold mb-3">
								📈 Connection Metrics
							</h3>
							<div className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span>Stock Polling:</span>
									<span
										className={`font-mono ${stocksLoading ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`}
									>
										{stocksLoading ? 'Polling...' : 'Active'}
									</span>
								</div>
								<div className="flex justify-between">
									<span>Stock Requests:</span>
									<span className="font-mono">{stocksRequestCount}</span>
								</div>
								<div className="flex justify-between">
									<span>Stock Interval:</span>
									<span className="font-mono">10s</span>
								</div>
								<div className="flex justify-between">
									<span>Payment Interval:</span>
									<span className="font-mono">3s</span>
								</div>
							</div>
						</div>
					</div>

					<div className="space-y-6">
						<div className="card">
							<h3 className="text-lg font-semibold mb-3">
								🎓 Educational Context
							</h3>
							<div className="space-y-4 text-sm">
								<div>
									<h4 className="font-semibold text-blue-600 dark:text-blue-400">
										How Polling Works:
									</h4>
									<p className="text-gray-700 dark:text-gray-300">
										The client repeatedly sends HTTP requests to the server at
										regular intervals (every 3-10 seconds in this demo) to check
										for updates. The server responds immediately with the
										current state.
									</p>
								</div>

								<div>
									<h4 className="font-semibold text-green-600 dark:text-green-400">
										When to Use:
									</h4>
									<ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
										<li>Simple, low-frequency updates</li>
										<li>When real-time isn't critical</li>
										<li>Stock prices, weather updates</li>
										<li>Status checks that don't change often</li>
									</ul>
								</div>

								<div>
									<h4 className="font-semibold text-yellow-600 dark:text-yellow-400">
										Pros:
									</h4>
									<ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
										<li>Simple to implement</li>
										<li>Works with standard HTTP</li>
										<li>No special server configuration</li>
										<li>Easy to debug and monitor</li>
									</ul>
								</div>

								<div>
									<h4 className="font-semibold text-red-600 dark:text-red-400">
										Cons:
									</h4>
									<ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
										<li>Higher server load (constant requests)</li>
										<li>Not truly real-time</li>
										<li>Wastes bandwidth when no updates</li>
										<li>Can miss rapid changes between polls</li>
									</ul>
								</div>

								<div>
									<h4 className="font-semibold text-purple-600 dark:text-purple-400">
										E-commerce Use Cases:
									</h4>
									<ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
										<li>Order status updates (every few minutes)</li>
										<li>Inventory level checks</li>
										<li>Price monitoring</li>
										<li>Simple notification systems</li>
									</ul>
								</div>
							</div>
						</div>

						<div className="card">
							<h3 className="text-lg font-semibold mb-3">
								🔍 Technical Details
							</h3>
							<div className="space-y-2 text-xs font-mono bg-gray-50 dark:bg-gray-700 p-3 rounded">
								<div>
									<span className="text-blue-600 dark:text-blue-400">GET</span>{' '}
									/api/polling/stock
								</div>
								<div>
									<span className="text-gray-500 dark:text-gray-400">
										Method:
									</span>{' '}
									HTTP GET
								</div>
								<div>
									<span className="text-gray-500 dark:text-gray-400">
										Response:
									</span>{' '}
									JSON
								</div>
								<div>
									<span className="text-gray-500 dark:text-gray-400">
										Headers:
									</span>{' '}
									Content-Type: application/json
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
