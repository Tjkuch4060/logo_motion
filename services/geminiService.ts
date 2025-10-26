
import { GoogleGenAI, Modality, Chat } from "@google/genai";

const getGenAI = () => {
    // We recreate the instance every time to ensure the most up-to-date API key is used.
    // This is important for environments where the key might be selected or changed by the user at runtime.
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
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
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }

    throw new Error("No edited image was returned.");
};

export const createIdeaChat = (): Chat => {
    const ai = getGenAI();
    return ai.chats.create({
        model: 'gemini-2.5-flash-lite',
        config: {
            systemInstruction: 'You are a creative assistant specializing in brainstorming business names and logo ideas. Keep your responses concise, creative, and helpful. Provide suggestions in short, easy-to-read formats like lists.',
        },
    });
};
