import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AttachedFile, Message, StreamChunk } from './types';

/**
 * Owns the AI conversation: message history, streaming submit, regenerate and
 * copy-to-clipboard. Keeps all network + state logic out of the view layer.
 *
 * @param prompt - current composer text (read when submitting without an arg)
 * @param attachedFile - file queued for the next send
 * @param clearComposer - callback to reset prompt/file after a send
 */
export function useAIChat(
  prompt: string,
  attachedFile: AttachedFile | null,
  clearComposer: () => void
) {
  const router = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to the newest message.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const copyToClipboard = useCallback((text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }, []);

  const handleSubmit = useCallback(
    async (manualQuestion?: string, isRegenerate = false) => {
      let questionText = manualQuestion !== undefined ? manualQuestion : prompt.trim();
      let fileToSend = attachedFile;

      if (isRegenerate) {
        const lastUserMsg = [...messages].reverse().find((m) => m.type === 'question');
        if (!lastUserMsg) return;
        questionText = lastUserMsg.text;
        fileToSend = null;
      } else if (!questionText && !fileToSend) {
        return;
      }

      setLoading(true);
      if (!isRegenerate) clearComposer();

      if (!isRegenerate) {
        const newQuestion: Message = {
          type: 'question',
          text: questionText,
          fileName: fileToSend?.name,
        };
        setMessages((prev) => [...prev, newQuestion, { type: 'answer', text: '' }]);
      } else {
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last && last.type === 'answer') {
            const updated = [...prev];
            updated[updated.length - 1] = { type: 'answer', text: '' };
            return updated;
          }
          return [...prev, { type: 'answer', text: '' }];
        });
      }

      try {
        const historySource = isRegenerate ? messages.slice(0, -1) : messages;
        const history = historySource
          .filter((m) => m.type === 'question' || m.type === 'answer')
          .map((m) => ({
            role: m.type === 'question' ? 'user' : 'model',
            parts: [{ text: m.text }],
          }));

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/ai/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: questionText,
            history,
            file: fileToSend ? { data: fileToSend.data, mimeType: fileToSend.mimeType } : undefined,
          }),
        });

        if (!response.body) return;

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const lines = decoder.decode(value).split('\n');

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const jsonStr = line.replace('data: ', '');
            if (jsonStr === '[DONE]') return;

            try {
              const data: StreamChunk = JSON.parse(jsonStr);

              if (data.type === 'redirectLocal' && data.url) {
                router(data.url);
                return;
              }

              if (data.type === 'redirect') {
                setMessages((prev) => {
                  const next = [...prev];
                  next[next.length - 1] = {
                    type: 'redirect',
                    text: data.text ?? '',
                    platform: data.platform,
                  };
                  return next;
                });
                return;
              }

              accumulatedText += data.text ?? '';

              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = { type: 'answer', text: accumulatedText };
                return next;
              });
            } catch (e) {
              console.error('Error parsing chunk', e);
            }
          }
        }
      } catch (error) {
        console.error('Stream fetch error:', error);
      } finally {
        setLoading(false);
      }
    },
    [prompt, attachedFile, messages, router, clearComposer]
  );

  return { messages, loading, copiedIndex, copyToClipboard, handleSubmit, messagesEndRef };
}
