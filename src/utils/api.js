import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from './constants';

// Initialize the Gemini client
const ai = new GoogleGenAI({ 
  apiKey: process.env.REACT_APP_GEMINI_KEY 
});

export const fetchTrends = async (setLoadingMsg, setLoadingStep, LOADING_MSGS) => {
  let interval = setInterval(() => {
    setLoadingStep(step => {
      const next = step + 1;
      if (next < LOADING_MSGS.length) {
        setLoadingMsg(LOADING_MSGS[next]);
        return next;
      }
      return step;
    });
  }, 3000);

  // List of currently available models with search grounding [citation:5]
  const models = [
    "gemini-2.5-flash",      // Recommended for most use cases [citation:5]
    "gemini-2.5-flash-lite", // Fast, lightweight queries [citation:5]
    "gemini-2.5-pro",        // Complex reasoning with search [citation:5]
    "gemini-3.1-flash-lite"  // Newest, fastest model [citation:10]
  ];

  try {
    setLoadingMsg("Searching the web for trends...");

    let lastError = null;

    // Try each model in order
    for (const modelName of models) {
      try {
        console.log(`🔄 Trying model: ${modelName}`);
        setLoadingMsg(`Trying ${modelName}...`);

        const response = await ai.models.generateContent({
          model: modelName,
          contents: SYSTEM_PROMPT + "\n\nCurrent date/time: " + new Date().toString(),
          config: {
            tools: [{ googleSearch: {} }], // Enables Google Search grounding [citation:5]
            temperature: 0.2,
            maxOutputTokens: 2000,
          },
        });

        const text = response.text;
        
        if (!text) {
          console.log(`❌ Empty response from ${modelName}`);
          continue;
        }

        console.log(`✅ Got response from ${modelName}, length:`, text.length);
        
        // Clean and parse JSON
        let cleanedText = text
          .replace(/```json\n?|\n?```/g, '')
          .replace(/```\n?/g, '')
          .trim();
        
        const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          console.log(`❌ No JSON found in response from ${modelName}`);
          continue;
        }
        
        let parsed;
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch (parseError) {
          // Try to fix common JSON errors
          const fixed = jsonMatch[0]
            .replace(/,(\s*[}\]])/g, '$1')
            .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":');
          parsed = JSON.parse(fixed);
        }
        
        // Validate categories
        const requiredCategories = ['movie', 'music', 'show', 'news', 'policy', 'viral'];
        const missingCategories = requiredCategories.filter(cat => !parsed[cat]);
        
        if (missingCategories.length > 0) {
          console.log(`❌ Missing categories from ${modelName}:`, missingCategories);
          continue;
        }
        
        // Success!
        clearInterval(interval);
        return { data: parsed };
        
      } catch (modelError) {
        console.log(`❌ Model ${modelName} failed:`, modelError.message);
        lastError = modelError;
        continue;
      }
    }

    // If all models fail, throw the last error
    throw lastError || new Error("All models failed");
    
  } catch (error) {
    clearInterval(interval);
    console.error("Gemini API error:", error);
    
    // Helpful error messages
    if (error.message?.includes("billing")) {
      return { error: "Billing not enabled. Web search requires a paid tier API key. [citation:5]" };
    } else if (error.message?.includes("quota") || error.message?.includes("429")) {
      return { error: "Rate limit exceeded. Please try again in a moment." };
    } else {
      return { error: "Couldn't load trends. Please try again." };
    }
  }
};