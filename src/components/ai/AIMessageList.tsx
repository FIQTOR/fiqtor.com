import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { TbPencil, TbCopy, TbCheck, TbRefresh } from 'react-icons/tb';
import type { Message } from './types';

const MarkdownMessage = lazy(() => import('../MarkdownMessage'));

interface AIMessageListProps {
  messages: Message[];
  loading: boolean;
  copiedIndex: number | null;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onEdit: (text: string) => void;
  onCopy: (text: string, index: number) => void;
  onRegenerate: () => void;
}

/** Renders the scrollable conversation history with per-message actions. */
export default function AIMessageList({
  messages,
  loading,
  copiedIndex,
  messagesEndRef,
  onEdit,
  onCopy,
  onRegenerate,
}: AIMessageListProps) {
  return (
    <div
      className="ai-scrollable max-h-[min(60vh,32rem)] overflow-y-auto overflow-x-hidden overscroll-contain rounded-2xl p-1"
      id="responses"
    >
      <div className="flex flex-col gap-4">
        {messages.map((message, index) => {
          if (message.text === '' && message.type === 'answer') return null;

          const isLastAnswer = message.type === 'answer' && index === messages.length - 1;

          if (message.type === 'question') {
            return (
              <div key={index} className="flex items-center justify-end gap-2 w-full">
                <div className="relative px-4 py-2 w-fit max-w-[85%] bg-neutral-600/30 backdrop-blur-md rounded-2xl shadow-xl text-right">
                  {message.fileName && (
                    <span className="text-[10px] text-blue-400 italic font-mono block mb-1">
                      📎 Attached: {message.fileName}
                    </span>
                  )}
                  <div className="whitespace-pre-wrap wrap-break-word font-extralight text-sm markdown-body">
                    <Suspense fallback={<span className="whitespace-pre-wrap">{message.text}</span>}>
                      <MarkdownMessage text={message.text} />
                    </Suspense>
                  </div>
                </div>

                <button
                  onClick={() => onEdit(message.text)}
                  className="p-1 rounded-full hover:bg-neutral-800/40 text-neutral-400 hover:text-white transition-colors shrink-0"
                  title="Edit question"
                >
                  <TbPencil className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          }

          return (
            <div key={index} className="flex flex-col items-start gap-1 w-full">
              <div className="relative px-4 py-2 w-fit max-w-full bg-transparent backdrop-blur-md rounded-2xl shadow-xl text-left">
                <div className="whitespace-pre-wrap wrap-break-word font-extralight text-sm markdown-body">
                  <Suspense fallback={<span className="whitespace-pre-wrap">{message.text}</span>}>
                    <MarkdownMessage text={message.text} />
                  </Suspense>
                </div>

                {message.type === 'redirect' && (
                  <Link
                    to={`${message.platform}`}
                    className="mt-2 inline-block px-2 py-px rounded-md bg-neutral-100 dark:text-black text-sm"
                  >
                    Open Link
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-1.5 self-start pl-2 text-neutral-400">
                <button
                  onClick={() => onCopy(message.text, index)}
                  className="p-1 rounded-full hover:bg-neutral-800/40 hover:text-white transition-colors"
                  title="Copy message"
                >
                  {copiedIndex === index ? (
                    <TbCheck className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <TbCopy className="h-3.5 w-3.5" />
                  )}
                </button>

                {isLastAnswer && !loading && (
                  <button
                    onClick={onRegenerate}
                    className="p-1 rounded-full hover:bg-neutral-800/40 hover:text-white transition-colors"
                    title="Regenerate response"
                  >
                    <TbRefresh className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex w-full justify-start items-center gap-2">
            <span className="loader scale-50"></span>
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
