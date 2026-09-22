import type { Asset } from "../types/trading";
import { ConnectionBadge } from "./ConnectionBadge";
import { TradeForm } from "./TradeForm";

interface Props {
  asset: Asset;
  status: "connecting" | "connected" | "disconnected" | "error";
  onBack: () => void;
}

export function AssetDetail({ asset, status, onBack }: Props) {
  const dayChange = asset.price - asset.dayOpen;
  const dayChangePercent = (dayChange / asset.dayOpen) * 100;
  const tickChange = asset.price - asset.previousPrice;

  return (
    <main className="page">
      <div className="detail-topbar">
        <button className="back-button" onClick={onBack}>
          ← Back to market
        </button>
        <ConnectionBadge status={status} />
      </div>

      <section className="detail-grid">
        <div className="detail-card">
          <div className="detail-title">
            <div className="symbol-badge">{asset.symbol.slice(0, 2)}</div>
            <div>
              <p className="eyebrow">{asset.sector.toUpperCase()}</p>
              <h1>{asset.name}</h1>
              <span>{asset.symbol}</span>
            </div>
          </div>

          <div className="big-price">
            <span>${asset.price.toFixed(2)}</span>
            <span className={tickChange >= 0 ? "up" : "down"}>
              {tickChange >= 0 ? "▲" : "▼"} {Math.abs(tickChange).toFixed(2)}
            </span>
          </div>

          <div className="metrics">
            <div>
              <span>Day open</span>
              <strong>${asset.dayOpen.toFixed(2)}</strong>
            </div>
            <div>
              <span>Day change</span>
              <strong className={dayChange >= 0 ? "up" : "down"}>
                {dayChange >= 0 ? "+" : ""}
                {dayChangePercent.toFixed(2)}%
              </strong>
            </div>
            <div>
              <span>Live feed</span>
              <strong>1 sec</strong>
            </div>
          </div>

          <div className="detail-note">
            <span className="pulse" />
            Price updates are simulated through a local WebSocket layer.
          </div>
        </div>

        <TradeForm asset={asset} />
      </section>
    </main>
  );
}