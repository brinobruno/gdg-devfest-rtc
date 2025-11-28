export const WebSocketEducationalContent = () => {
	return (
		<div className="card">
			<h3 className="text-lg font-semibold mb-3">🎓 Educational Context</h3>
			<div className="space-y-4 text-sm">
				<div>
					<h4 className="font-semibold text-blue-600 dark:text-blue-400">
						How WebSockets Work:
					</h4>
					<p className="text-gray-700 dark:text-gray-300">
						WebSockets establish a persistent, full-duplex connection between client and server.
						Both sides can send messages at any time without the overhead of HTTP headers.
					</p>
				</div>
				<div>
					<h4 className="font-semibold text-green-600 dark:text-green-400">
						When to Use:
					</h4>
					<ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
						<li>Bidirectional real-time communication</li>
						<li>Interactive applications</li>
						<li>Collaborative tools</li>
						<li>Gaming applications</li>
						<li>Live chat systems</li>
					</ul>
				</div>
				<div>
					<h4 className="font-semibold text-yellow-600 dark:text-yellow-400">
						Pros:
					</h4>
					<ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
						<li>True real-time bidirectional communication</li>
						<li>Low latency</li>
						<li>Efficient (no HTTP overhead)</li>
						<li>Supports binary data</li>
						<li>Persistent connection</li>
					</ul>
				</div>
				<div>
					<h4 className="font-semibold text-red-600 dark:text-red-400">
						Cons:
					</h4>
					<ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
						<li>More complex to implement</li>
						<li>Firewall/proxy issues</li>
						<li>Connection state management</li>
						<li>Higher resource usage</li>
						<li>No automatic reconnection</li>
					</ul>
				</div>
				<div>
					<h4 className="font-semibold text-purple-600 dark:text-purple-400">
						E-commerce Use Cases:
					</h4>
					<ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
						<li>OTP verification flows</li>
						<li>Live customer support chat</li>
						<li>Real-time bidding/auctions</li>
						<li>Collaborative shopping carts</li>
						<li>Live payment confirmations</li>
					</ul>
				</div>
			</div>
		</div>
	)
}

