import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
const MarkdownMessage = lazy(() => import('./MarkdownMessage'));
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
  TbMicrophone,
  TbPlayerStop,
  TbPhoto,
  TbVideo,
  TbFileText,
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
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [showAttachMenu, setShowAttachMenu] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const aiHelperRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const attachMenuRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const basePromptRef = useRef<string>('');

  useEffect(() => {
    const hasSeen = localStorage.getItem('hasSeenAITooltip');
    if (!hasSeen) {
      setShowTooltip(true);
    }
  }, []);

  // Block page scrolling while the panel is open WITHOUT removing the
  // scrollbar (so the page width stays identical). We keep the page as-is
  // (no overflow: hidden) and simply swallow wheel / touchmove gestures
  // outside the panel's own scroll area. `html { scrollbar-gutter: stable }`
  // reserves the scrollbar space so nothing shifts.
  useEffect(() => {
    if (!active) return;

    const blockScroll = (e: Event) => {
      const target = e.target as Node | null;
      if (target && aiHelperRef.current?.contains(target)) {
        // Allow scrolling inside the AI panel's own scrollable regions.
        if ((target as HTMLElement).closest?.('.ai-scrollable')) return;
      }
      e.preventDefault();
    };

    window.addEventListener('wheel', blockScroll, { passive: false });
    window.addEventListener('touchmove', blockScroll, { passive: false });

    return () => {
      window.removeEventListener('wheel', blockScroll);
      window.removeEventListener('touchmove', blockScroll);
    };
  }, [active]);

  // Close the panel on Escape.
  useEffect(() => {
    if (!active) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active]);

  // Focus the composer when the panel opens.
  useEffect(() => {
    if (active) {
      const t = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(t);
    }
  }, [active]);

  // Close the attach menu when clicking outside of it.
  useEffect(() => {
    if (!showAttachMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(e.target as Node)) {
        setShowAttachMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showAttachMenu]);

  // Stop dictation when the panel closes or the component unmounts.
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
    };
  }, []);

  // Stop dictation when the panel is closed.
  useEffect(() => {
    if (!active && isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }
  }, [active, isRecording]);

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

  // Open the native file picker for a specific media type.
  const openFilePicker = (accept: string) => {
    setShowAttachMenu(false);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const startRecording = () => {
    setFileError(null);

    const SpeechRecognitionImpl =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionImpl) {
      setFileError('Voice input is not supported on this browser.');
      return;
    }

    const recognition = new SpeechRecognitionImpl();
    recognition.lang = navigator.language || 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    // Remember what the user already typed so dictation appends to it.
    basePromptRef.current = prompt ? prompt.replace(/\s*$/, ' ') : '';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += transcript;
        else interim += transcript;
      }

      if (final) {
        basePromptRef.current = `${basePromptRef.current}${final} `;
      }
      setPrompt(`${basePromptRef.current}${interim}`);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setFileError('Microphone access was denied.');
      } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setFileError('Voice input error. Please try again.');
      }
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;
      setPrompt((prev) => prev.replace(/\s+$/, ''));
    };

    try {
      recognition.start();
      setIsRecording(true);
    } catch {
      setFileError('Voice input error. Please try again.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) stopRecording();
    else startRecording();
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

  // Auto-grow the composer textarea to fit its content (up to the max-height).
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [prompt, active]);

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
      className="fixed bottom-24 right-7 md:bottom-7 z-50 flex items-center"
    >
      {/* Drag & Drop Visual Overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-50 bg-blue-600/30 backdrop-blur-md flex flex-col items-center justify-center border-4 border-dashed border-blue-400 text-white rounded-3xl pointer-events-none">
          <TbUpload className="h-16 w-16 animate-bounce mb-3" />
          <p className="text-xl font-bold">Drop your file here</p>
          <span className="text-sm opacity-80">Maximum file size: 4.5MB</span>
        </div>
      )}

      {/* Dim + blur backdrop while the AI panel is open */}
      <div
        onClick={() => setActive(false)}
        aria-hidden="true"
        className={`fixed inset-0 -z-10 bg-neutral-950/40 backdrop-blur-sm transition-opacity duration-300 ${active ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      />

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
        className={`absolute cursor-pointer rounded-full bg-neutral-800/50 backdrop-blur-sm border border-neutral-300 dark:border-neutral-800 shadow-xl p-3 text-white duration-300 z-10 ${active ? 'scale-0 opacity-0 pointer-events-none' : 'right-0 bottom-0 opacity-100 scale-100'
          }`}
      >
        <span className="absolute -bottom-2 right-0 px-1 py-px rounded-full w-full whitespace-nowrap text-neutral-700 dark:text-neutral-400 text-xs font-black">
          FIQ AI
        </span>
        <TbBrandGithubCopilot className="h-7 w-7 animate-pulse" />
      </button>

      {/* Stacked panel: message history (scrolls) above the composer (pinned) */}
      <div
        className={`absolute bottom-0 right-0 flex w-[min(92vw,26rem)] flex-col gap-3 transition-all duration-300 ease-out origin-bottom-right ${active
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
          }`}
      >
        {/* Close button */}
        <button
          onClick={() => setActive(false)}
          title="Close"
          className={`absolute -top-2 -right-2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900/90 text-white shadow-xl backdrop-blur-md transition-all hover:bg-neutral-700 ${active ? 'opacity-100 delay-150' : 'opacity-0'
            }`}
        >
          <TbX className="h-4 w-4" />
        </button>

        {/* History */}
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
                        <Suspense fallback={<span className="whitespace-pre-wrap">{message.text}</span>}><MarkdownMessage text={message.text} /></Suspense>
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
                <div key={index} className="flex flex-col items-start gap-1 w-full">
                  <div className="relative px-4 py-2 w-fit max-w-full bg-transparent backdrop-blur-md rounded-2xl shadow-xl text-left">
                    <div className="whitespace-pre-wrap wrap-break-word font-extralight text-sm markdown-body">
                      <Suspense fallback={<span className="whitespace-pre-wrap">{message.text}</span>}><MarkdownMessage text={message.text} /></Suspense>
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
              <div className="flex w-full justify-start items-center gap-2">
                <span className="loader scale-50"></span>
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* File error / attachment preview */}
        {(fileError || attachedFile) && (
          <div className="space-y-1">
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
          </div>
        )}

        {/* Suggested questions (empty state) */}
        {messages.length === 0 && (
          <div className="rounded-2xl bg-white/80 p-3 shadow-lg backdrop-blur-md dark:bg-neutral-800/80">
            <p className="mb-2 text-xs font-medium text-neutral-700 dark:text-neutral-300">
              Suggested Questions:
            </p>
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

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />

        {/* Composer */}
        <div className="flex flex-col rounded-3xl border border-neutral-200/70 bg-white/85 shadow-2xl backdrop-blur-xl dark:border-neutral-700/60 dark:bg-neutral-900/85">
          <textarea
            ref={inputRef}
            rows={1}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Ask me anything…  (Shift + Enter for new line)"
            className="max-h-52 min-h-[3rem] w-full resize-none rounded-t-3xl bg-transparent px-5 pt-4 pb-2 text-sm leading-relaxed text-neutral-800 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-100 dark:placeholder:text-neutral-500"
            disabled={loading}
          />

          <div className="flex items-center justify-between gap-2 px-3 pb-3 pt-1">
            {/* Attach (with type picker) */}
            <div className="relative flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
              <button
                type="button"
                onClick={() => setShowAttachMenu((v) => !v)}
                disabled={loading}
                title="Attach file (Max 4.5MB)"
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-neutral-200/70 hover:text-blue-500 dark:hover:bg-neutral-700/60 ${showAttachMenu ? 'bg-neutral-200/70 text-blue-500 dark:bg-neutral-700/60' : ''
                  }`}
              >
                <TbPaperclip className="h-5 w-5" />
              </button>

              <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 select-none">
                Max 4.5MB
              </span>

              {showAttachMenu && (
                <div
                  ref={attachMenuRef}
                  className="absolute bottom-full left-0 mb-2 z-30 w-44 overflow-hidden rounded-2xl border border-neutral-200/70 bg-white/95 p-1 shadow-2xl backdrop-blur-xl dark:border-neutral-700/60 dark:bg-neutral-900/95"
                >
                  <button
                    type="button"
                    onClick={() => openFilePicker('image/*')}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  >
                    <TbPhoto className="h-4 w-4 text-blue-500" />
                    Image
                  </button>
                  <button
                    type="button"
                    onClick={() => openFilePicker('video/*')}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  >
                    <TbVideo className="h-4 w-4 text-emerald-500" />
                    Video
                  </button>
                  <button
                    type="button"
                    onClick={() => openFilePicker('.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx')}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  >
                    <TbFileText className="h-4 w-4 text-amber-500" />
                    Document
                  </button>
                </div>
              )}
            </div>

            {/* Mic / recording bars / Send */}
            <div className="flex items-center gap-1.5">
              {isRecording && (
                <div className="recording-bars" title="Recording…">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              )}

              <button
                type="button"
                onClick={toggleRecording}
                disabled={loading}
                title={isRecording ? 'Stop dictation' : 'Dictate with your voice'}
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${isRecording
                  ? 'bg-red-500/15 text-red-500 hover:bg-red-500/25'
                  : 'text-neutral-500 hover:bg-neutral-200/70 hover:text-blue-500 dark:text-neutral-400 dark:hover:bg-neutral-700/60'
                  }`}
              >
                {isRecording ? (
                  <TbPlayerStop className="h-5 w-5" />
                ) : (
                  <TbMicrophone className="h-5 w-5" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={loading || (!prompt.trim() && !attachedFile)}
                title="Send message"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <TbSend className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIHelper;
