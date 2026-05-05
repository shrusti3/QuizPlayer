import { GoogleGenAI } from '@google/genai';

// Initialize the SDK. We use the VITE_ prefix to expose the env var to Vite.
// We only initialize if the key is present.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let ai = null;

if (apiKey && apiKey !== 'your_api_key_here') {
  ai = new GoogleGenAI({ apiKey });
}

export async function generateQuiz(topic, difficulty) {
  if (!ai) {
    throw new Error("Gemini API Key is missing. Please add it to your .env.local file.");
  }

  const prompt = `
Generate a 10-question multiple choice quiz about "${topic}".
The difficulty should be "${difficulty}".

You must return ONLY a JSON array of objects, with no markdown formatting, no code blocks, and no extra text.
Each object must have the exact following structure:
{
  "q": "The question text",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "a": 0, // The integer index (0-3) of the correct option
  "explanation": "A brief 1-2 sentence explanation of why the correct answer is right."
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    const json = JSON.parse(text);
    return json;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
}
