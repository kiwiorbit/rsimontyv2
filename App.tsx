import React, { useState, useEffect, useCallback, useMemo } from 'react';
import CryptoHeader from './components/CryptoHeader';
import Grid from './components/Grid';
import Modal from './components/Modal';
import SettingsPanel from './components/SettingsPanel';
import Footer from './components/Footer';
import AssetListModal from './components/AssetListModal';
import ThemeModal from './components/ThemeModal';
import { DEFAULT_SYMBOLS, TIMEFRAMES, LIGHT_THEME_SETTINGS, DARK_THEME_SETTINGS } from './constants';
import type { Settings, SymbolData, Timeframe, Theme } from './types';
import { fetchRsiForSymbol } from './services/binanceService';

type SortOrder = 'rsi-desc' | 'rsi-asc' | 'default';

const App: React.FC = () => {
    const [theme, setTheme] = useState<Theme>('dark');
    const [settings, setSettings] = useState<Settings>(DARK_THEME_SETTINGS);
    const [timeframe, setTimeframe] = useState<Timeframe>('15m');
    const [cellSize, setCellSize] = useState<number>(120);
    const [symbolsData, setSymbolsData] = useState<Record<string, SymbolData>>({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // The master list of all symbols the user can choose from. Editable.
    const [allSymbols, setAllSymbols] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem('crypto-all-symbols');
            return saved ? JSON.parse(saved) : DEFAULT_SYMBOLS;
        } catch (error) {
            console.error("Failed to parse all symbols from localStorage", error);
            return DEFAULT_SYMBOLS;
        }
    });

    // The list of symbols the user has selected to display on the grid.
    const [userSymbols, setUserSymbols] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem('crypto-user-symbols');
            // If there's a saved list, use it. Otherwise, default to showing all symbols from the master list.
            return saved ? JSON.parse(saved) : allSymbols;
        } catch (error) {
            console.error("Failed to parse user symbols from localStorage", error);
            return allSymbols;
        }
    });

    const [favorites, setFavorites] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem('crypto-favorites');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error("Failed to parse favorites from localStorage", error);
            return [];
        }
    });
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [sortOrder, setSortOrder] = useState<SortOrder>('default');

    const [activeSymbol, setActiveSymbol] = useState<string | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
    const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'light') {
            root.classList.remove('dark');
        } else {
            root.classList.add('dark');
        }
        document.body.style.backgroundColor = settings.bgColor;
    }, [theme, settings.bgColor]);
    
    useEffect(() => {
        localStorage.setItem('crypto-all-symbols', JSON.stringify(allSymbols));
    }, [allSymbols]);

    useEffect(() => {
        localStorage.setItem('crypto-user-symbols', JSON.stringify(userSymbols));
    }, [userSymbols]);

    useEffect(() => {
        localStorage.setItem('crypto-favorites', JSON.stringify(favorites));
    }, [favorites]);

    const handleThemeToggle = useCallback(() => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        setSettings(newTheme === 'light' ? LIGHT_THEME_SETTINGS : DARK_THEME_SETTINGS);
    }, [theme]);
    
    const fetchData = useCallback(async (selectedTimeframe: Timeframe) => {
        if (userSymbols.length === 0) {
            setSymbolsData({});
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const promises = userSymbols.map(symbol => fetchRsiForSymbol(symbol, selectedTimeframe));
            const results = await Promise.all(promises);
            const newData: Record<string, SymbolData> = {};
            results.forEach((data, index) => {
                newData[userSymbols[index]] = data;
            });
            setSymbolsData(newData);
        } catch (error) {
            console.error("Failed to fetch all symbol data:", error);
        } finally {
            setLoading(false);
        }
    }, [userSymbols]);

    useEffect(() => {
        fetchData(timeframe);
        const interval = setInterval(() => fetchData(timeframe), 60000); // Refresh every 60 seconds
        return () => clearInterval(interval);
    }, [timeframe, fetchData]);
    
    const handleResetSettings = useCallback(() => {
        // Confirmation is handled within the SettingsPanel component.
        
        // Explicitly clear localStorage to ensure a persistent reset
        localStorage.removeItem('crypto-all-symbols');
        localStorage.removeItem('crypto-user-symbols');
        localStorage.removeItem('crypto-favorites');
        
        // Reset application state to defaults
        setTheme('dark');
        setSettings(DARK_THEME_SETTINGS);
        setAllSymbols(DEFAULT_SYMBOLS);
        setUserSymbols(DEFAULT_SYMBOLS);
        setFavorites([]);
        setIsSettingsOpen(false); // Close panel after resetting
    }, []);

    const handleTimeframeChange = useCallback((newTimeframe: Timeframe) => {
        setTimeframe(newTimeframe);
    }, []);
    
    const handleSaveAssetList = useCallback((data: { allSymbols: string[], selectedSymbols: string[] }) => {
        setAllSymbols(data.allSymbols);
        setUserSymbols(data.selectedSymbols);
        
        // Also filter favorites to only include symbols that are still in the master list
        setFavorites(prev => prev.filter(fav => data.allSymbols.includes(fav)));
        
        setIsAssetModalOpen(false);
    }, []);

    const handleCellSizeChange = useCallback((newSize: number) => {
        setCellSize(newSize);
    }, []);

    const handleSelectSymbol = useCallback((symbol: string) => {
        setActiveSymbol(symbol);
    }, []);

    const handleCloseModal = useCallback(() => {
        setActiveSymbol(null);
    }, []);

    const handleSearchChange = useCallback((term: string) => {
        setSearchTerm(term);
    }, []);
    
    const toggleFavorite = useCallback((symbol: string) => {
        setFavorites(prev =>
            prev.includes(symbol)
                ? prev.filter(s => s !== symbol)
                : [...prev, symbol]
        );
    }, []);
    
    const handleSettingsToggle = useCallback(() => {
        setIsSettingsOpen(isOpen => !isOpen);
    }, []);

    const handleShowFavoritesToggle = useCallback(() => {
        setShowFavoritesOnly(prev => !prev);
    }, []);

    const displayedSymbols = useMemo(() => {
        let symbols = userSymbols
            .filter(symbol => symbol.toLowerCase().includes(searchTerm.toLowerCase()));

        if (showFavoritesOnly) {
            symbols = symbols.filter(s => favorites.includes(s));
        }

        if (sortOrder !== 'default' && Object.keys(symbolsData).length > 0) {
            symbols.sort((a, b) => {
                const dataA = symbolsData[a];
                const dataB = symbolsData[b];
                const rsiA = dataA?.rsi?.[dataA.rsi.length - 1]?.value ?? (sortOrder === 'rsi-desc' ? -1 : 101);
                const rsiB = dataB?.rsi?.[dataB.rsi.length - 1]?.value ?? (sortOrder === 'rsi-desc' ? -1 : 101);
                return sortOrder === 'rsi-desc' ? rsiB - rsiA : rsiA - rsiB;
            });
        }
        
        return symbols;
    }, [searchTerm, showFavoritesOnly, favorites, sortOrder, symbolsData, userSymbols]);
    
    return (
        <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-dark-text dark:text-light-text font-sans flex flex-col">
            <div className="container mx-auto p-4 flex-grow">
                <CryptoHeader
                    theme={theme}
                    onThemeToggle={handleThemeToggle}
                    timeframe={timeframe}
                    onTimeframeChange={handleTimeframeChange}
                    cellSize={cellSize}
                    onCellSizeChange={handleCellSizeChange}
                    onSettingsToggle={handleSettingsToggle}
                    timeframes={TIMEFRAMES}
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                />
                <main className="pt-40 md:pt-28">
                    <div className="flex flex-wrap justify-end items-center gap-2 sm:gap-4 mb-4">
                        <label htmlFor="favorites-toggle" className="flex items-center cursor-pointer">
                            <span className="mr-3 text-sm font-medium text-medium-text-light dark:text-medium-text">Favorites Only</span>
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    id="favorites-toggle"
                                    className="sr-only peer"
                                    checked={showFavoritesOnly}
                                    onChange={handleShowFavoritesToggle}
                                />
                                <div className="w-11 h-6 bg-light-border peer-focus:outline-none rounded-full peer dark:bg-dark-border peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-dark-card after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-light dark:peer-checked:bg-primary"></div>
                            </div>
                        </label>
                        <div className="flex items-center gap-1 bg-light-bg dark:bg-dark-bg p-1 rounded-lg border border-light-border dark:border-dark-border">
                            <button onClick={() => setSortOrder('rsi-desc')} className={`px-3 py-1 text-sm font-semibold rounded-md transition ${sortOrder === 'rsi-desc' ? 'bg-primary-light dark:bg-primary text-white dark:text-dark-bg' : 'hover:bg-light-border dark:hover:bg-dark-border'}`} aria-label="Sort RSI descending">RSI ↓</button>
                            <button onClick={() => setSortOrder('rsi-asc')} className={`px-3 py-1 text-sm font-semibold rounded-md transition ${sortOrder === 'rsi-asc' ? 'bg-primary-light dark:bg-primary text-white dark:text-dark-bg' : 'hover:bg-light-border dark:hover:bg-dark-border'}`} aria-label="Sort RSI ascending">RSI ↑</button>
                            <button onClick={() => setSortOrder('default')} className={`px-2 py-1 text-sm rounded-md transition ${sortOrder === 'default' ? 'text-primary-light dark:text-primary' : 'text-medium-text-light dark:text-medium-text hover:bg-light-border dark:hover:bg-dark-border'}`} aria-label="Reset sort">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    </div>

                    {loading ? (
                         <div className="flex justify-center items-center h-96">
                             <div className="app-loader" aria-label="Loading dashboard data...">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    ) : (
                        <Grid
                            symbols={displayedSymbols}
                            symbolsData={symbolsData}
                            onSelectSymbol={handleSelectSymbol}
                            cellSize={cellSize}
                            settings={settings}
                            favorites={favorites}
                            onToggleFavorite={toggleFavorite}
                        />
                    )}
                </main>
            </div>
            {activeSymbol && symbolsData[activeSymbol] && (
                <Modal
                    symbol={activeSymbol}
                    data={symbolsData[activeSymbol]}
                    onClose={handleCloseModal}
                    settings={settings}
                    timeframe={timeframe}
                />
            )}
            <SettingsPanel
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onOpenAssetModal={() => setIsAssetModalOpen(true)}
                onOpenThemeModal={() => setIsThemeModalOpen(true)}
                onReset={handleResetSettings}
            />
            <AssetListModal
                isOpen={isAssetModalOpen}
                onClose={() => setIsAssetModalOpen(false)}
                onSave={handleSaveAssetList}
                allSymbols={allSymbols}
                currentSymbols={userSymbols}
            />
            <ThemeModal 
                isOpen={isThemeModalOpen}
                onClose={() => setIsThemeModalOpen(false)}
                settings={settings}
                onSettingsChange={setSettings}
            />
            <Footer />
        </div>
    );
};

export default App;