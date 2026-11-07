/**
 * Cloudflare Pages Function helper for AI completions.
 * Uses context.env for secrets.
 */
export function clampText(value, maxLength) {
  return String(value ?? '').slice(0, maxLength);
}

export function sanitizeMessages(messages, { maxMessages = 8, maxChars = 2000 } = {}) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant'))
    .slice(-maxMessages)
    .map((m) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: clampText(m.content, maxChars),
    }))
    .filter((m) => m.content.trim().length > 0);
}

export async function executeAICompletion({ env, systemMessage = '', userPrompt = '', messages = [], temperature = 0.3, maxTokens = 1200 }) {
  const geminiKey = (env?.GEMINI_API_KEY || env?.gemni || '').trim();
  const openrouterKey = (env?.OPENROUTER_API_KEY || '').trim();
  const geminiModel = (env?.GEMINI_MODEL || 'gemini-3.1-flash-lite').trim();

  // 1. Try Gemini API first
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
      const timeout = setTimeout(() => controller.abort(), 15000);

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
      }
    } catch (err) {
      console.warn('[Cloudflare AI Function] Gemini error:', err?.message || err);
    }
  }

  // 2. Try OpenRouter API fallback
  if (openrouterKey) {
    try {
      const formattedMessages = [];
      if (systemMessage) formattedMessages.push({ role: 'system', content: systemMessage });
      if (messages && messages.length > 0) {
        formattedMessages.push(...messages);
      } else if (userPrompt) {
        formattedMessages.push({ role: 'user', content: userPrompt });
      }

      const openrouterModel = (env?.OPENROUTER_MODEL || 'openrouter/free').trim();
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openrouterKey}`,
        },
        body: JSON.stringify({
          model: openrouterModel,
          messages: formattedMessages,
          temperature,
          max_tokens: maxTokens,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) return text;
      }
    } catch (err) {
      console.warn('[Cloudflare AI Function] OpenRouter error:', err?.message || err);
    }
  }

  console.error('[Cloudflare AI Function] All providers failed or no API keys configured.');
  throw new Error('The AI assistant service is temporarily unavailable. Please try again shortly.');
}
