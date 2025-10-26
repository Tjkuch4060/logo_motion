import React from 'react';
import { Tab } from '../types';
import { GenerateIcon } from './icons/GenerateIcon';
import { EditIcon } from './icons/EditIcon';
import { AssistIcon } from './icons/AssistIcon';

interface TabsProps {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: Tab.Generate, label: 'Generate', icon: <GenerateIcon /> },
        { id: Tab.Edit, label: 'Edit', icon: <EditIcon /> },
        { id: Tab.Assist, label: 'Brainstorm', icon: <AssistIcon /> },
    ];

    const getTabClass = (tabId: Tab) => {
        const baseClass = "relative flex items-center gap-2 px-4 py-3 font-semibold text-sm rounded-t-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 z-10";
        if (activeTab === tabId) {
            return `${baseClass} bg-slate-800/60 text-white`;
        }
        return `${baseClass} text-slate-400 hover:bg-slate-700/50 hover:text-white`;
    };

    return (
        <nav className="flex border-b border-slate-700">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={getTabClass(tab.id)}
                    aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                    {tab.icon}
                    {tab.label}
                    {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-fuchsia-500 to-cyan-500 shadow-[0_0_8px_0_theme(colors.cyan.500),0_0_4px_0_theme(colors.fuchsia.500)]"></div>
                    )}
                </button>
            ))}
        </nav>
    );
};

export default Tabs;