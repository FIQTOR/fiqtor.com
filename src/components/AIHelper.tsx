import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  TbBrandGithubCopilot,
  TbSend,
  TbPaperclip,
  TbRefresh,
  TbX,
  TbCopy,
  TbCheck,
  TbPencil,
  TbUpload,
} from 'react-icons/tb';
import { useNavigate as useRouter } from "react-router-dom";
import { BRAND_NAME } from "@/config/Identity";
import { Link } from "react-router-dom";

interface AttachedFile {
  name: string;
  mimeType: string;
  data: string;
}

interface Message {
  type: string;
  text: string;
  platform?: string;
  fileName?: string;
}

const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // 4.5MB limit

const AIHelper: React.FC = () => {
  const router = useRouter();
  const [active, setActive] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const aiHelperRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const hasSeen = localStorage.getItem('hasSeenAITooltip');
    if (!hasSeen) {
      setShowTooltip(true);
    }
  }, []);

  const dismissTooltip = () => {
    setShowTooltip(false);
    localStorage.setItem('hasSeenAITooltip', 'true');
  };

  const processFile = (selectedFile: File) => {
    setFileError(null);
    if (selectedFile.size > MAX_FILE_SIZE) {
      setFileError('File exceeds max limit of 4.5MB');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1] || '';
      setAttachedFile({
        name: selectedFile.name,
        mimeType: selectedFile.type || 'application/octet-stream',
        data: base64Data,
      });
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) processFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) processFile(droppedFile);
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleEditUserMessage = (text: string) => {
    setPrompt(text);
    inputRef.current?.focus();
  };

  const handleSubmit = async (manualQuestion?: string, isRegenerate = false) => {
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
    if (!isRegenerate) {
      setPrompt('');
      setAttachedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }

    let displayQuestion = questionText;
    if (!isRegenerate) {
      const newQuestion: Message = {
        type: 'question',
        text: displayQuestion,
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

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.replace('data: ', '');
          if (jsonStr === '[DONE]') return;

          try {
            const data = JSON.parse(jsonStr);

            if (data.type === 'redirectLocal') {
              router(data.url);
              return;
            }

            if (data.type === 'redirect') {
              setMessages((prev) => {
                const newMsgs = [...prev];
                newMsgs[newMsgs.length - 1] = {
                  type: 'redirect',
                  text: data.text,
                  platform: data.platform,
                };
                return newMsgs;
              });
              return;
            }

            accumulatedText += data.text;

            setMessages((prev) => {
              const newMsgs = [...prev];
              newMsgs[newMsgs.length - 1] = {
                type: 'answer',
                text: accumulatedText,
              };
              return newMsgs;
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
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (aiHelperRef.current && !aiHelperRef.current.contains(event.target as Node)) {
        setActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={aiHelperRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="fixed bottom-28 md:bottom-10 z-50 duration-300 flex items-center right-5"
    >
      {/* Drag & Drop Visual Overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-50 bg-blue-600/30 backdrop-blur-md flex flex-col items-center justify-center border-4 border-dashed border-blue-400 text-white rounded-3xl pointer-events-none">
          <TbUpload className="h-16 w-16 animate-bounce mb-3" />
          <p className="text-xl font-bold">Drop your file here</p>
          <span className="text-sm opacity-80">Maximum file size: 4.5MB</span>
        </div>
      )}

      {showTooltip && !active && (
        <div className="absolute right-16 bottom-3 z-20 flex items-center transition-all duration-300 animate-pulse">
          <div
            onClick={() => {
              setActive(true);
              dismissTooltip();
            }}
            className="relative cursor-pointer backdrop-blur-xl bg-neutral-900/90 dark:bg-neutral-800/90 text-white px-3 py-1.5 rounded-full shadow-xl border border-white/20 dark:border-neutral-700/60 text-xs flex items-center gap-2 whitespace-nowrap hover:scale-105 transition-transform"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[11px] font-medium">Ask AI ✨</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                dismissTooltip();
              }}
              className="text-neutral-400 hover:text-white p-0.5 rounded-full hover:bg-white/10 transition-colors"
              title="Dismiss"
            >
              <TbX className="h-3 w-3" />
            </button>
            <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[6px] border-l-neutral-900/90 dark:border-l-neutral-800/90"></div>
          </div>
        </div>
      )}

      <button
        onClick={() => {
          setActive(!active);
          if (showTooltip) dismissTooltip();
        }}
        className={`absolute cursor-pointer rounded-full bg-neutral-800/50 backdrop-blur-sm border border-neutral-300 dark:border-neutral-800 shadow-xl p-3 text-white duration-300 z-10 ${active ? 'scale-[0.6] -left-7' : 'right-0 bottom-0'
          }`}
      >
        <span className="absolute -bottom-2 right-0 px-1 py-px rounded-full w-full whitespace-nowrap text-neutral-700 dark:text-neutral-400 text-xs font-black">
          FIQ AI
        </span>
        <TbBrandGithubCopilot className="h-7 w-7 animate-pulse" />
      </button>

      <div className="relative flex flex-col">
        <div
          className={`absolute bottom-full mb-2 w-full space-y-1 transition-all duration-200 ease-out origin-bottom ${active
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto delay-150'
            : 'opacity-0 scale-90 translate-y-4 pointer-events-none delay-0'
            }`}
        >
          {fileError && (
            <div className="rounded-lg bg-red-500/20 text-red-600 dark:text-red-300 p-2 text-xs backdrop-blur-md">
              {fileError}
            </div>
          )}

          {attachedFile && (
            <div className="flex items-center justify-between rounded-lg bg-neutral-200/80 dark:bg-neutral-800/80 p-2 text-xs backdrop-blur-md text-neutral-800 dark:text-neutral-200">
              <span className="truncate max-w-50">📎 {attachedFile.name}</span>
              <button onClick={removeAttachedFile} className="hover:text-red-500">
                <TbX className="h-4 w-4" />
              </button>
            </div>
          )}

          {messages.length === 0 && (
            <div className="rounded-lg bg-white/80 p-3 shadow-lg backdrop-blur-md dark:bg-neutral-800/80">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Suggested Questions:
                </p>
                <span className="text-[10px] font-mono text-neutral-400">Max 4.5MB</span>
              </div>
              <div className="space-y-1.5">
                {[
                  `Who's ${BRAND_NAME}?`,
                  `Show ${BRAND_NAME} projects`,
                  `Go to ${BRAND_NAME} Instagram?`,
                  "Go to contact page?",
                ].map((question: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => {
                      setPrompt(question);
                      handleSubmit(question);
                    }}
                    className="cursor-pointer w-full rounded-md bg-neutral-100 px-3 py-1.5 text-left text-xs text-neutral-700 transition-colors hover:bg-neutral-200 dark:bg-neutral-700/50 dark:text-neutral-300 dark:hover:bg-neutral-700"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,.pdf,.txt,.doc,.docx"
        />

        <div
          className={`relative flex items-center transition-all duration-300 ease-out ${active ? 'w-80 delay-0' : 'w-0 delay-150'
            }`}
        >
          <input
            ref={inputRef}
            type="text"
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            placeholder="Ask me anything..."
            className={`text-sm w-full rounded-r-full border-y border-b-neutral-300 border-t-neutral-400 bg-transparent py-1 shadow-md backdrop-blur-md focus:outline-none dark:border-b-neutral-500 dark:border-t-neutral-700 pl-7 pr-14 transition-all duration-300 ${active ? 'w-80 opacity-100 delay-0' : 'w-0 opacity-0 pointer-events-none delay-150'
              }`}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
            disabled={loading}
          />
          <div
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1.5 dark:text-neutral-300 text-neutral-700 transition-opacity duration-200 ${active ? 'opacity-100 delay-100' : 'opacity-0 pointer-events-none delay-0'
              }`}
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              title="Attach file (Max 4.5MB)"
              className="hover:text-blue-500 transition-colors flex items-center gap-0.5"
            >
              <TbPaperclip className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={loading}
              title="Send message"
              className="hover:text-blue-500 transition-colors"
            >
              <TbSend className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`absolute -bottom-10 pb-20 right-0 overflow-y-auto overflow-x-hidden max-h-screen pr-20 translate-x-20 -z-10 transition-all duration-300 ${active
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        id="responses"
      >
        <div className="flex flex-col gap-4 w-80">
          {messages.map((message, index) => {
            if (message.text === '' && message.type === 'answer') return null;

            const isLastAnswer = message.type === 'answer' && index === messages.length - 1;

            if (message.type === 'question') {
              return (
                <div key={index} className="flex items-center justify-end gap-2 w-80">
                  <div className="relative px-4 py-2 w-fit max-w-[85%] bg-neutral-600/30 backdrop-blur-md rounded-2xl shadow-xl text-right">
                    {message.fileName && (
                      <span className="text-[10px] text-blue-400 italic font-mono block mb-1">
                        📎 Attached: {message.fileName}
                      </span>
                    )}
                    <div className="whitespace-pre-wrap wrap-break-word font-extralight text-sm markdown-body">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
                    </div>
                  </div>

                  {/* Edit icon button OUTSIDE bubble on the right */}
                  <button
                    onClick={() => handleEditUserMessage(message.text)}
                    className="p-1 rounded-full hover:bg-neutral-800/40 text-neutral-400 hover:text-white transition-colors shrink-0"
                    title="Edit question"
                  >
                    <TbPencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            }

            return (
              <div key={index} className="flex flex-col items-start gap-1 w-80">
                <div className="relative px-4 py-2 w-fit max-w-full bg-transparent backdrop-blur-md rounded-2xl shadow-xl text-left">
                  <div className="whitespace-pre-wrap wrap-break-word font-extralight text-sm markdown-body">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
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

                {/* AI Toolbar on the LEFT side */}
                <div className="flex items-center gap-1.5 self-start pl-2 text-neutral-400">
                  <button
                    onClick={() => copyToClipboard(message.text, index)}
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
                      onClick={() => handleSubmit(undefined, true)}
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
            <div className="flex w-80 justify-start items-center gap-2">
              <span className="loader scale-50"></span>
              <span className="text-neutral-700 dark:text-neutral-300 text-sm">Thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default AIHelper;
