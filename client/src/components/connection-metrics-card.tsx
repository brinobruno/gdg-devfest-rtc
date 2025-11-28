import type { ReactNode } from 'react'

type MetricsRow = {
	label: string
	value: ReactNode
	valueClassName?: string
}

type ConnectionMetricsCardProps = {
	title?: string
	rows: MetricsRow[]
}

export const ConnectionMetricsCard = ({
	title = '📊 Connection Metrics',
	rows,
}: ConnectionMetricsCardProps) => {
	return (
		<div className="card">
			<h3 className="text-lg font-semibold mb-3">{title}</h3>
			<div className="space-y-2 text-sm">
				{rows.map((row, idx) => (
					<div className="flex justify-between" key={`${row.label}-${idx}`}>
						<span>{row.label}</span>
						<span className={`font-mono ${row.valueClassName ?? ''}`}>
							{row.value}
						</span>
					</div>
				))}
			</div>
		</div>
	)
}
