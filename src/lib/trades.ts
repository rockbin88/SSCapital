import tradesJson from "../data/trades.json";

export type Trade = {
  id: number;
  ticker: string;
  strategy: string;
  quantity: number;
  entryPrice: string;
  exitPrice: string;
  profit: string;
  executedBy: string;
};

export function getTrades(): Trade[] {
  return tradesJson as Trade[];
}

export function parseTradeProfit(profit: string): number | null {
  if (!profit || profit === "—") return null;

  const isLoss = profit.startsWith("(") && profit.endsWith(")");
  const normalized = profit.replace(/[()$,]/g, "");
  const value = Number(normalized);

  if (Number.isNaN(value)) return null;
  return isLoss ? -value : value;
}

export function isClosedTrade(trade: Trade): boolean {
  return trade.exitPrice !== "—" && parseTradeProfit(trade.profit) !== null;
}

export function getTradeStats() {
  const closedTrades = getTrades().filter(isClosedTrade);
  const wins = closedTrades.filter((trade) => (parseTradeProfit(trade.profit) ?? 0) > 0).length;
  const losses = closedTrades.length - wins;
  const winRatePct = closedTrades.length ? (wins / closedTrades.length) * 100 : 0;

  return {
    closedTrades: closedTrades.length,
    openTrades: getTrades().length - closedTrades.length,
    wins,
    losses,
    winRatePct,
  };
}
