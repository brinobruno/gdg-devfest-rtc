import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export const NavBar = () => {
	const location = useLocation()
	const [isDark, setIsDark] = useState(true)

	const applyTheme = (isDarkMode: boolean) => {
		setIsDark(isDarkMode)
		localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
		document.documentElement.classList.toggle('dark', isDarkMode)
	}

	useEffect(() => {
		const theme = localStorage.getItem('theme')
		applyTheme(theme ? theme === 'dark' : true)
	}, [])

	const toggleTheme = () => applyTheme(!isDark)

	const navItems = [
		{ path: '/polling', label: 'Polling', description: 'Stock Purchase' },
		{ path: '/sse', label: 'SSE', description: 'PIX Payment' },
		{ path: '/websocket', label: 'WebSocket', description: 'OTP Verification' },
	]

	return (
		<nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
			<div className="max-w-6xl mx-auto px-4 py-2">
				<div className="flex justify-between h-16">
					<div className="flex items-center">
						<Link to="/" className="flex items-center">
							<h1 className="text-xl font-bold text-devfest">
								DevFest RTC Demo
							</h1>
						</Link>
					</div>

					<div className="flex items-center space-x-8">
						<button
							onClick={toggleTheme}
							className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors"
						>
							{isDark ? 'Dark mode' : 'Light mode'}
						</button>
						{navItems.map((item) => {
							const isActive = location.pathname === item.path
							return (
								<Link
									key={item.path}
									to={item.path}
									className={`flex flex-col px-3 py-2 rounded-md text-sm font-medium transition-colors ${
										isActive
											? 'bg-blue-50 dark:bg-gray-700'
											: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
									}`}
								>
									<span className="text-lg">{item.label}</span>
									<span className="text-xs opacity-75">{item.description}</span>
								</Link>
							)
						})}
					</div>
				</div>
			</div>
		</nav>
	)
}
