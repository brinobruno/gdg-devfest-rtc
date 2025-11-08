FROM oven/bun:1.2.23

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .

EXPOSE 3000

RUN bun typecheck

RUN bun run build

CMD ["bun", "run", "start"]
