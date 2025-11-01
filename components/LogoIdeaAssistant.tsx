import React, { useState, useEffect, useRef } from 'react';
import { createIdeaChat } from '../services/geminiService';
import type { Chat } from '@google/genai';
import Spinner from './Spinner';
import ErrorAlert from './ErrorAlert';
import Button from './Button';

interface Message {
    role: 'user' | 'model';
    text: string;
}

const LogoIdeaAssistant: React.FC = () => {
    const [chatSession, setChatSession] = useState<Chat | null>(null);
    const [history, setHistory] = useState<Message[]>([]);
    const [currentMessage, setCurrentMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        try {
            const session = createIdeaChat();
            setChatSession(session);
            setHistory([
                { role: 'model', text: "Hello! What kind of business are you starting? Let's brainstorm some logo ideas." }
            ]);
        } catch (e) {
             const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
             setError(`Failed to start assistant: ${errorMessage}`);
        }
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [history]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentMessage.trim() || !chatSession) return;

        const userMessage: Message = { role: 'user', text: currentMessage };
        setHistory(prev => [...prev, userMessage]);
        setCurrentMessage('');
        setIsLoading(true);
        setError(null);
        
        try {
            const stream = await chatSession.sendMessageStream({ message: userMessage.text });
            
            let modelResponse = '';
            setHistory(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of stream) {
                const chunkText = chunk.text;
                modelResponse += chunkText;
                setHistory(prev => {
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1].text = modelResponse;
                    return newHistory;
                });
            }

        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setError(`Assistant error: ${errorMessage}`);
            setHistory(prev => prev.slice(0, -1)); // Remove the empty model message placeholder
        } finally {
            setIsLoading(false);
        }
    };
    
    const getMessageClass = (role: 'user' | 'model') => {
        if (role === 'user') {
            return 'bg-gradient-to-r from-fuchsia-600 to-cyan-600 text-white self-end rounded-2xl rounded-br-md';
        }
        return 'bg-slate-700 text-slate-200 self-start rounded-2xl rounded-bl-md';
    };

    return (
        <div className="flex flex-col h-[60vh] max-h-[700px]">
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50 rounded-t-lg">
                {history.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                       <p className={`max-w-xs md:max-w-md lg:max-w-lg p-3 whitespace-pre-wrap ${getMessageClass(msg.role)} shadow-md`}>{msg.text}</p>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex justify-start">
                        <div className={`max-w-xs md:max-w-md p-3 ${getMessageClass('model')}`}>
                           <Spinner />
                        </div>
                    </div>
                )}
            </div>
             {error && <div className="p-4 pt-0"><ErrorAlert message={error} onDismiss={() => setError(null)} /></div>}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-700">
                <div className="flex items-center bg-slate-900 rounded-lg border border-slate-600 focus-within:ring-2 focus-within:ring-cyan-500">
                    <input
                        type="text"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        placeholder="Type your idea..."
                        className="flex-1 bg-transparent p-3 border-none focus:outline-none text-white"
                        disabled={isLoading || !chatSession}
                    />
                    <Button type="submit" disabled={isLoading || !currentMessage.trim()}>
                        Send
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default LogoIdeaAssistant;
