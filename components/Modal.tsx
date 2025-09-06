import React, { useRef, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { SymbolData, Settings, Timeframe } from '../types';

interface ModalProps {
    symbol: string;
    data: SymbolData;
    onClose: () => void;
    settings: Settings;
    timeframe: Timeframe;
}

const Modal: React.FC<ModalProps> = ({ symbol, data, onClose, settings, timeframe }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [onClose]);

    const chartData = useMemo(() => {
        if (!data || !data.rsi) return [];
        return data.rsi.map(rsiPoint => {
            const smaPoint = data.sma?.find(sma => sma.time === rsiPoint.time);
            return {
                time: rsiPoint.time,
                rsi: rsiPoint.value,
                sma: smaPoint ? smaPoint.value : null,
            };
        });
    }, [data]);

    const lastRsi = data.rsi[data.rsi.length - 1]?.value || 0;
    const rsiDomain = [
        Math.max(0, Math.min(...data.rsi.map(p => p.value)) - 5),
        Math.min(100, Math.max(...data.rsi.map(p => p.value)) + 5),
    ];
    
    const timeTickFormatter = (timestamp: number) => {
        const date = new Date(timestamp);
        if (timeframe.includes('d') || timeframe.includes('w')) {
            return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        }
        return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    return (
        <div className="fixed inset-0 bg-dark-bg/80 dark:bg-dark-bg/90 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
            <div ref={modalRef} className="bg-light-card/80 dark:bg-dark-card/80 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] max-h-[700px] flex flex-col border border-light-border/50 dark:border-dark-border/50">
                <div className="flex justify-between items-center p-4 border-b border-light-border dark:border-dark-border">
                    <h2 className="text-2xl font-bold text-dark-text dark:text-light-text">{symbol} <span className="text-base font-normal text-medium-text-light dark:text-medium-text">{timeframe}</span></h2>
                    <button onClick={onClose} className="text-2xl text-medium-text-light dark:text-medium-text hover:text-dark-text dark:hover:text-light-text transition-colors" aria-label="Close chart">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                
                <div className="flex flex-wrap gap-x-6 gap-y-2 px-4 py-3 bg-light-bg/80 dark:bg-dark-bg/80 border-b border-light-border dark:border-dark-border">
                    <div>Price: <span className="font-mono text-primary-light dark:text-primary">${data.price.toFixed(4)}</span></div>
                    <div>Volume: <span className="font-mono text-primary-light dark:text-primary">{data.volume.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span></div>
                    <div>RSI: <span className="font-mono text-primary-light dark:text-primary">{lastRsi.toFixed(2)}</span></div>
                </div>

                <div className="flex-grow p-4">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 30, left: -10, bottom: 20 }}>
                                <CartesianGrid stroke={settings.rsi50Color} strokeDasharray="3 3" />
                                <XAxis dataKey="time" tickFormatter={timeTickFormatter} stroke={settings.textColor} fontSize={12} />
                                <YAxis domain={rsiDomain} stroke={settings.textColor} fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: settings.cellBgColor,
                                        borderColor: settings.rsi50Color,
                                        color: settings.textColor,
                                        opacity: 0.9
                                    }}
                                    labelStyle={{ color: settings.textColor }}
                                    formatter={(value: number, name: string) => {
                                        if (value === null) return null;
                                        return [value.toFixed(2), name];
                                    }}
                                    labelFormatter={(label) => timeTickFormatter(label as number)}
                                />
                                <Legend verticalAlign="bottom" wrapperStyle={{ color: settings.textColor, paddingTop: '20px' }} />
                                <ReferenceLine y={70} label={{ value: 'Overbought (70)', position: 'right', fill: '#ef4444', fontSize: 12 }} stroke="#ef4444" strokeDasharray="3 3" />
                                <ReferenceLine y={50} label={{ value: 'Mid (50)', position: 'right', fill: settings.textColor, fontSize: 12 }} stroke={settings.rsi50Color} strokeDasharray="2 2" />
                                <ReferenceLine y={30} label={{ value: 'Oversold (30)', position: 'right', fill: '#22c55e', fontSize: 12 }} stroke="#22c55e" strokeDasharray="3 3" />
                                <Line
                                    type="monotone"
                                    dataKey="rsi"
                                    name="RSI"
                                    stroke={settings.rsiColor}
                                    strokeWidth={settings.lineWidth}
                                    dot={false}
                                    isAnimationActive={true}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="sma"
                                    name="SMA (14)"
                                    stroke={settings.smaColor}
                                    strokeWidth={settings.lineWidth}
                                    dot={false}
                                    connectNulls={true}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-medium-text-light dark:text-medium-text">
                           Chart data is not available.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;