import { SYSTEM_PROMPT } from './constants';

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

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20241022",
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{
          role: "user",
          content: `It is currently ${new Date().toString()}. Search the web for what is genuinely trending right now in each category. Find actual timestamps for each item. Be specific — no generic answers. Return real trending topics with sharp, clear explanations.`
        }],
      }),
    });

    const data = await response.json();
    const text = data.content.filter(b => b.type === "text").map(b => b.text).join("");
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) throw new Error("No JSON found");
    
    const parsed = JSON.parse(jsonMatch[0]);
    clearInterval(interval);
    return { data: parsed };
    
  } catch (error) {
    clearInterval(interval);
    return { error: "Couldn't load trends right now. Try refreshing." };
  }
};