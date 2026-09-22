import type { Asset, PriceUpdate } from "../types/trading";

const INITIAL_ASSETS: Asset[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    sector: "Technology",
    price: 226.31,
    previousPrice: 225.74,
    dayOpen: 224.92,
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    sector: "Automotive",
    price: 341.52,
    previousPrice: 343.16,
    dayOpen: 344.08,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    sector: "Technology",
    price: 511.28,
    previousPrice: 509.96,
    dayOpen: 508.74,
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    sector: "Technology",
    price: 254.12,
    previousPrice: 253.48,
    dayOpen: 252.96,
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    sector: "Consumer",
    price: 231.44,
    previousPrice: 232.11,
    dayOpen: 233.02,
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    sector: "Semiconductors",
    price: 176.84,
    previousPrice: 175.92,
    dayOpen: 174.76,
  },
];

type PriceListener = (update: PriceUpdate) => void;
type StatusListener = (status: "connected" | "disconnected" | "error") => void;

class MockWebSocketServer {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private listeners = new Set<PriceListener>();
  private statusListeners = new Set<StatusListener>();
  private assets = new Map(INITIAL_ASSETS.map((asset) => [asset.symbol, asset]));

  connect() {
    this.notifyStatus("connected");

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(() => {
      const assets = Array.from(this.assets.values());
      const asset = assets[Math.floor(Math.random() * assets.length)];

      // Small simulated market movement, intentionally kept realistic-looking.
      const movement = (Math.random() - 0.5) * 1.4;
      const nextPrice = Math.max(0.01, Number((asset.price + movement).toFixed(2)));

      this.assets.set(asset.symbol, {
        ...asset,
        previousPrice: asset.price,
        price: nextPrice,
      });

      const update: PriceUpdate = {
        type: "PRICE_UPDATE",
        symbol: asset.symbol,
        price: nextPrice,
        timestamp: Date.now(),
      };

      this.listeners.forEach((listener) => listener(update));
    }, 1000);
  }

  disconnect() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.notifyStatus("disconnected");
  }

  subscribe(listener: PriceListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  subscribeStatus(listener: StatusListener) {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }

  getInitialAssets() {
    return INITIAL_ASSETS.map((asset) => ({ ...asset }));
  }

  private notifyStatus(status: "connected" | "disconnected" | "error") {
    this.statusListeners.forEach((listener) => listener(status));
  }
}

export const mockWebSocket = new MockWebSocketServer();