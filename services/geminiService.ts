
import { GoogleGenAI, Type } from "@google/genai";
import { Quote } from '../types';

export const fetchInspirationalQuote = async (): Promise<Quote> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Generate a short, impactful, and modern inspirational quote. The quote should feel fresh and resonate with someone trying to focus and be productive. Avoid clichés. Return only the quote text and the author.",
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    quote: {
                        type: Type.STRING,
                        description: 'The inspirational quote text.'
                    },
                    author: {
                        type: Type.STRING,
                        description: 'The author of the quote. Can be "Unknown" if not attributable.'
                    }
                },
                required: ['quote', 'author']
            }
        }
    });

    const jsonText = response.text.trim();
    const parsed = JSON.parse(jsonText);
    return parsed as Quote;

  } catch (error) {
    console.error("Failed to fetch quote from Gemini:", error);
    return {
      quote: "The best way to predict the future is to create it.",
      author: "Peter Drucker",
    };
  }
};

export const fetchComplexResponse = async (prompt: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 32768,
        },
      },
    });
    return response.text;
  } catch (error) {
    console.error("Failed to fetch complex response from Gemini:", error);
    if (error instanceof Error) {
      return `An error occurred while processing your request. Please try again.\n\nDetails: ${error.message}`;
    }
    return "An unknown error occurred while processing your request. Please try again.";
  }
};
