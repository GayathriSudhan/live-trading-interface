import type { TradeRequest, TradeResponse } from "../types/trading";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function executeTrade(
  request: TradeRequest,
  mode: "success" | "failure" = "success"
): Promise<TradeResponse> {
  await wait(900);

  if (mode === "failure") {
    throw new Error("Order rejected by the mock trading service.");
  }

  return {
    orderId: `ORD-${Date.now().toString().slice(-8)}`,
    symbol: request.symbol,
    quantity: request.quantity,
    side: request.side,
    executedPrice: 0, // Filled by the UI using the latest live price.
    timestamp: Date.now(),
  };
}