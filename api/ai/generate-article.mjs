import { executeAICompletion } from '../../lib/ai-completion.mjs';

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const { action, title, topic, facts, existingContent, tone, length } = req.body || {};

    const systemMessage = `You are the Revel House Uganda editorial assistant.
Create and improve professional nonprofit news articles and communications based strictly on the facts provided by the administrator.

CRITICAL RULES:
1. PRESERVE ALL FACTS: Do not alter numbers, dates, locations, names, or project outcomes provided in the original draft or instructions.
2. Never invent statistics, names, dates, locations, project results, beneficiaries, or organizational claims.
3. Write in a professional, warm, and human-centered style suitable for the official Revel House Uganda website.
4. Output structured content with clear headings and concise paragraphs.

Respond in JSON format if possible with keys:
{
  "title": "Article Title",
  "excerpt": "Short 1-2 sentence summary excerpt",
  "content": ["Paragraph 1", "Paragraph 2", "Paragraph 3"]
}`;

    const userPrompt = `
ACTION REQUIRED: ${action || 'generate'}
${title ? `EXISTING TITLE: ${title}` : ''}
${topic ? `TOPIC: ${topic}` : ''}
${facts ? `IMPORTANT FACTS & DATA: ${facts}` : ''}
${existingContent ? `EXISTING ARTICLE CONTENT:\n${existingContent}` : ''}
TONE: ${tone || 'Professional'}
LENGTH: ${length || 'Medium'}

Instructions: Provide an improved draft. Maintain strict factual integrity. Return a structured title, excerpt, and paragraph content.
`.trim();

    const responseText = await executeAICompletion({
      systemMessage,
      userPrompt,
      temperature: 0.3,
      maxTokens: 1500,
    });

    let parsed;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      }
    } catch {
      // Fallback
    }

    if (parsed && parsed.title && parsed.excerpt) {
      return res.json({
        title: parsed.title,
        excerpt: parsed.excerpt,
        content: Array.isArray(parsed.content) ? parsed.content : [parsed.content],
        rawText: responseText,
      });
    }

    const lines = responseText.split('\n').map((l) => l.trim()).filter(Boolean);
    const fallbackTitle = title || lines[0] || 'Article Draft';
    const fallbackExcerpt = lines[1] || 'Draft excerpt created by AI assistant.';
    const fallbackContent = lines.slice(2).filter((l) => !l.startsWith('{') && !l.startsWith('}'));

    return res.json({
      title: fallbackTitle.replace(/^#+\s*/, ''),
      excerpt: fallbackExcerpt,
      content: fallbackContent.length > 0 ? fallbackContent : [responseText],
      rawText: responseText,
    });
  } catch (err) {
    console.error('API /api/ai/generate-article error:', err.message);
    return res.status(500).json({
      error: err.message || 'Unable to process article with AI assistant. Please try again.',
    });
  }
}