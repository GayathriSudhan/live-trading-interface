import type { ConnectionStatus } from "../types/trading";

interface Props {
  status: ConnectionStatus;
}

export function ConnectionBadge({ status }: Props) {
  const labels: Record<ConnectionStatus, string> = {
    connecting: "Connecting",
    connected: "Live",
    disconnected: "Disconnected",
    error: "Connection error",
  };

  return (
    <span className={`connection-badge ${status}`}>
      <span className="connection-dot" />
      {labels[status]}
    </span>
  );
}