
import { GoogleGenerativeAI, Content } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const getGenAI = () => {
    return genAI;
};

export const generateLogo = async (prompt: string): Promise<string> => {
    const ai = getGenAI();
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages[0].image.imageBytes;
    }
    throw new Error("No images were generated.");
};

export const editImage = async (
    base64Image: string,
    mimeType: string,
    prompt: string
): Promise<string> => {
    const ai = getGenAI();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                {
                    inlineData: {
                        data: base64Image,
                        mimeType: mimeType,
                    },
                },
                {
                    text: prompt,
                },
            ],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }

    throw new Error("No edited image was returned.");
};

export const createIdeaChat = (systemInstruction: string, history?: Content[]): any => {
    const ai = getGenAI();
    return ai.chats.create({
        model: 'gemini-2.5-flash-lite',
        history: history,
        config: {
            systemInstruction: systemInstruction,
        },
    });
};

export const analyzeImage = async (base64Image: string, mimeType: string, personaInstruction: string): Promise<string> => {
    const ai = getGenAI();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                {
                    inlineData: {
                        data: base64Image,
                        mimeType: mimeType,
                    },
                },
                {
                    text: personaInstruction,
                },
            ],
        },
    });
    return response.candidates[0].content.parts[0].text ?? "No analysis was returned.";
}

export const generateBrandKit = async (prompt: string): Promise<string> => {
    const ai = getGenAI();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: {
            parts: [
                {
                    text: `Generate a brand kit for a business with the following description: ${prompt}. The brand kit should be a JSON object with the following structure: { "colorPalette": { "primary": "#...", "secondary": "#...", "accent": "#..." }, "fontPairings": { "heading": "...", "body": "..." }, "taglines": ["...", "...", "..."] }.`,
                },
            ],
        },
    });
    return response.candidates[0].content.parts[0].text ?? "No brand kit was generated.";
}
