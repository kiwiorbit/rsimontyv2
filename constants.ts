import type { Timeframe, Settings } from './types';

// Original list with duplicates
const RAW_SYMBOLS: string[] = [
    'BTCUSDT', 'ETHUSDT', 'PAXGUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT',
    'XRPUSDT', 'DOTUSDT', 'DOGEUSDT', 'AVAXUSDT', 'POLUSDT',
    'LINKUSDT', 'ATOMUSDT', 'UNIUSDT', 'FILUSDT', 'LTCUSDT',
    'BCHUSDT', 'XLMUSDT', 'VETUSDT', 'THETAUSDT', 'AXSUSDT',
    'ETCUSDT', 'SEIUSDT', 'XTZUSDT', 'ALGOUSDT', 'SANDUSDT',
    'MANAUSDT', 'GALAUSDT', 'APEUSDT', 'NEARUSDT', 'FLOWUSDT',
    'GRTUSDT', 'AAVEUSDT', 'CHZUSDT', 'ENJUSDT', 'IOTXUSDT',
    'KAVAUSDT', 'KSMUSDT', 'LRCUSDT', 'ONEUSDT', 'QTUMUSDT',
    'RUNEUSDT', 'SCRTUSDT', 'SNXUSDT', 'STXUSDT', 'SUSHIUSDT',
    'ZECUSDT', 'ZILUSDT', 'ZRXUSDT', 'ICPUSDT', 'ARUSDT',
    'CELOUSDT', 'COMPUSDT', 'CRVUSDT', 'DASHUSDT', 'DYDXUSDT',
    'EGLDUSDT', 'ENSUSDT', 'IMXUSDT', 'INJUSDT', 'IOSTUSDT',
    'JASMYUSDT', 'PHBUSDT', 'LDOUSDT', 'ONDOUSDT', 'MKRUSDT',
    'JTOUSDT', 'OMNIUSDT', 'OPUSDT', 'PEOPLEUSDT', 'PERPUSDT',
    'RENUSDT', 'ROSEUSDT', 'RSRUSDT', 'RVNUSDT', 'SKLUSDT',
    'STORJUSDT', 'TRXUSDT', 'WIFUSDT', 'YFIUSDT', '1INCHUSDT',
    'OMUSDT', 'HYPERUSDT', 'CFXUSDT', 'STRKUSDT', 'BANDUSDT',
    'BATUSDT', 'BIGTIMEUSDT', 'CELRUSDT', 'COTIUSDT', 'CVCUSDT',
    'DENTUSDT', 'PYTHUSDT', 'HOTUSDT', 'ICXUSDT', 'API3USDT',
    'KNCUSDT', 'MAGICUSDT', 'SAGAUSDT', 'TRUMPUSDT', 'MASKUSDT',
    'NKNUSDT', 'OGNUSDT', 'ONTUSDT', 'POWRUSDT', 'TAOUSDT',
    'PENDLEUSDT', 'SLPUSDT', 'BEARUSDT', 'SXPUSDT', 'HBARUSDT',
    'UMAUSDT', 'WOOUSDT', 'TRBUSDT', 'REZUSDT', 'ANKRUSDT',
    'ARPAUSDT', 'BELUSDT', 'C98USDT', 'CHRUSDT', 'CTKUSDT',
    'SOLVUSDT', 'JUPUSDT', 'ORDIUSDT', 'FLMUSDT', 'FORTHUSDT',
    'SOLETH', 'TWTUSDT', 'ETHBTC', 'HIVEUSDT', 'JSTUSDT',
    'LPTUSDT', 'WLFIUSDT', 'MINAUSDT', 'MOVRUSDT', 'NEOUSDT',
    'NMRUSDT', 'OXTUSDT', 'BICOUSDT', 'SAHARAUSDT', 'QNTUSDT',
    'QUICKUSDT', 'TONUSDT', 'TIAUSDT', 'RLCUSDT', 'WIFUSDT',
    'SPELLUSDT', 'ACHUSDT', 'SUPERUSDT', 'SYSUSDT', 'FORMUSDT',
    'TLMUSDT', 'TWTUSDT', 'XVGUSDT'
];

// Exporting a unique, default list of symbols. This is the fallback.
export const DEFAULT_SYMBOLS: string[] = [...new Set(RAW_SYMBOLS)];


export const TIMEFRAMES: { value: Timeframe; label: string }[] = [
    { value: '1m', label: '1m' },
    { value: '3m', label: '3m' },
    { value: '5m', label: '5m' },
    { value: '15m', label: '15m' },
    { value: '30m', label: '30m' },
    { value: '1h', label: '1h' },
    { value: '2h', label: '2h' },
    { value: '4h', label: '4h' },
    { value: '8h', label: '8h' },
    { value: '1d', label: '1d' },
    { value: '3d', label: '3d' },
    { value: '1w', label: '1w' },
];

export const DARK_THEME_SETTINGS: Settings = {
    bgColor: '#181c24',
    textColor: '#e5e9f2',
    cellBgColor: '#232a36',
    rsiColor: '#29ffb8',
    smaColor: '#4ec3fa',
    rsi50Color: '#4a5568',
    lineWidth: 2,
};

export const LIGHT_THEME_SETTINGS: Settings = {
    bgColor: '#f0f2f5',
    textColor: '#181c24',
    cellBgColor: '#ffffff',
    rsiColor: '#00a878',
    smaColor: '#0077b6',
    rsi50Color: '#ced4da',
    lineWidth: 2,
};