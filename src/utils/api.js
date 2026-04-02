import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from './constants';
import { enhanceWithTrendsData } from './trendsMapper';

const ai = new GoogleGenAI({ 
  apiKey: process.env.REACT_APP_GEMINI_KEY 
});

export const fetchTrends = async (
  setLoadingMsg, 
  setLoadingStep, 
  LOADING_MSGS,
  locationMode,
  userLocation
) => {
  console.log('🔍 fetchTrends called with:', { locationMode, userLocation });
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
    "gemini-2.5-pro",         // ✅ Known supported (previous stable)
    "gemini-3.0-mini",        // ⚡ Fallback (less expensive, still fast)
    "gemini-3.5-pro",         // 🆕 Fallback if newer model is available
  ];

  try {
    setLoadingMsg("Finding trending topics...");

    let lastError = null;

    for (const modelName of models) {
      try {
        console.log(`🔄 Using model: ${modelName}`);
        setLoadingMsg(`Analyzing trends...`);

        // Build location-aware prompt
        let locationPrompt = '';
        if (locationMode === 'local' && userLocation?.city) {
          locationPrompt = `
IMPORTANT: Find trends SPECIFIC TO ${userLocation.city}, ${userLocation.country || 'your region'}.

Search for:
- Local news headlines from ${userLocation.city}
- Events happening in ${userLocation.city} right now
- Social media trends specific to this area
- Local entertainment (music, movies, shows popular here)
- Regional viral moments

The trends MUST be about ${userLocation.city} or specifically relevant to people there.
`;
        } else {
          locationPrompt = 'Find GLOBAL trends from around the world.';
        }

        console.log('📍 Location prompt:', locationPrompt);

        const fullPrompt = SYSTEM_PROMPT + 
          `\n\nCurrent date/time: ${new Date().toString()}` +
          `\n\n${locationPrompt}`;

        console.log('🤖 Full prompt being sent to AI:', fullPrompt);

        const response = await ai.models.generateContent({
          model: modelName,
          contents: fullPrompt,
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
        console.log('📄 AI Response:', text.substring(0, 500) + '...');

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
          console.log('🎯 Parsed trends data:', parsed);
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