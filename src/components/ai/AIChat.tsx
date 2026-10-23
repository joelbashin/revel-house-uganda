import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, AlertCircle, ArrowUpRight } from 'lucide-react';
import { sendPublicChatMessage, ChatMessage } from '../../services/aiService';
import { AIChatButton } from './AIChatButton';

interface AIChatProps {
  onNavigate?: (path: string) => void;
}

const SUGGESTED_QUESTIONS = [
  'What is Revel House Uganda?',
  'Tell me about your WASH program.',
  'How can I sponsor a child?',
  'How can I volunteer or partner?',
  'How do I donate to a project?',
  'What projects are currently active?',
];

export const AIChat: React.FC<AIChatProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Hello! Welcome to Revel House Uganda. How can I help you learn about our programs, projects, and community initiatives today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    setError(null);
    setInput('');

    const updatedMessages: ChatMessage[] = [...messages, { role: 'user', content: query }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const answer = await sendPublicChatMessage(updatedMessages);
      setMessages((prev) => [...prev, { role: 'assistant', content: answer }]);
    } catch (err: any) {
      console.error('AIChat error:', err);
      setError(
        err.message || 'The assistant is temporarily unavailable. Please try again in a few moments.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const parseLinksInText = (text: string) => {
    // Detect paths like /programs, /projects, /donate, /contact, /sponsor-a-child, /get-involved
    const pathRegex = /(\/(?:programs|projects|donate|contact|sponsor-a-child|get-involved|partner|about|wash|news|impact))/gi;
    const parts = text.split(pathRegex);

    return parts.map((part, i) => {
      if (pathRegex.test(part) && onNavigate) {
        return (
          <button
            key={i}
            onClick={() => {
              onNavigate(part);
              setIsOpen(false);
            }}
            className="inline-flex items-center gap-1 font-semibold text-[#69B53F] hover:underline underline-offset-2 mx-1 px-1.5 py-0.5 rounded bg-[#69B53F]/10 border border-[#69B53F]/20"
          >
            <span>{part}</span>
            <ArrowUpRight className="w-3 h-3 inline" />
          </button>
        );
      }
      return part;
    });
  };

  return (
    <>
      <AIChatButton isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />

      {isOpen && (
        <div
          role="dialog"
          aria-label="Ask Revel House AI Chat Window"
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[600px] h-[calc(100vh-8rem)] bg-[var(--c-surface)] text-[var(--c-ink)] rounded-3xl shadow-2xl border border-[var(--c-line)] flex flex-col overflow-hidden transition-all duration-300"
        >
          {/* HEADER */}
          <div className="px-5 py-4 bg-[var(--c-soft)] border-b border-[var(--c-line)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#D35400] to-[#69B53F] flex items-center justify-center text-white shadow-sm">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-editorial text-base text-[var(--c-ink)] leading-tight flex items-center gap-1.5">
                  Ask Revel House
                </h3>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close dialog"
              className="p-1.5 rounded-full hover:bg-[var(--c-ink)]/10 text-[var(--c-ink)]/70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* MESSAGES AREA */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs sm:text-sm">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-[#69B53F]/15 flex items-center justify-center text-[#69B53F] shrink-0 mt-0.5">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] px-4 py-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-[#D35400] to-[#F4A300] text-white rounded-br-none shadow-sm'
                      : 'bg-[var(--c-bg)] text-[var(--c-ink)] rounded-bl-none border border-[var(--c-line)]'
                  }`}
                >
                  {msg.role === 'assistant' ? parseLinksInText(msg.content) : msg.content}
                </div>
              </div>
            ))}

            {/* SUGGESTED QUESTIONS CHIPS (show if user hasn't sent many messages) */}
            {messages.length <= 2 && !isLoading && (
              <div className="pt-2 space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--c-ink)]/50 block">
                  Suggested Questions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="text-left text-xs px-3 py-1.5 rounded-full bg-[var(--c-soft)] border border-[var(--c-line)] text-[var(--c-ink)] hover:border-[#69B53F] hover:text-[#69B53F] transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* LOADING STATE */}
            {isLoading && (
              <div className="flex gap-2.5 items-center text-xs text-[var(--c-ink)]/60 pt-1">
                <div className="w-7 h-7 rounded-full bg-[#69B53F]/15 flex items-center justify-center text-[#69B53F] shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="bg-[var(--c-bg)] px-4 py-2.5 rounded-2xl rounded-bl-none border border-[var(--c-line)] flex items-center gap-2">
                  <span className="font-mono text-[11px]">Ask Revel House is thinking</span>
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#69B53F] animate-bounce"></span>
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[#69B53F] animate-bounce"
                      style={{ animationDelay: '0.15s' }}
                    ></span>
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[#69B53F] animate-bounce"
                      style={{ animationDelay: '0.3s' }}
                    ></span>
                  </span>
                </div>
              </div>
            )}

            {/* ERROR BANNER */}
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span>{error}</span>
                  <button
                    onClick={() => {
                      setError(null);
                      handleSend(messages.filter((m) => m.role === 'user').slice(-1)[0]?.content);
                    }}
                    className="block text-[10px] underline font-semibold mt-1 hover:text-red-700"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT AREA */}
          <div className="p-3 bg-[var(--c-soft)] border-t border-[var(--c-line)] space-y-2">
            <div className="relative flex items-center">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about Revel House..."
                aria-label="Your question"
                disabled={isLoading}
                className="w-full pl-3 pr-10 py-2.5 text-xs sm:text-sm rounded-2xl bg-[var(--c-surface)] text-[var(--c-ink)] border border-[var(--c-line)] focus:outline-none focus:ring-2 focus:ring-[#69B53F]/40 resize-none max-h-24 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                className="absolute right-2 p-1.5 rounded-xl bg-[#69B53F] text-white hover:bg-[#5aa134] disabled:opacity-40 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-[var(--c-ink)]/50 px-1 font-mono">
              <span>Verified CMS Content Only</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
