Bun.build({
	entrypoints: ['./src/index.ts'],
	outdir: './build',
	minify: true,
	splitting: true,
})
