import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from './constants';
import { enhanceWithTrendsData } from './trendsMapper';

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

  // Only models that consistently work
  const models = [
    "gemini-2.5-pro",      // ✅ Most reliable (always long responses)
  ];

  try {
    setLoadingMsg("Finding trending topics...");

    let lastError = null;

    for (const modelName of models) {
      try {
        console.log(`🔄 Using model: ${modelName}`);
        setLoadingMsg(`Analyzing trends...`);

        const response = await ai.models.generateContent({
          model: modelName,
          contents: SYSTEM_PROMPT + "\n\nCurrent date/time: " + new Date().toString(),
          config: {
            tools: [{ googleSearch: {} }],
            temperature: 0.2,
            maxOutputTokens: 2000,
          },
        });

        const text = response.text;
        
        if (!text) {
          console.log(`❌ Empty response from ${modelName}`);
          continue;
        }

        console.log(`✅ Got response, length: ${text.length}`);
        
        // Clean and parse JSON
        let cleanedText = text
          .replace(/```json\n?|\n?```/g, '')
          .replace(/```\n?/g, '')
          .trim();
        
        const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          console.log(`❌ No JSON found in response`);
          continue;
        }
        
        let parsed;
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch (parseError) {
          const fixed = jsonMatch[0]
            .replace(/,(\s*[}\]])/g, '$1')
            .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":');
          parsed = JSON.parse(fixed);
        }
        
        // Validate categories
        const requiredCategories = ['movie', 'music', 'show', 'news', 'policy', 'viral'];
        const missingCategories = requiredCategories.filter(cat => !parsed[cat]);
        
        if (missingCategories.length > 0) {
          console.log(`❌ Missing categories:`, missingCategories);
          continue;
        }
        
        // SUCCESS! Enhance with Google Trends data
        clearInterval(interval);
        
        setLoadingMsg("Enhancing with Google Trends data...");
        const enhancedData = await enhanceWithTrendsData(parsed);
        
        console.log("✅ Final data with Google Trends talking numbers!");
        return { data: enhancedData };
        
      } catch (modelError) {
        console.log(`❌ Model ${modelName} failed:`, modelError.message);
        lastError = modelError;
      }
    }

    throw lastError || new Error("All models failed");
    
  } catch (error) {
    clearInterval(interval);
    console.error("Gemini API error:", error);
    
    if (error.message?.includes("billing")) {
      return { error: "Billing not enabled. Web search requires a paid tier API key." };
    } else if (error.message?.includes("quota") || error.message?.includes("429")) {
      return { error: "Rate limit exceeded. Please try again in a moment." };
    } else {
      return { error: "Couldn't load trends. Please try again." };
    }
  }
};