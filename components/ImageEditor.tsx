import React, { useState } from 'react';
import { editImage } from '../services/geminiService';
import Spinner from './Spinner';
import ErrorAlert from './ErrorAlert';
import { EditIcon } from './icons/EditIcon';

interface ImageFile {
    file: File;
    previewUrl: string;
}

const fileToDataUrl = (file: File): Promise<{ data: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            const [header, data] = result.split(',');
            if (!header || !data) {
                return reject(new Error("Invalid file format"));
            }
            const mimeType = header.match(/:(.*?);/)?.[1] || 'application/octet-stream';
            resolve({ data, mimeType });
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

const ImageEditor: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('Add a retro, vintage filter to the logo');
    const [originalImage, setOriginalImage] = useState<ImageFile | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setOriginalImage({
                file,
                previewUrl: URL.createObjectURL(file),
            });
            setEditedImage(null);
            setError(null);
        }
    };

    const handleEdit = async () => {
        if (!originalImage) {
            setError("Please upload an image first.");
            return;
        }
        if (!prompt.trim()) {
            setError("Prompt cannot be empty.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setEditedImage(null);

        try {
            const { data, mimeType } = await fileToDataUrl(originalImage.file);
            const imageBytes = await editImage(data, mimeType, prompt);
            setEditedImage(`data:${mimeType};base64,${imageBytes}`);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setError(`Failed to edit image: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Original Image */}
                <div className="w-full aspect-square bg-slate-900/50 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-slate-700 p-4">
                    {originalImage ? (
                        <img src={originalImage.previewUrl} alt="Original logo" className="rounded-lg object-contain max-w-full max-h-full" />
                    ) : (
                        <div className="text-center">
                             <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <p className="text-slate-500 my-2">Upload your logo</p>
                            <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/10 file:text-cyan-300 hover:file:bg-cyan-500/20" />
                        </div>
                    )}
                </div>

                {/* Edited Image */}
                <div className="w-full aspect-square bg-slate-900/50 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-700">
                     {isLoading && <Spinner size="lg" />}
                    {!isLoading && editedImage && (
                        <img src={editedImage} alt="Edited logo" className="rounded-lg object-contain max-w-full max-h-full" />
                    )}
                    {!isLoading && !editedImage && (
                         <div className="text-center text-slate-500">
                            <EditIcon />
                            <p className="mt-2">Your edited logo will appear here</p>
                        </div>
                    )}
                </div>
            </div>
             <div>
                <label htmlFor="prompt-edit" className="block text-sm font-medium text-slate-300 mb-2">
                    How should we edit it?
                </label>
                <textarea
                    id="prompt-edit"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Make the background transparent"
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200 h-28 resize-none"
                    disabled={isLoading || !originalImage}
                />
            </div>
            <button
                onClick={handleEdit}
                disabled={isLoading || !originalImage}
                className="w-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 hover:from-fuchsia-600 hover:to-cyan-600 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
            >
                {isLoading ? <Spinner /> : 'Apply Edit'}
            </button>
            {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
        </div>
    );
};

export default ImageEditor;