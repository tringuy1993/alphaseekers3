/**
 * API URL Configuration
 *
 * This file defines all API endpoints used by the frontend.
 * The BASE_URL is configurable via environment variable for easy switching
 * between development (localhost) and production environments.
 *
 * Usage:
 *   Development: Set NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/ in .env.local
 *   Production:  Set NEXT_PUBLIC_API_URL=https://www.alpha-seekers.com/ in environment
 */

// Base URL for all API requests
// Defaults to localhost for development if not specified
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/';

// =============================================================================
// Greek Exposure Endpoints (Protected - requires Firebase auth)
// =============================================================================

// Legacy gamma endpoint (deprecated, use GREEK_EXPO_URL instead)
export const GAMMA_URL = 'api/data/gamma/';

// Aggregated Greek exposures by strike price
export const GREEK_EXPO_URL = 'api/data/greeksexposure/';

// Theoretical gamma exposure by spot price
export const THEO_URL = 'api/data/theogamma/';

// Theoretical Greek (gamma/vanna) exposure by spot price
export const THEOVANNA_URL = 'api/data/theoGreek/';

// Greek exposures over multiple timestamps
export const ALL_URL = 'api/data/data-all-dates/';

// Live aggregated Greek data
export const LIVE_URL = 'api/data/livedata/';

// =============================================================================
// E-mini S&P 500 Futures (ES) Endpoints (Protected)
// =============================================================================

// ES notional Greek exposure
export const ES_URL = 'api/data/ES/';

// ES theoretical gamma by strike
export const ES_THEO_URL = 'api/data/theo-ES/';

// =============================================================================
// Utility Endpoints (Public)
// =============================================================================

// Yahoo Finance stock data
export const YF_URL = 'api/data/yf-data/';

// Music guessing game - get song audio
export const SONGS_URL = 'api/data/songs/';

// Music guessing game - get song answers
export const ANSWER_URL = 'api/data/song-answers/';

// =============================================================================
// Backtesting Endpoints (Protected)
// =============================================================================

// Get Greek exposure for specific date/time
export const BACKTEST_URL = 'api/backtest-data/backtest_db/';

// Get available partitioned tables (dates)
export const BACKTEST_AVAIL_DATE = 'api/backtest-data/partitionedTables/';

// Get full option chain for date/time
export const BACKTEST_OPT_CHAIN = 'api/backtest-data/option-chain/';

// Track order PnL over time
export const BACKTEST_TRACK_ORDER = 'api/backtest-data/track-order/';

// =============================================================================
// Live 0DTE Data Endpoints (Public)
// =============================================================================

// Live OTM premium and expected move data
export const LIVE_OTM_URL = 'api/data/LiveOTMData/';

// Live OTM volume data
export const LIVE_OTM_VOLUME_URL = 'api/data/LiveOTMVolume/';

// Live Greek exposure over time (intraday)
export const LIVE_EXPO_GREEK_URL = 'api/data/LiveExpoGreekData/';

// Available expiration dates for OTM data
export const LIVE_OTM_DATES = 'api/data/AvailableOTMDate/';

// Available underlying tickers for OTM data
export const LIVE_OTM_UTICKERS = 'api/data/AvailableOTMUTickers/';

// =============================================================================
// Gamma Dashboard Endpoints (Public)
// =============================================================================

// Gamma exposure time series with price overlay
export const GAMMA_DASHBOARD_TIME_SERIES_URL = 'api/data/gamma-dashboard/time-series/';

// Gamma heatmap data (time x strike)
export const GAMMA_DASHBOARD_HEATMAP_URL = 'api/data/gamma-dashboard/heatmap/';

// Gamma levels by strike (call/put bar chart)
export const GAMMA_DASHBOARD_LEVELS_URL = 'api/data/gamma-dashboard/levels/';

// Available expirations for filtering
export const GAMMA_DASHBOARD_EXPIRATIONS_URL = 'api/data/gamma-dashboard/expirations/';

// Available trading dates with data
export const GAMMA_DASHBOARD_DATES_URL = 'api/data/gamma-dashboard/available-dates/';
