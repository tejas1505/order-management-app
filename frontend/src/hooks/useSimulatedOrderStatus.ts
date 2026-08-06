import { useEffect, useState } from "react";
import { OrderStatus } from "../types";

// Real-time is mocked entirely on the frontend: rather than pushing events
// from a server, we derive "what status should this order be at right now"
// from how long ago it was created. This means opening the status page in a
// new tab, or refreshing it, still shows the correct simulated status - no
// backend push mechanism needed.
const SIMULATED_STEPS: { status: OrderStatus; atMs: number }[] = [
  { status: "ORDER_RECEIVED", atMs: 0 },
  { status: "PREPARING", atMs: 8000 },
  { status: "OUT_FOR_DELIVERY", atMs: 16000 },
  { status: "DELIVERED", atMs: 24000 },
];

function statusAtElapsed(elapsedMs: number): OrderStatus {
  let current: OrderStatus = SIMULATED_STEPS[0].status;
  for (const step of SIMULATED_STEPS) {
    if (elapsedMs >= step.atMs) current = step.status;
  }
  return current;
}

/**
 * Returns the simulated status for an order, updating live as time passes.
 * `createdAt` should be the order's creation timestamp (ISO string).
 */
export function useSimulatedOrderStatus(createdAt: string | undefined): OrderStatus | undefined {
  const [status, setStatus] = useState<OrderStatus | undefined>(undefined);

  useEffect(() => {
    if (!createdAt) {
      setStatus(undefined);
      return;
    }

    const createdAtMs = new Date(createdAt).getTime();

    function tick() {
      setStatus(statusAtElapsed(Date.now() - createdAtMs));
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [createdAt]);

  return status;
}
