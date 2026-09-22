import type { Asset } from "../types/trading";

interface Props {
  asset: Asset;
  onSelect: (symbol: string) => void;
}

export function AssetRow({ asset, onSelect }: Props) {
  const change = asset.price - asset.previousPrice;
  const dayChange = asset.price - asset.dayOpen;
  const dayChangePercent = (dayChange / asset.dayOpen) * 100;
  const direction = change > 0 ? "up" : change < 0 ? "down" : "flat";

  return (
    <button className="asset-row" onClick={() => onSelect(asset.symbol)}>
      <div className="asset-identity">
        <span className="symbol">{asset.symbol}</span>
        <span className="asset-name">{asset.name}</span>
      </div>

      <div className="asset-sector">{asset.sector}</div>

      <div className="asset-price">
        <span>${asset.price.toFixed(2)}</span>
        <span className={`tick ${direction}`}>
          {change > 0 ? "▲" : change < 0 ? "▼" : "•"}{" "}
          {Math.abs(change).toFixed(2)}
        </span>
      </div>

      <div className={`day-change ${dayChange >= 0 ? "up" : "down"}`}>
        {dayChange >= 0 ? "+" : ""}
        {dayChangePercent.toFixed(2)}%
      </div>

      <span className="row-arrow">→</span>
    </button>
  );
}