FROM oven/bun:1.2.23

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

EXPOSE 5173

RUN bun run build

CMD ["bun", "run", "preview", "--host", "0.0.0.0", "--port", "5173"]
