import pnlJson from "../data/pnl.json";
import pnlCsvRaw from "../data/pnl.csv?raw";

export type EquityPoint = {
  date: string;
  equity: number;
};

export type PnLSummary = {
  ytdReturnPct: number;
  ytdReturnUsd: number;
  winRatePct: number;
  asOf?: string;
};

export type PnLData = {
  summary: PnLSummary;
  equityCurve: EquityPoint[];
};

function parseCsv(raw: string): EquityPoint[] {
  const lines = raw.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  const header = lines[0].toLowerCase().split(",").map((h) => h.trim());
  const dateIdx = header.findIndex((h) => h === "date" || h === "day");
  const equityIdx = header.findIndex(
    (h) => h === "equity" || h === "pnl" || h === "balance" || h === "value"
  );

  if (dateIdx === -1 || equityIdx === -1) {
    throw new Error("pnl.csv must have columns: date, equity");
  }

  return lines.slice(1).map((line) => {
    const cols = line.split(",").map((c) => c.trim());
    return {
      date: cols[dateIdx],
      equity: Number(cols[equityIdx].replace(/[$,]/g, "")),
    };
  });
}

function loadCsvCurve(): EquityPoint[] | null {
  if (!pnlCsvRaw?.trim()) return null;
  try {
    const curve = parseCsv(pnlCsvRaw);
    return curve.length ? curve : null;
  } catch {
    return null;
  }
}

function computeSummaryFromCurve(curve: EquityPoint[]): Pick<PnLSummary, "ytdReturnPct" | "ytdReturnUsd" | "asOf"> {
  const first = curve[0].equity;
  const last = curve[curve.length - 1].equity;
  const ytdReturnUsd = last - first;
  const ytdReturnPct = first !== 0 ? (ytdReturnUsd / first) * 100 : 0;
  return {
    ytdReturnUsd,
    ytdReturnPct,
    asOf: curve[curve.length - 1].date,
  };
}

/** Load PnL data. CSV overrides equity curve; summary metrics come from pnl.json. */
export function getPnLData(): PnLData {
  const base = pnlJson as PnLData;
  const csvCurve = loadCsvCurve();
  const equityCurve = csvCurve?.length ? csvCurve : base.equityCurve;

  const computed = equityCurve.length >= 2 ? computeSummaryFromCurve(equityCurve) : null;
  const fromCsv = Boolean(csvCurve?.length);

  const summary: PnLSummary = {
    winRatePct: base.summary.winRatePct ?? 0,
    ytdReturnUsd:
      fromCsv && computed
        ? computed.ytdReturnUsd
        : (base.summary.ytdReturnUsd ?? computed?.ytdReturnUsd ?? 0),
    ytdReturnPct:
      fromCsv && computed
        ? computed.ytdReturnPct
        : (base.summary.ytdReturnPct ?? computed?.ytdReturnPct ?? 0),
    asOf: fromCsv && computed ? computed.asOf : (base.summary.asOf ?? computed?.asOf),
  };

  return { summary, equityCurve };
}

export function formatUsd(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}$${Math.abs(value).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function formatPct(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}
