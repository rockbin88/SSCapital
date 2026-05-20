# PnL data (Google Sheets → site)

## Quick workflow

1. **Equity curve** — In Google Sheets, export as CSV with two columns:

   | date       | equity   |
   |------------|----------|
   | 2026-01-02 | 1000000  |

   Save as `src/data/pnl.csv` (replace the file). Rebuild or push to redeploy.

2. **Metrics** — Edit `src/data/pnl.json` → `summary`:

   ```json
   "summary": {
     "ytdReturnPct": 14.2,
     "ytdReturnUsd": 142000,
     "tradesExecuted": 84,
     "asOf": "2026-05-16"
   }
   ```

   - `tradesExecuted` must be set manually (not computed from the curve).
   - If you omit `ytdReturnPct` / `ytdReturnUsd`, they are auto-calculated from the first and last `equity` in the curve.

3. Rebuild or refresh dev server: `npm run dev`

## JSON-only option

Put both `summary` and `equityCurve` in `pnl.json` and delete or ignore `pnl.csv`.

## Google Sheets export

- **CSV:** File → Download → Comma-separated values (.csv)
- **JSON:** Use an add-on, or Apps Script, or paste into `pnl.json`

Accepted CSV column names: `date` + `equity` (also `balance`, `value`, `pnl`).
