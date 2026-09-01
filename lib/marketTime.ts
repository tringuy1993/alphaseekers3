import moment from 'moment-timezone';

const MARKET_TZ = 'America/New_York';

export function etToday(): string {
  return moment().tz(MARKET_TZ).format('YYYY-MM-DD');
}

export function isAfterMarketOpenET(): boolean {
  const now = moment().tz(MARKET_TZ);
  return now.hour() > 9 || (now.hour() === 9 && now.minute() >= 30);
}

export function isMarketHoursET(): boolean {
  const now = moment().tz(MARKET_TZ);
  if (now.isoWeekday() > 5) {
    return false;
  }
  const open = now.clone().hour(9).minute(30).second(0).millisecond(0);
  const close = now.clone().hour(16).minute(10).second(0).millisecond(0);
  return now.isBetween(open, close);
}

// 60s polling only when viewing today's live session; 0 disables SWR refresh.
export function liveRefreshInterval(date: string | null | undefined): number {
  return date === etToday() && isMarketHoursET() ? 60000 : 0;
}
