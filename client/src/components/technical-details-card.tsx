type TechnicalDetailsItem = {
	label: string
	value: string
}

type Badge = {
	text: string
	className?: string
}

type TechnicalDetailsCardProps = {
	badge?: Badge
	endpoint?: string
	details: TechnicalDetailsItem[]
}

export const TechnicalDetailsCard = ({
	badge,
	endpoint,
	details,
}: TechnicalDetailsCardProps) => {
	return (
		<div className="card">
			<h3 className="text-lg font-semibold mb-3">🔍 Technical Details</h3>
			<div className="space-y-2 text-xs font-mono bg-gray-50 dark:bg-gray-700 p-3 rounded">
				{(badge || endpoint) && (
					<div>
						{badge && (
							<span className={`${badge.className}`}>{badge.text}</span>
						)}{' '}
						{endpoint}
					</div>
				)}
				{details.map((item, idx) => (
					<div key={`${item.label}-${item.label}-${idx}`}>
						<span className="text-gray-500 dark:text-gray-400">
							{item.label}:
						</span>{' '}
						{item.value}
					</div>
				))}
			</div>
		</div>
	)
}
