import React, { useState, useEffect, memo } from 'react';
import GridCell from './GridCell';
import type { SymbolData, Settings } from '../types';

interface GridProps {
    symbols: string[];
    symbolsData: Record<string, SymbolData>;
    onSelectSymbol: (symbol: string) => void;
    cellSize: number;
    settings: Settings;
    favorites: string[];
    onToggleFavorite: (symbol: string) => void;
}

const Grid: React.FC<GridProps> = ({ symbols, symbolsData, onSelectSymbol, cellSize, settings, favorites, onToggleFavorite }) => {
    const [columns, setColumns] = useState(6);

    useEffect(() => {
        const calculateColumns = () => {
            const containerWidth = window.innerWidth - 40; // Approx container width
            const cellWidth = cellSize * 1.5 + 12; // cell width + gap
            const newColumns = Math.max(2, Math.floor(containerWidth / cellWidth));
            setColumns(newColumns);
        };
        
        calculateColumns();
        window.addEventListener('resize', calculateColumns);
        return () => window.removeEventListener('resize', calculateColumns);
    }, [cellSize]);
    
    return (
        <div
            className="grid gap-3"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
            {symbols.map(symbol => {
                const data = symbolsData[symbol];
                return (
                    <GridCell
                        key={symbol}
                        symbol={symbol}
                        data={data}
                        onSelect={onSelectSymbol}
                        size={cellSize}
                        settings={settings}
                        isFavorite={favorites.includes(symbol)}
                        onToggleFavorite={onToggleFavorite}
                    />
                );
            })}
        </div>
    );
};

export default memo(Grid);