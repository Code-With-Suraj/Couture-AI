import { GoogleGenAI, Type, Modality } from "@google/genai";
import { OutfitSuggestion } from '../types';

const getAiClient = () => {
    // API_KEY is automatically injected by the environment.
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY environment variable not set.");
    }
    return new GoogleGenAI({ apiKey });
};

const outfitSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            type: {
                type: Type.STRING,
                enum: ['Formal', 'Casual', 'Stylish'],
                description: 'The type of the outfit suggestion category.',
            },
            outfits: {
                type: Type.ARRAY,
                description: 'A list of 3 distinct outfit variations for this category.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        description: {
                            type: Type.STRING,
                            description: 'A detailed description of this specific outfit variation.',
                        },
                        items: {
                            type: Type.ARRAY,
                            description: 'A list of clothing item names for this outfit, e.g., "White Cotton T-Shirt".',
                            items: {
                                type: Type.STRING,
                            },
                        }
                    },
                    required: ['description', 'items'],
                },
            },
        },
        required: ['type', 'outfits'],
    },
};

export const getOutfitSuggestions = async (imageBase64: string, mimeType: string): Promise<OutfitSuggestion[]> => {
    const ai = getAiClient();
    const model = 'gemini-2.5-pro';

    const prompt = `Act as a world-class fashion stylist with over 15 years of experience dressing high-profile clients. Analyze this full-body photo of a person from India. Your task is to provide expert-level outfit recommendations. Create suggestions for three distinct categories: 'Formal', 'Casual', and 'Stylish'. For EACH category, suggest exactly THREE different, sophisticated outfit variations. For each variation, provide a detailed description that explains *why* the look works, considering elements like silhouette, fabric, color theory, and the occasion. Also include a list of the specific clothing item names (e.g., "Single-Breasted Navy Wool Blazer", "Crisp White Poplin Shirt"). Do not provide purchase links. Respond ONLY with a JSON object matching the provided schema. Your tone should be authoritative, insightful, and inspiring, reflecting your deep expertise. The suggestions should be culturally aware and modern.`;

    const imagePart = {
        inlineData: {
            data: imageBase64,
            mimeType: mimeType,
        },
    };
    const textPart = { text: prompt };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: 'application/json',
                responseSchema: outfitSchema,
            },
        });

        const jsonString = response.text.trim();
        const suggestions = JSON.parse(jsonString) as OutfitSuggestion[];

        // Basic validation
        if (!Array.isArray(suggestions) || suggestions.length === 0) {
            throw new Error('AI response is not a valid array of suggestions.');
        }

        return suggestions;

    } catch (error) {
        console.error("Error fetching outfit suggestions:", error);
        throw new Error("Failed to parse or receive suggestions from the AI model.");
    }
};

export const generateTryOnImages = async (imageBase64: string, mimeType: string, outfitDescription: string): Promise<string[]> => {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash-image';

    const prompt = `Take the person from the input image and realistically dress them in the following outfit: "${outfitDescription}". Maintain their facial features, body shape, and the original background as much as possible. Generate 3 different variations of this look, showing slightly different poses or angles if possible.`;

    const imagePart = {
        inlineData: {
            data: imageBase64,
            mimeType: mimeType,
        },
    };
    const textPart = { text: prompt };

    const generatedImages: string[] = [];
    
    // Generate 3 images sequentially
    for (let i = 0; i < 3; i++) {
        try {
            const response = await ai.models.generateContent({
                model: model,
                contents: { parts: [imagePart, textPart] },
                config: {
                    responseModalities: [Modality.IMAGE],
                },
            });

            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const base64ImageBytes = part.inlineData.data;
                    const imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
                    generatedImages.push(imageUrl);
                }
            }
        } catch (error) {
             console.error(`Error generating image ${i+1}:`, error);
             // If one fails, we can continue and return what we have
        }
    }
    
    if (generatedImages.length === 0) {
        throw new Error("The AI model failed to generate any images.");
    }

    return generatedImages;
};