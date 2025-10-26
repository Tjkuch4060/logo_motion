import React, { useState } from 'react';
import { Tab } from './types';
import Header from './components/Header';
import Tabs from './components/Tabs';
import ImageGenerator from './components/ImageGenerator';
import ImageEditor from './components/ImageEditor';
import LogoIdeaAssistant from './components/LogoIdeaAssistant';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>(Tab.Generate);

    const renderContent = () => {
        switch (activeTab) {
            case Tab.Generate:
                return <ImageGenerator />;
            case Tab.Edit:
                return <ImageEditor />;
            case Tab.Assist:
                return <LogoIdeaAssistant />;
            default:
                return <ImageGenerator />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] sm:w-[100%] h-[600px] bg-gradient-to-b from-blue-900/40 via-purple-900/10 to-transparent rounded-full blur-3xl -z-10 opacity-50"></div>
            <div className="w-full max-w-4xl z-10">
                <Header />
                <main>
                    <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div className="mt-[-1px] bg-slate-800/60 p-6 rounded-b-lg rounded-tr-lg shadow-2xl shadow-black/30 backdrop-blur-lg border border-slate-700">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;