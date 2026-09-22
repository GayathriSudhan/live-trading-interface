import { useMemo, useState } from "react";
import type { Asset } from "../types/trading";
import { AssetRow } from "./AssetRow";
import { ConnectionBadge } from "./ConnectionBadge";

interface Props {
  assets: Asset[];
  status: "connecting" | "connected" | "disconnected" | "error";
  lastUpdated: number | null;
  onSelect: (symbol: string) => void;
}

export function AssetList({
  assets,
  status,
  lastUpdated,
  onSelect,
}: Props) {
  const [search, setSearch] = useState("");

  const filteredAssets = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return assets;

    return assets.filter(
      (asset) =>
        asset.symbol.toLowerCase().includes(query) ||
        asset.name.toLowerCase().includes(query)
    );
  }, [assets, search]);

  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">MARKET WATCH</p>
          <h1>Live Trading</h1>
          <p className="subtitle">
            Monitor simulated market prices and place a mock order.
          </p>
        </div>

        <div className="live-panel">
          <ConnectionBadge status={status} />
          {lastUpdated && (
            <span className="last-update">
              Updated {new Date(lastUpdated).toLocaleTimeString()}
            </span>
          )}
        </div>
      </section>

      <section className="market-card">
        <div className="market-toolbar">
          <div>
            <h2>Assets</h2>
            <p>{assets.length} instruments available</p>
          </div>

          <label className="search">
            <span>⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search symbol or name"
              aria-label="Search assets"
            />
          </label>
        </div>

        <div className="asset-header">
          <span>Asset</span>
          <span>Sector</span>
          <span>Price</span>
          <span>Day change</span>
          <span />
        </div>

        <div>
          {filteredAssets.length > 0 ? (
            filteredAssets.map((asset) => (
              <AssetRow key={asset.symbol} asset={asset} onSelect={onSelect} />
            ))
          ) : (
            <div className="empty-state">No assets match your search.</div>
          )}
        </div>
      </section>
    </main>
  );
}