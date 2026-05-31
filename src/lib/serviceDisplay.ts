/** Formats "21:30" + optional end into display text for today's service. */
export function formatServiceTimeRange(
  startTime?: string,
  endTime?: string,
): string | null {
  if (!startTime) return null;
  if (endTime) return `${startTime}〜${endTime}`;
  return startTime;
}

export function formatServiceMeta(
  tableNumber?: string,
  startTime?: string,
  endTime?: string,
): string | null {
  const time = formatServiceTimeRange(startTime, endTime);
  const table = tableNumber ? `卓${tableNumber}` : null;
  if (time && table) return `${time} · ${table}`;
  return time ?? table;
}
