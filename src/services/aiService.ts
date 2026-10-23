import { buildPublicKnowledgeContext } from './aiContextService';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ContentGeneratorInput {
  contentType: string;
  topic: string;
  keyInfo?: string;
  tone?: string;
  length?: string;
  additionalInstructions?: string;
}

export interface ArticleAssistantInput {
  action: 'generate' | 'improve' | 'rewrite' | 'expand' | 'shorten' | 'headline' | 'excerpt';
  title?: string;
  topic?: string;
  facts?: string;
  existingContent?: string;
  tone?: string;
  length?: string;
}

export interface ArticleAssistantResponse {
  title: string;
  excerpt: string;
  content: string[];
  rawText?: string;
}

/**
 * Public Visitor AI Assistant ("Ask Revel House")
 */
export async function sendPublicChatMessage(messages: ChatMessage[]): Promise<string> {
  const lastUserMessage = messages.filter((m) => m.role === 'user').slice(-1)[0]?.content || '';
  
  // Build clean RAG context
  const context = await buildPublicKnowledgeContext(lastUserMessage);

  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, context }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'The AI assistant is temporarily busy. Please try again shortly.');
  }

  const data = await response.json();
  return data.answer;
}

/**
 * Admin AI Content Generator
 */
export async function generateAdminContent(
  input: ContentGeneratorInput,
  adminUid?: string
): Promise<string> {
  const response = await fetch('/api/ai/generate-content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Content generation failed. Please try again.');
  }

  const data = await response.json();
  const generated = data.generatedContent;

  // Log to ai_generated_content audit trail
  try {
    await addDoc(collection(db, 'ai_generated_content'), {
      type: input.contentType,
      action: 'generate_content',
      topic: input.topic,
      prompt: input,
      generatedContent: generated,
      createdBy: adminUid || 'admin',
      status: 'draft',
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    // Non-blocking audit log warning
    console.warn('Could not save AI audit log:', err);
  }

  return generated;
}

/**
 * Admin AI Article Assistant
 */
export async function generateAdminArticle(
  input: ArticleAssistantInput,
  adminUid?: string
): Promise<ArticleAssistantResponse> {
  const response = await fetch('/api/ai/generate-article', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || 'Article processing failed. Please try again.');
  }

  const data: ArticleAssistantResponse = await response.json();

  // Log to ai_generated_content audit trail
  try {
    await addDoc(collection(db, 'ai_generated_content'), {
      type: 'article',
      action: input.action,
      topic: input.topic || input.title || 'Article Assistance',
      prompt: input,
      generatedContent: data,
      createdBy: adminUid || 'admin',
      status: 'draft',
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Could not save AI audit log:', err);
  }

  return data;
}
