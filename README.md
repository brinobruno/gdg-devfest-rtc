# DevFest RTC Demo Application

A comprehensive demonstration of Real-Time Communication (RTC) methods in e-commerce contexts, built for educational purposes.

## 🎯 Overview

This application showcases three different RTC approaches commonly used in e-commerce:

- **📊 Polling** - Stock purchase simulation with periodic status checks
- **📡 Server-Sent Events (SSE)** - PIX payment with real-time status updates
- **🔌 WebSockets** - Credit card payment with OTP verification

Each method demonstrates different use cases, trade-offs, and implementation patterns that developers encounter in real-world e-commerce applications.

## 🏗️ Stack

### Backend (Server)
- **Runtime**: Bun
- **Framework**: Elysia
- **Validation**: TypeBox (Elysia.t)
- **Pattern**: Domain-Driven Design (DDD)
- **Port**: 3000

### Frontend (Client)
- **Runtime**: Bun
- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **HTTP Client**: Axios
- **Port**: 5173

### Infrastructure
- **Orchestration**: Docker Compose
- **Development**: Hot reload enabled for both services

## 🚀 Quick Start

### Prerequisites
- [Docker](https://www.docker.com/) and Docker Compose installed
- [Bun](https://bun.sh/) installed (for dev)

### Running with Docker (Recommended)

```bash
git clone <repository-url>
cd devfest-01-rtc

docker-compose up

# Frontend: http://localhost:5173
# Backend API: http://localhost:3000
```

### Running Locally

```bash
# Terminal 1
cd server
bun install
bun run dev

# Terminal 2 
cd client
bun install
bun run dev

# Frontend: http://localhost:5173
# Backend API: http://localhost:3000
```

## 📚 Educational Content

### 1. Polling Demo (Stock Purchase)

**Scenario**: Simulating a stock purchase with periodic status checks

**How it works**:
- Client polls the server every 10 seconds (configurable) for status
- Server responds immediately with current state
- Simple HTTP GET requests with JSON responses

**Key Points**:
- Easiest to implement and debug
- Higher server load due to constant requests
- Not truly real-time (up to 2-4 seconds delay)
- Good for low-frequency updates

**E-commerce Use Cases**:
- Order status updates (every few minutes)
- Inventory level checks
- Price monitoring
- Simple notification systems

### 2. SSE Demo (PIX Payment)

**Scenario**: Simulating a PIX payment with real-time status updates

**How it works**:
- Client opens EventSource connection to server
- Server pushes status updates as they occur
- One-way communication (server → client)
- Automatic reconnection on connection loss

**Key Points**:
- True real-time updates
- Lower server load than polling
- One-way communication only
- Works through firewalls and proxies

**E-commerce Use Cases**:
- PIX payment confirmations
- Order status updates
- Live inventory notifications
- Real-time price changes
- Payment processing updates

### 3. WebSocket Demo (OTP Verification)

**Scenario**: Simulating credit card payment with OTP verification

**How it works**:
- Persistent bidirectional connection
- Both client and server can send messages
- Low latency communication
- Full-duplex data exchange

**Key Points**:
- True bidirectional real-time communication
- Lowest latency
- More complex to implement
- Requires connection state management

**E-commerce Use Cases**:
- OTP verification flows
- Live customer support chat
- Real-time bidding/auctions
- Collaborative shopping carts
- Live payment confirmations

### API Endpoints

#### Polling Endpoints
```
GET  /api/polling/stock              # Get all stocks
```

#### SSE Endpoints
```
POST /api/sse/payment                # Create payment
GET  /api/sse/payment/:id/stream     # SSE stream
```

#### WebSocket Endpoints
```
POST /api/websocket/payment          # Create payment
WS   /api/websocket/payment/:id      # WebSocket connection
```

## 🛠️ Development

### Project Structure
```
server/                    # Elysia backend
│   ├── src/
│   │   ├── domain/        # Domain entities and repositories
│   │   ├── routes/        # API route handlers
│   │   └── index.ts       # Main server file
│   ├── Dockerfile
│   └── package.json
client/                    # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Demo pages
│   │   ├── schemas/       # Client-side validation
│   │   ├── utils/         # API utilities
│   │   └── App.tsx        # Main app component
│   ├── Dockerfile
│   └── package.json
docker-compose.yml         # Service orchestration
README.md
```

### Key Features

- **Simulated Processing**: Fixed 6-second delays to demonstrate async operations
- **Visual Feedback**: Real-time status updates with animations
- **Connection Metrics**: Show request counts, connection status, latency
- **Console Logging**: Detailed technical explanations in browser console
- **Educational Context**: Bottom sections explaining each method
- **Error Handling**: Simulated failures for demonstration
- **Clean Code**: DDD structure, minimal comments

## 🤝 Contributing

This is an educational project designed for DevFest presentations. Contributions that improve the educational value, fix bugs, or enhance the demo experience are welcome.

## 📄 License

This project is created for educational purposes as part of DevFest presentations.
