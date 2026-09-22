# Live Trading Interface

A small React + TypeScript trading interface built for a take-home assignment.

## Features

- Asset list with simulated live price updates
- Local mock WebSocket layer
- Asset search
- Asset detail screen
- Quantity validation
- Mock trade endpoint
- Loading, success, and failure states
- Live connection status
- Responsive UI

## Tech stack

- React
- TypeScript
- Vite
- Native browser APIs
- No external UI framework

## Requirements

- Node.js 18+ recommended
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, normally:

```text
http://localhost:5173
```

## Production build

```bash
npm run build
npm run preview
```

## Mock WebSocket

The file `src/services/mockWebSocket.ts` acts as a lightweight local WebSocket server simulation. It emits a `PRICE_UPDATE` event approximately every second for a randomly selected asset.

A production implementation would replace this service with a real WebSocket connection.

## Mock trade API

`src/services/tradeApi.ts` simulates a trade endpoint with a short network delay.

The Asset Detail screen includes a Demo response selector so the success and failure flows can be demonstrated reliably during a recording.

## Key assumptions

- Market prices are simulated and are not real financial data.
- Only BUY orders are required by the assignment.
- Authentication is outside the scope of the task.
- No persistence/database is required.
- A local mock service is sufficient because the assignment explicitly asks for a mocked server.

## Architecture

```text
Mock WebSocket
      |
      v
useWebSocket
      |
      v
App state
      |
      +----> AssetList
      |
      +----> AssetDetail
                  |
                  v
             TradeForm
                  |
                  v
             Mock Trade API
```

## Interesting implementation detail

Incoming price updates use React's functional state update:

```ts
setAssets((currentAssets) =>
  currentAssets.map((asset) =>
    asset.symbol === update.symbol
      ? {
          ...asset,
          previousPrice: asset.price,
          price: update.price,
        }
      : asset
  )
);
```

This ensures each WebSocket event works against the latest state and avoids stale-state problems when updates arrive asynchronously.

## Possible improvements with more time

- Disconnect status change in connection Badge
- Real WebSocket backend
- Reconnection with exponential backoff
- Order history
- Unit and integration tests
- Authentication/authorization
- Price charts
- More order types
- Accessibility audit
- Better market-data subscription management
