import {
	Navigate,
	Route,
	BrowserRouter as Router,
	Routes,
} from 'react-router-dom'
import { NavBar } from './components/nav-bar'
import { PollingDemo } from './pages/polling-demo'
import { SSEDemo } from './pages/sse-demo'
import { WebSocketDemo } from './pages/web-socket-demo'

function App() {
	return (
		<Router>
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
				<NavBar />
				<Routes>
					<Route path="/" element={<Navigate to="/polling" replace />} />
					<Route path="/polling" element={<PollingDemo />} />
					<Route path="/sse" element={<SSEDemo />} />
					<Route path="/websocket" element={<WebSocketDemo />} />
				</Routes>
			</div>
		</Router>
	)
}

export default App
