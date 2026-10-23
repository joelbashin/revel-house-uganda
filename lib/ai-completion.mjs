/**
 * Shared AI Model Completion Handler (Vercel serverless).
 * Executes ONE AI model per request (prefers Gemini API, falls back to OpenRouter API).
 */
export async function executeAICompletion({ systemMessage, userPrompt, messages, temperature = 0.3, maxTokens = 1200 }) {
  const geminiKey = (process.env.GEMINI_API_KEY || process.env.gemni || '').trim();
  const openrouterKey = (process.env.OPENROUTER_API_KEY || '').trim();
  const geminiModel = (process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite').trim();

  let lastError = null;

  // 1. Try Gemini API first if key available
  if (geminiKey) {
    try {
      let promptText = '';
      if (systemMessage) promptText += systemMessage + '\n\n';
      if (messages && messages.length > 0) {
        promptText += messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
      } else if (userPrompt) {
        promptText += userPrompt;
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
          }),
          signal: controller.signal,
        }
      );
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      } else {
        const errText = await res.text();
        console.warn(`[AI Server] Gemini status ${res.status}: ${errText.substring(0, 120)}`);
      }
    } catch (err) {
      console.warn('[AI Server] Gemini fetch error:', err.message);
      lastError = err;
    }
  }

  // 2. Try OpenRouter API if Gemini was unavailable or failed
  if (openrouterKey) {
    try {
      const formattedMessages = [];
      if (systemMessage) formattedMessages.push({ role: 'system', content: systemMessage });
      if (messages && messages.length > 0) {
        formattedMessages.push(...messages);
      } else if (userPrompt) {
        formattedMessages.push({ role: 'user', content: userPrompt });
      }

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openrouterKey}`,
          'HTTP-Referer': 'https://revelhouseuganda.org',
          'X-Title': 'Revel House Uganda',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL || 'openrouter/free',
          messages: formattedMessages,
          temperature,
          max_tokens: maxTokens,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) return text;
      } else {
        const errText = await res.text();
        console.warn(`[AI Server] OpenRouter status ${res.status}: ${errText.substring(0, 120)}`);
      }
    } catch (err) {
      console.warn('[AI Server] OpenRouter fetch error:', err.message);
      lastError = err;
    }
  }

  throw new Error(lastError?.message || 'The AI assistant service is temporarily unavailable. Please try again in a few moments.');
}