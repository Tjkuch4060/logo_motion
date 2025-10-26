import React, { useState } from 'react';
import { generateLogo } from '../services/geminiService';
import Spinner from './Spinner';
import ErrorAlert from './ErrorAlert';
import { GenerateIcon } from './icons/GenerateIcon';

const examplePrompts = [
    'A minimalist logo for a tech startup named "Innovate", featuring a stylized brain and circuit paths, blue and silver color scheme.',
    'A retro-style logo for a coffee shop called "The Daily Grind"',
    'A modern, minimalist logo for a fitness app, using abstract shapes',
    'A playful logo for a pet grooming business with a cartoon dog and cat',
    'An elegant wordmark logo for a luxury fashion brand named "Aura"',
];

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState<string>(examplePrompts[0]);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError("Prompt cannot be empty.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const imageBytes = await generateLogo(prompt);
            setGeneratedImage(`data:image/jpeg;base64,${imageBytes}`);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setError(`Failed to generate logo: ${errorMessage}`);
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = 'logo.jpeg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <label htmlFor="prompt-generate" className="block text-sm font-medium text-slate-300 mb-2">
                    Describe your logo
                </label>
                <textarea
                    id="prompt-generate"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A majestic lion wearing a crown for a luxury brand"
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 h-28 resize-none"
                    disabled={isLoading}
                />
            </div>
            
            <div className="flex flex-col gap-2">
                <label htmlFor="prompt-examples" className="text-sm font-medium text-slate-400">
                    Need inspiration?
                </label>
                <select
                    id="prompt-examples"
                    onChange={(e) => {
                        if (e.target.value) {
                            setPrompt(e.target.value);
                        }
                    }}
                    disabled={isLoading}
                    className="w-full bg-slate-700/80 border border-slate-600 text-slate-300 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2.5 transition-colors duration-200 cursor-pointer"
                    aria-label="Select an example prompt"
                >
                    <option value="">Select a prompt example...</option>
                    {examplePrompts.map((p, i) => (
                        <option key={i} value={p}>
                            {p.length > 80 ? `${p.substring(0, 77)}...` : p}
                        </option>
                    ))}
                </select>
            </div>

            <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 hover:from-fuchsia-600 hover:to-cyan-600 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
            >
                {isLoading ? <Spinner /> : 'Generate Logo'}
            </button>
            
            {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
            
            <div className="mt-4 w-full">
                {generatedImage ? (
                    <div className="flex flex-col items-center gap-4">
                        <h3 className="text-xl font-semibold text-slate-200 mb-2">Your Generated Logo</h3>
                        <div className="w-full max-w-2xl aspect-square bg-slate-900/50 rounded-lg flex items-center justify-center border-2 border-slate-700 p-2 shadow-lg">
                            <img src={generatedImage} alt="Generated logo" className="rounded-lg object-contain max-w-full max-h-full" />
                        </div>
                        <button
                            onClick={handleDownload}
                            className="mt-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center gap-2 text-lg shadow-lg shadow-green-500/20 hover:shadow-green-500/30"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Logo
                        </button>
                    </div>
                ) : (
                    <div className="w-full aspect-square bg-slate-900/50 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-700">
                        {isLoading ? <Spinner size="lg" /> : (
                            <div className="text-center text-slate-500">
                                <GenerateIcon />
                                <p className="mt-2">Your generated logo will appear here</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageGenerator;