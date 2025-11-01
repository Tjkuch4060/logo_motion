import React, { useState } from 'react';
import { Tab } from './types';
import Header from './components/Header';
import Tabs from './components/Tabs';
import ImageGenerator from './components/ImageGenerator';
import ImageEditor from './components/ImageEditor';
import LogoIdeaAssistant from './components/LogoIdeaAssistant';
import BrandKitGenerator from './components/BrandKitGenerator';
import { SidebarIcon } from './components/icons/SidebarIcon';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>(Tab.Generate);
    const [prompt, setPrompt] = useState<string>('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSendPrompt = (newPrompt: string) => {
        setPrompt(newPrompt);
        setActiveTab(Tab.Generate);
    };

    const renderContent = () => {
        switch (activeTab) {
            case Tab.Generate:
                return <ImageGenerator 
                            initialPrompt={prompt} 
                            onBrainstormClick={() => setIsSidebarOpen(true)} 
                        />;
            case Tab.Edit:
                return <ImageEditor />;
            case Tab.BrandKit:
                return <BrandKitGenerator />;
            default:
                return <ImageGenerator 
                            initialPrompt={prompt} 
                            onBrainstormClick={() => setIsSidebarOpen(true)} 
                        />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] sm:w-[100%] h-[600px] bg-gradient-to-b from-blue-900/40 via-purple-900/10 to-transparent rounded-full blur-3xl -z-10 opacity-50"></div>
            <div className="w-full max-w-7xl z-10 flex-1 flex flex-col">
                <Header />
                <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
                    <div className="lg:col-span-2 flex flex-col">
                        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                        <div className="flex-1 mt-[-1px] bg-slate-800/60 p-6 rounded-b-lg rounded-tr-lg shadow-2xl shadow-black/30 backdrop-blur-lg border border-slate-700">
                            {renderContent()}
                        </div>
                    </div>
                    <aside className={`lg:col-span-1 flex-col ${isSidebarOpen ? 'flex' : 'hidden'} lg:flex`}>
                        <div className="flex-1 bg-slate-800/60 p-6 rounded-lg shadow-2xl shadow-black/30 backdrop-blur-lg border border-slate-700">
                            <LogoIdeaAssistant onSendPrompt={handleSendPrompt} />
                        </div>
                    </aside>
                </main>
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                    className="lg:hidden fixed bottom-4 right-4 bg-slate-800/60 p-3 rounded-full shadow-lg backdrop-blur-lg border border-slate-700 hover:bg-slate-700/80 transition-all duration-300 z-20"
                >
                    <SidebarIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default App;
