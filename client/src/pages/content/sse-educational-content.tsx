export const SseEducationalContent = () => {
	return (
		<div className="card">
			<h3 className="text-lg font-semibold mb-3">🎓 Educational Context</h3>
			<div className="space-y-4 text-sm">
				<div>
					<h4 className="font-semibold text-blue-600 dark:text-blue-400">
						How SSE Works:
					</h4>
					<p className="text-gray-700 dark:text-gray-300">
						Server-Sent Events create a persistent HTTP connection where the
						server can push data to the client in real-time. The client opens an
						EventSource connection and listens for events.
					</p>
				</div>
				<div>
					<h4 className="font-semibold text-green-600 dark:text-green-400">
						When to Use:
					</h4>
					<ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
						<li>One-way real-time updates</li>
						<li>Live notifications</li>
						<li>Progress tracking</li>
						<li>Status updates</li>
						<li>Live feeds and dashboards</li>
					</ul>
				</div>
				<div>
					<h4 className="font-semibold text-yellow-600 dark:text-yellow-400">
						Pros:
					</h4>
					<ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
						<li>True real-time updates</li>
						<li>Lower server load than polling</li>
						<li>Automatic reconnection</li>
						<li>Works through firewalls</li>
						<li>Simple to implement</li>
					</ul>
				</div>
				<div>
					<h4 className="font-semibold text-red-600 dark:text-red-400">
						Cons:
					</h4>
					<ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
						<li>One-way communication only</li>
						<li>Limited browser support (older IE)</li>
						<li>Connection limits per domain</li>
						<li>No binary data support</li>
					</ul>
				</div>
				<div>
					<h4 className="font-semibold text-purple-600 dark:text-purple-400">
						E-commerce Use Cases:
					</h4>
					<ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
						<li>PIX payment confirmations</li>
						<li>Order status updates</li>
						<li>Live inventory notifications</li>
						<li>Real-time price changes</li>
						<li>Payment processing updates</li>
					</ul>
				</div>
			</div>
		</div>
	)
}
