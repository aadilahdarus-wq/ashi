// Date-window helpers shared by the timeseries and summary API routes.

export type DateWindow = { start: string; end: string }; // inclusive, ISO yyyy-mm-dd

/**
 * Given an inclusive [start, end] window, returns the immediately preceding
 * window of the same length. Used for period-over-period comparisons.
 */
export function getPreviousWindow(start: string, end: string): DateWindow {
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const s = new Date(`${start}T00:00:00Z`);
  const e = new Date(`${end}T00:00:00Z`);
  const days = Math.round((e.getTime() - s.getTime()) / 86_400_000) + 1;

  const prevEnd = new Date(s);
  prevEnd.setUTCDate(prevEnd.getUTCDate() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setUTCDate(prevStart.getUTCDate() - (days - 1));

  return { start: fmt(prevStart), end: fmt(prevEnd) };
}
