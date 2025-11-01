import React, { useState } from 'react';
import { generateBrandKit } from '../services/geminiService';
import Spinner from './Spinner';
import ErrorAlert from './ErrorAlert';
import Button from './Button';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import SectionHeader from './SectionHeader';

interface BrandKit {
    colorPalette: {
        primary: string;
        secondary: string;
        accent: string;
    };
    fontPairings: {
        heading: string;
        body: string;
    };
    taglines: string[];
}

const BrandKitGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [brandKit, setBrandKit] = useState<BrandKit | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [copiedValue, setCopiedValue] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError("Prompt cannot be empty.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setBrandKit(null);

        try {
            const brandKitResult = await generateBrandKit(prompt);
            const parsedBrandKit = JSON.parse(brandKitResult);
            setBrandKit(parsedBrandKit);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setError(`Failed to generate brand kit: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedValue(text);
        setTimeout(() => setCopiedValue(null), 2000);
    };

    return (
        <div className="flex flex-col gap-6">
            <SectionHeader title="Create Your Brand Kit" subtitle="Define your brand's identity with a custom color palette, fonts, and taglines." />
            <div>
                <label htmlFor="prompt-brandkit" className="block text-sm font-medium text-slate-300 mb-2">
                    Describe your business
                </label>
                <textarea
                    id="prompt-brandkit"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A sustainable coffee shop that sources beans ethically and creates a cozy, rustic atmosphere."
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 h-28 resize-none"
                    disabled={isLoading}
                />
            </div>

            <Button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full py-3 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 flex items-center justify-center"
            >
                {isLoading ? <Spinner /> : 'Generate Brand Kit'}
            </Button>
            
            {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
            
            {brandKit && (
                <div className="mt-4 p-4 bg-slate-800/60 rounded-lg">
                    <h3 className="text-xl font-semibold text-slate-200 mb-4">Your Brand Kit</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <h4 className="text-lg font-semibold text-slate-300 mb-2">Color Palette</h4>
                            <div className="flex gap-2">
                                {Object.entries(brandKit.colorPalette).map(([name, color]) => (
                                    <div key={name} className="flex flex-col items-center gap-1">
                                        <div 
                                            className="w-12 h-12 rounded-lg cursor-pointer" 
                                            style={{ backgroundColor: color }}
                                            onClick={() => handleCopyToClipboard(color)}
                                        ></div>
                                        <span className="text-xs text-slate-400">{copiedValue === color ? 'Copied!' : color}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-slate-300 mb-2">Font Pairings</h4>
                            <p className="text-slate-400">Heading: {brandKit.fontPairings.heading}</p>
                            <p className="text-slate-400">Body: {brandKit.fontPairings.body}</p>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-slate-300 mb-2">Taglines</h4>
                            <ul className="space-y-2 text-slate-400">
                                {brandKit.taglines.map((tagline, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <span>{tagline}</span>
                                        <button onClick={() => handleCopyToClipboard(tagline)}>
                                            {copiedValue === tagline ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrandKitGenerator;
