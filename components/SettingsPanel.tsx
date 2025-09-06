import React from 'react';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenAssetModal: () => void;
    onOpenThemeModal: () => void;
    onReset: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, onOpenAssetModal, onOpenThemeModal, onReset }) => {
    
    if (!isOpen) {
        return null;
    }

    const handleResetClick = () => {
        if (window.confirm("Are you sure you want to reset all settings? This will restore the default theme, asset list, and clear favorites. This action cannot be undone.")) {
            onReset();
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300" onClick={onClose}></div>
            <div
                className={`fixed top-0 right-0 h-full bg-light-card/80 dark:bg-dark-card/80 backdrop-blur-lg border-l border-light-border/50 dark:border-dark-border/50 text-dark-text dark:text-light-text shadow-2xl z-50 w-80 max-w-[90vw] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-light-border dark:border-dark-border">
                    <h3 className="text-2xl font-bold">Settings</h3>
                    <button onClick={onClose} className="text-2xl text-medium-text-light dark:text-medium-text hover:text-dark-text dark:hover:text-light-text transition-colors" aria-label="Close settings">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                
                {/* Main Content (menu) */}
                <nav className="flex-grow p-4">
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => { onOpenAssetModal(); onClose(); }}
                                className="w-full text-left p-3 rounded-lg bg-light-bg/80 dark:bg-dark-bg/80 hover:bg-light-border dark:hover:bg-dark-border transition-colors flex items-center gap-4"
                            >
                                <i className="fa-solid fa-list-check w-5 text-center text-lg text-primary-light dark:text-primary"></i>
                                <span className="font-semibold">Asset List</span>
                            </button>
                        </li>
                        <li>
                             <button
                                onClick={() => { onOpenThemeModal(); onClose(); }}
                                className="w-full text-left p-3 rounded-lg bg-light-bg/80 dark:bg-dark-bg/80 hover:bg-light-border dark:hover:bg-dark-border transition-colors flex items-center gap-4"
                            >
                                <i className="fa-solid fa-palette w-5 text-center text-lg text-primary-light dark:text-primary"></i>
                                <span className="font-semibold">Theme & Appearance</span>
                            </button>
                        </li>
                    </ul>
                </nav>

                {/* Footer (Reset button) */}
                <div className="p-4 mt-auto border-t border-light-border dark:border-dark-border">
                    <button
                        onClick={handleResetClick}
                        className="w-full p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors flex items-center gap-4"
                    >
                         <i className="fa-solid fa-arrow-rotate-left w-5 text-center text-lg"></i>
                         <span className="font-semibold">Reset to Defaults</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default SettingsPanel;