export interface Asset {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  previousPrice: number;
  dayOpen: number;
}

export interface PriceUpdate {
  type: "PRICE_UPDATE";
  symbol: string;
  price: number;
  timestamp: number;
}

export interface TradeRequest {
  symbol: string;
  quantity: number;
  side: "BUY";
}

export interface TradeResponse {
  orderId: string;
  symbol: string;
  quantity: number;
  side: "BUY";
  executedPrice: number;
  timestamp: number;
}

export type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";