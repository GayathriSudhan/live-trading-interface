import { useMemo, useState } from "react";
import { AssetDetail } from "./components/AssetDetail";
import { AssetList } from "./components/AssetList";
import { useWebSocket } from "./hooks/useWebSocket";

function App() {
  const { assets, status, lastUpdated } = useWebSocket();
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

  const selectedAsset = useMemo(
    () => assets.find((asset) => asset.symbol === selectedSymbol) ?? null,
    [assets, selectedSymbol]
  );

  if (selectedAsset) {
    return (
      <AssetDetail
        asset={selectedAsset}
        status={status}
        onBack={() => setSelectedSymbol(null)}
      />
    );
  }

  return (
    <AssetList
      assets={assets}
      status={status}
      lastUpdated={lastUpdated}
      onSelect={setSelectedSymbol}
    />
  );
}

export default App;