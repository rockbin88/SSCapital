# PnL data (Google Sheets → site)

## Quick workflow

1. **Equity curve** — In Google Sheets, export as CSV with two required columns and one optional column:

   | date       | equity  | contribution |
   |------------|---------|--------------|
   | 2026-01-01 | 4132.28 | 0            |
   | 2026-03-01 | 6399.94 | 2000         |

   Save as `src/data/pnl.csv` (replace the file). Rebuild or push to redeploy.

2. **Metrics** — Edit `src/data/pnl.json` → `summary`:

   ```json
   "summary": {
     "ytdReturnPct": 14.2,
     "ytdReturnUsd": 142000,
     "winRatePct": 64.3,
     "asOf": "2026-05-16"
   }
   ```

   - `winRatePct` must be set manually (not computed from the curve).
   - If `pnl.csv` exists, Profit and Profit % are auto-calculated from the first and last `equity`, minus any `contribution` / top-up amounts after the first row.

3. Rebuild or refresh dev server: `npm run dev`

## JSON-only option

Put both `summary` and `equityCurve` in `pnl.json` and delete or ignore `pnl.csv`.

## Google Sheets export

- **CSV:** File → Download → Comma-separated values (.csv)
- **JSON:** Use an add-on, or Apps Script, or paste into `pnl.json`

Accepted CSV column names: `date` + `equity` (also `balance`, `value`, `pnl`). Optional contribution column names: `contribution`, `deposit`, `topup`, `top-up`.
