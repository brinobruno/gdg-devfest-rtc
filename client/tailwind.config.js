/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				'gdg-blue': '#4285F4',
				'gdg-green': '#34A853',
				'gdg-yellow': '#FBBC04',
				'gdg-red': '#EA4335',
				devfest: '#1A73E8',
			},
			animation: {
				'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'bounce-slow': 'bounce 2s infinite',
			},
		},
	},
	plugins: [],
}
