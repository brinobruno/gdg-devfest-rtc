export const PollingEducationalContent = () => {
	return (
		<div className="card">
			<h3 className="text-lg font-semibold mb-3">🎓 Educational Context</h3>
			<div className="space-y-4 text-sm">
				<div>
					<h4 className="font-semibold text-blue-600 dark:text-blue-400">
						How Polling Works:
					</h4>
					<p className="text-gray-700 dark:text-gray-300">
						The client repeatedly sends HTTP requests to the server at regular
						intervals (every 3-10 seconds in this demo) to check for updates.
						The server responds immediately with the current state.
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
	)
}
