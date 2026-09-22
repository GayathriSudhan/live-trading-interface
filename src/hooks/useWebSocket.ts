import { useEffect, useState } from "react";
import { mockWebSocket } from "../services/mockWebSocket";
import type { Asset, ConnectionStatus } from "../types/trading";

export function useWebSocket() {
  const [assets, setAssets] = useState<Asset[]>(() =>
    mockWebSocket.getInitialAssets()
  );
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribePrice = mockWebSocket.subscribe((update) => {
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
      setLastUpdated(update.timestamp);
    });

    const unsubscribeStatus = mockWebSocket.subscribeStatus((nextStatus) => {
      setStatus(nextStatus);
    });

    mockWebSocket.connect();

    return () => {
      unsubscribePrice();
      unsubscribeStatus();
      mockWebSocket.disconnect();
    };
  }, []);

  return { assets, status, lastUpdated };
}