// Keep the existing flight-status service as the authoritative source.
export async function GET() {
  try {
    const response = await fetch('https://europe2026.proskurnin.com/api/ut785.json', {
      signal: AbortSignal.timeout(10000),
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error('Flight status unavailable');
    const data = await response.json() as Record<string, unknown>;
    if (!data || data.flight !== 'UT 785' || typeof data.departure !== 'string' || !Number.isFinite(Date.parse(data.departure))) {
      throw new Error('Invalid flight status');
    }
    return Response.json(data, { headers: { 'Cache-Control': 'public, max-age=60' } });
  } catch {
    return Response.json({ error: 'Не удалось обновить расписание' }, { status: 503 });
  }
}
