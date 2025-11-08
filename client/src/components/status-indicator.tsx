interface StatusIndicatorProps {
	status: string
	message?: string
	className?: string
}

export const StatusIndicator = ({
	status,
	message,
	className = '',
}: StatusIndicatorProps) => {
	const getStatusConfig = (status: string) => {
		switch (status.toLowerCase()) {
			case 'pending':
				return {
					icon: '⏳',
					bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
					textColor: 'text-yellow-800 dark:text-yellow-300',
					borderColor: 'border-yellow-200 dark:border-yellow-800',
				}
			case 'processing':
				return {
					icon: '⚙️',
					bgColor: 'bg-blue-100 dark:bg-blue-900/30',
					textColor: 'text-blue-800 dark:text-blue-300',
					borderColor: 'border-blue-200 dark:border-blue-800',
				}
			case 'in_transit':
				return {
					icon: '🚚',
					bgColor: 'bg-purple-100 dark:bg-purple-900/30',
					textColor: 'text-purple-800 dark:text-purple-300',
					borderColor: 'border-purple-200 dark:border-purple-800',
				}
			case 'otp_sent':
				return {
					icon: '📱',
					bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
					textColor: 'text-indigo-800 dark:text-indigo-300',
					borderColor: 'border-indigo-200 dark:border-indigo-800',
				}
			case 'otp_verified':
				return {
					icon: '✅',
					bgColor: 'bg-green-100 dark:bg-green-900/30',
					textColor: 'text-green-800 dark:text-green-300',
					borderColor: 'border-green-200 dark:border-green-800',
				}
			case 'completed':
				return {
					icon: '🎉',
					bgColor: 'bg-green-100 dark:bg-green-900/30',
					textColor: 'text-green-800 dark:text-green-300',
					borderColor: 'border-green-200 dark:border-green-800',
				}
			case 'failed':
			case 'canceled':
				return {
					icon: '❌',
					bgColor: 'bg-red-100 dark:bg-red-900/30',
					textColor: 'text-red-800 dark:text-red-300',
					borderColor: 'border-red-200 dark:border-red-800',
				}
			default:
				return {
					icon: '❓',
					bgColor: 'bg-gray-100 dark:bg-gray-800',
					textColor: 'text-gray-800 dark:text-gray-300',
					borderColor: 'border-gray-200 dark:border-gray-700',
				}
		}
	}

	const config = getStatusConfig(status)

	return (
		<div
			className={`inline-flex items-center px-3 py-2 rounded-lg border ${config.bgColor} ${config.textColor} ${config.borderColor} ${className}`}
		>
			<span className="text-lg mr-2">{config.icon}</span>
			<div>
				<div className="font-medium capitalize">{status.replace('_', ' ')}</div>
				{message && <div className="text-sm opacity-75">{message}</div>}
			</div>
		</div>
	)
}
