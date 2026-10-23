import { executeAICompletion } from '../../lib/ai-completion.mjs';

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const { contentType, topic, keyInfo, tone, length, additionalInstructions } = req.body || {};

    if (!topic || !contentType) {
      return res.status(400).json({ error: 'ContentType and topic are required.' });
    }

    const systemMessage = `You are the expert content creation assistant for Revel House Uganda.
Create clear, engaging, professional, and humanitarian-focused content drafts for administrators.

CRITICAL RULES:
1. Base all generated drafts strictly on the topic and key information provided by the administrator.
2. Do NOT invent specific numbers, dates, locations, project results, or names unless explicitly provided.
3. Write in a warm, professional, human-centered style suitable for a Ugandan community NGO.
4. Output well-structured, formatted content matching the requested length and tone.`;

    const userPrompt = `
CONTENT TYPE: ${contentType}
TOPIC: ${topic}
KEY INFORMATION: ${keyInfo || 'None provided'}
TONE: ${tone || 'Professional'}
LENGTH: ${length || 'Medium'}
ADDITIONAL INSTRUCTIONS: ${additionalInstructions || 'None'}

Please generate a high-quality draft for this ${contentType}.
`.trim();

    const result = await executeAICompletion({
      systemMessage,
      userPrompt,
      temperature: 0.4,
      maxTokens: 1200,
    });

    return res.json({ generatedContent: result });
  } catch (err) {
    console.error('API /api/ai/generate-content error:', err.message);
    return res.status(500).json({
      error: err.message || 'Unable to generate content draft. Please try again.',
    });
  }
}