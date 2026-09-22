import { useMemo, useState } from "react";
import type { Asset } from "../types/trading";
import { executeTrade } from "../services/tradeApi";

interface Props {
  asset: Asset;
}

type TradeState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; orderId: string }
  | { status: "error"; message: string };

export function TradeForm({ asset }: Props) {
  const [quantity, setQuantity] = useState("10");
  const [tradeState, setTradeState] = useState<TradeState>({
    status: "idle",
  });
  const [demoMode, setDemoMode] = useState<"success" | "failure">("success");

  const numericQuantity = Number(quantity);
  const isValidQuantity =
    Number.isInteger(numericQuantity) && numericQuantity > 0;

  const estimatedValue = useMemo(
    () => (isValidQuantity ? numericQuantity * asset.price : 0),
    [asset.price, isValidQuantity, numericQuantity]
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidQuantity) {
      setTradeState({
        status: "error",
        message: "Enter a whole-number quantity greater than 0.",
      });
      return;
    }

    setTradeState({ status: "loading" });

    try {
      const response = await executeTrade(
        {
          symbol: asset.symbol,
          quantity: numericQuantity,
          side: "BUY",
        },
        demoMode
      );

      setTradeState({
        status: "success",
        orderId: response.orderId,
      });
    } catch (error) {
      setTradeState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to execute the order.",
      });
    }
  };

  return (
    <section className="trade-card">
      <div className="trade-heading">
        <div>
          <p className="eyebrow">ORDER TICKET</p>
          <h2>Buy {asset.symbol}</h2>
        </div>
        <span className="buy-pill">BUY</span>
      </div>

      <form onSubmit={handleSubmit}>
        <label className="field-label" htmlFor="quantity">
          Quantity
        </label>

        <input
          id="quantity"
          className="quantity-input"
          type="number"
          min="1"
          step="1"
          value={quantity}
          onChange={(event) => {
            setQuantity(event.target.value);
            setTradeState({ status: "idle" });
          }}
        />

        <div className="estimate">
          <span>Estimated order value</span>
          <strong>${estimatedValue.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}</strong>
        </div>

        <div className="demo-control">
          <span>Demo response</span>
          <div className="segmented">
            <button
              type="button"
              className={demoMode === "success" ? "selected" : ""}
              onClick={() => setDemoMode("success")}
            >
              Success
            </button>
            <button
              type="button"
              className={demoMode === "failure" ? "selected" : ""}
              onClick={() => setDemoMode("failure")}
            >
              Failure
            </button>
          </div>
        </div>

        <button
          className="trade-button"
          type="submit"
          disabled={tradeState.status === "loading"}
        >
          {tradeState.status === "loading"
            ? "Executing order..."
            : `Buy ${asset.symbol}`}
        </button>

        {tradeState.status === "success" && (
          <div className="feedback success" role="status">
            <strong>Order executed successfully.</strong>
            <span>Order ID: {tradeState.orderId}</span>
          </div>
        )}

        {tradeState.status === "error" && (
          <div className="feedback error" role="alert">
            <strong>Trade failed</strong>
            <span>{tradeState.message}</span>
          </div>
        )}
      </form>
    </section>
  );
}