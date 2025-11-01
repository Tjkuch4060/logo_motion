import React, { useState, useEffect, useRef } from 'react';
import { createIdeaChat } from '../services/geminiService';
import { addConversation, getConversations, getMessages, addMessage, Conversation, Message } from '../services/firestoreService';
import { fetchConfig, getPersonaDescriptions } from '../services/remoteConfigService';
import type { Chat } from '@google/genai';
import Spinner from './Spinner';
import ErrorAlert from './ErrorAlert';
import Button from './Button';
import ChatHistory from './ChatHistory';
import { Timestamp } from 'firebase/firestore';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import SectionHeader from './SectionHeader';

interface LogoIdeaAssistantProps {
    onSendPrompt: (prompt: string) => void;
}

const LogoIdeaAssistant: React.FC<LogoIdeaAssistantProps> = ({ onSendPrompt }) => {
    const [chatSession, setChatSession] = useState<Chat | null>(null);
    const [history, setHistory] = useState<Message[]>([]);
    const [currentMessage, setCurrentMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversation, setActiveConversation] = useState<string | null>(null);
    const [persona, setPersona] = useState<'creative' | 'critical' | 'marketing' | 'competitor'>('creative');
    const [copiedMessage, setCopiedMessage] = useState<string | null>(null);
    const [personaDescriptions, setPersonaDescriptions] = useState(getPersonaDescriptions());

    const competitorAnalystFeatureFlag = true;

    const personas = {
        creative: 'You are a creative assistant specializing in brainstorming business names and logo ideas. Keep your responses concise, creative, and helpful. Provide suggestions in short, easy-to-read formats like lists.',
        critical: 'You are a critical design expert. Your role is to provide constructive criticism on logo ideas. Be specific, insightful, and help the user improve their concepts by pointing out potential flaws and suggesting concrete improvements.',
        marketing: 'You are a marketing strategist. Evaluate logo ideas based on their potential to attract customers, build a brand, and resonate with a target audience. Provide feedback on memorability, scalability, and overall market impact.',
        competitor: 'You are a competitor analyst. Your role is to analyze the branding of competitors and provide strategic advice on how to create a unique and memorable logo that stands out. Start by asking the user for the names of a few competitors.',
    };

    useEffect(() => {
        fetchConfig().then(() => {
            setPersonaDescriptions(getPersonaDescriptions());
        });
    }, []);

    const loadConversations = async () => {
        try {
            const convos = await getConversations();
            setConversations(convos);
            if (convos.length > 0 && convos[0]) {
                await handleSelectConversation(convos[0].id);
            } else {
                await handleNewConversation();
            }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setError(`Failed to load conversations: ${errorMessage}`);
        }
    };

    const startNewChat = async (title: string) => {
        try {
            const session = createIdeaChat(personas[persona]);
            setChatSession(session);
            const newConvoId = await addConversation(title);
            setActiveConversation(newConvoId);
            const initialMessage: Message = { role: 'model', text: "Hello! What kind of business are you starting? Let's brainstorm some logo ideas.", timestamp: Timestamp.now() };
            await addMessage(newConvoId, initialMessage);
            setHistory([initialMessage]);
            await loadConversations();
        } catch (e) {
             const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
             setError(`Failed to start assistant: ${errorMessage}`);
        }
    };
    
    useEffect(() => {
        loadConversations();
    }, []);

    useEffect(() => {
        if(chatSession) {
            startNewChat("New Conversation");
        }
    }, [persona]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [history]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentMessage.trim() || !chatSession || !activeConversation) return;

        const userMessage: Omit<Message, 'timestamp'> = { role: 'user', text: currentMessage };
        await addMessage(activeConversation, userMessage);
        setHistory(prev => [...prev, {...userMessage, timestamp: Timestamp.now() }]);
        setCurrentMessage('');
        setIsLoading(true);
        setError(null);
        
        try {
            const stream = await chatSession.sendMessageStream({ message: userMessage.text });
            
            let modelResponse = '';
            setHistory(prev => [...prev, { role: 'model', text: '', timestamp: Timestamp.now() }]);

            for await (const chunk of stream) {
                const chunkText = chunk.text;
                modelResponse += chunkText;
                setHistory(prev => {
                    const newHistory = [...prev];
                    const lastMessage = newHistory[newHistory.length - 1];
                    if(lastMessage){
                        lastMessage.text = modelResponse;
                    }
                    return newHistory;
                });
            }
            await addMessage(activeConversation, { role: 'model', text: modelResponse });

        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setError(`Assistant error: ${errorMessage}`);
            setHistory(prev => prev.slice(0, -1)); 
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

    const handleSelectConversation = async (id: string) => {
        try {
            const messages = await getMessages(id);
            setHistory(messages);
            setActiveConversation(id);
            const session = createIdeaChat(personas[persona], messages.map(m => ({ role: m.role, parts: [{text: m.text}] })));
            setChatSession(session);

        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setError(`Failed to load conversation: ${errorMessage}`);
        }
    };

    const handleNewConversation = async () => {
        const title = prompt("Enter a title for the new conversation:");
        if (title) {
            await startNewChat(title);
        }
    };

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedMessage(text);
        setTimeout(() => setCopiedMessage(null), 2000);
    };


    return (
        <div className="flex flex-col h-full">
            <SectionHeader title="Logo Assistant" subtitle="Your AI brainstorming partner" />
            <div className="p-4 border-b border-slate-700">
                <div className="grid grid-cols-2 gap-4">
                    <Button
                        onClick={() => setPersona('creative')}
                        className={`p-4 rounded-lg text-left ${persona === 'creative' ? 'bg-slate-700' : 'bg-slate-800'}`}
                    >
                        <h3 className="font-bold text-white">Creative</h3>
                        <p className="text-sm text-slate-400">{personaDescriptions.creative}</p>
                    </Button>
                    <Button
                        onClick={() => setPersona('critical')}
                        className={`p-4 rounded-lg text-left ${persona === 'critical' ? 'bg-slate-700' : 'bg-slate-800'}`}
                    >
                        <h3 className="font-bold text-white">Critical</h3>
                        <p className="text-sm text-slate-400">{personaDescriptions.critical}</p>
                    </Button>
                    <Button
                        onClick={() => setPersona('marketing')}
                        className={`p-4 rounded-lg text-left ${persona === 'marketing' ? 'bg-slate-700' : 'bg-slate-800'}`}
                    >
                        <h3 className="font-bold text-white">Marketing</h3>
                        <p className="text-sm text-slate-400">{personaDescriptions.marketing}</p>
                    </Button>
                    {competitorAnalystFeatureFlag && (
                        <Button
                            onClick={() => setPersona('competitor')}
                            className={`p-4 rounded-lg text-left ${persona === 'competitor' ? 'bg-slate-700' : 'bg-slate-800'}`}
                        >
                            <h3 className="font-bold text-white">Competitor</h3>
                            <p className="text-sm text-slate-400">{personaDescriptions.competitor}</p>
                        </Button>
                    )}
                </div>
            </div>
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {history.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <p className={`max-w-xs md:max-w-md lg:max-w-lg p-3 whitespace-pre-wrap ${getMessageClass(msg.role)} shadow-md`}>{msg.text}</p>
                        {msg.role === 'model' && (
                            <div className="flex flex-col gap-1">
                                <Button
                                    onClick={() => onSendPrompt(msg.text)}
                                    className="bg-slate-700 hover:bg-slate-600 text-white font-semibold p-2 rounded-lg"
                                >
                                    <CheckIcon className="w-4 h-4" />
                                </Button>
                                <Button
                                    onClick={() => handleCopyToClipboard(msg.text)}
                                    className="bg-slate-700 hover:bg-slate-600 text-white font-semibold p-2 rounded-lg"
                                >
                                    {copiedMessage === msg.text ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                     <div className="flex justify-start">
                        <div className={`max-w-xs md-max-w-md p-3 ${getMessageClass('model')}`}>
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
