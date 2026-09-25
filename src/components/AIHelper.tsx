import React, { useState, useEffect, useRef } from 'react';
import { TbBrandGithubCopilot, TbX, TbUpload } from 'react-icons/tb';
import { BRAND_NAME } from "@/config/Identity";
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useAIChat } from './ai/useAIChat';
import { useSpeechDictation } from './ai/useSpeechDictation';
import { useFileAttachment } from './ai/useFileAttachment';
import AIMessageList from './ai/AIMessageList';
import AIComposer from './ai/AIComposer';

const SUGGESTED_QUESTIONS = [
  `Who's ${BRAND_NAME}?`,
  `Show ${BRAND_NAME} projects`,
  `Go to ${BRAND_NAME} Instagram?`,
  "Go to contact page?",
];

/**
 * Floating AI assistant panel. Orchestrates three focused hooks (chat, voice
 * dictation, file attachment) and two presentational children (message list
 * and composer).
 */
const AIHelper: React.FC = () => {
  const [active, setActive] = useState(false);
  const [prompt, setPrompt] = useState('');
  // First-visit tooltip: derive from storage once via a lazy initializer
  // (avoids a state-setting effect).
  const [showTooltip, setShowTooltip] = useState(
    () => typeof window !== 'undefined' && !localStorage.getItem('hasSeenAITooltip')
  );
  const [error, setError] = useState<string | null>(null);

  const aiHelperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const attachMenuRef = useRef<HTMLDivElement | null>(null);

  const closePanel = React.useCallback(() => setActive(false), []);
  // Trap focus + Escape-to-close while the panel is open.
  const panelRef = useFocusTrap<HTMLDivElement>(active, closePanel);

  const file = useFileAttachment(setError);
  const { attachedFile, clearAttachment, fileInputRef, isDragging } = file;

  const clearComposer = () => {
    setPrompt('');
    clearAttachment();
  };

  const chat = useAIChat(prompt, attachedFile, clearComposer);
  const { isRecording, toggleRecording } = useSpeechDictation(prompt, setPrompt, setError, active);

  // Block page scroll while the panel is open, without shifting layout width.
  useEffect(() => {
    if (!active) return;

    const blockScroll = (e: Event) => {
      const target = e.target as Node | null;
      if (target && aiHelperRef.current?.contains(target)) {
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

  // Focus the composer when the panel opens.
  useEffect(() => {
    if (active) {
      const t = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(t);
    }
  }, [active]);

  // Close the attach menu when clicking outside of it.
  useEffect(() => {
    if (!file.showAttachMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(e.target as Node)) {
        file.setShowAttachMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [file]);

  // Auto-grow the composer textarea to fit its content (up to the max-height).
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [prompt, active]);

  // Close when clicking outside the panel.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (aiHelperRef.current && !aiHelperRef.current.contains(event.target as Node)) {
        setActive(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dismissTooltip = () => {
    setShowTooltip(false);
    localStorage.setItem('hasSeenAITooltip', 'true');
  };

  return (
    <div
      ref={aiHelperRef}
      onDragOver={file.handleDragOver}
      onDragLeave={file.handleDragLeave}
      onDrop={file.handleDrop}
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
              aria-label="Dismiss tip"
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
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="FIQ AI assistant"
        className={`absolute bottom-0 right-0 flex w-[min(92vw,26rem)] flex-col gap-3 transition-all duration-300 ease-out origin-bottom-right ${active
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
          }`}
      >
        {/* Close button */}
        <button
          onClick={() => setActive(false)}
          aria-label="Close assistant"
          title="Close"
          className={`absolute -top-2 -right-2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900/90 text-white shadow-xl backdrop-blur-md transition-all hover:bg-neutral-700 ${active ? 'opacity-100 delay-150' : 'opacity-0'
            }`}
        >
          <TbX className="h-4 w-4" />
        </button>

        <AIMessageList
          messages={chat.messages}
          loading={chat.loading}
          copiedIndex={chat.copiedIndex}
          messagesEndRef={chat.messagesEndRef}
          onEdit={(text) => {
            setPrompt(text);
            inputRef.current?.focus();
          }}
          onCopy={chat.copyToClipboard}
          onRegenerate={() => chat.handleSubmit(undefined, true)}
        />

        {/* File error / attachment preview */}
        {(error || attachedFile) && (
          <div className="space-y-1">
            {error && (
              <div className="rounded-lg bg-red-500/20 text-red-600 dark:text-red-300 p-2 text-xs backdrop-blur-md">
                {error}
              </div>
            )}

            {attachedFile && (
              <div className="flex items-center justify-between rounded-lg bg-neutral-200/80 dark:bg-neutral-800/80 p-2 text-xs backdrop-blur-md text-neutral-800 dark:text-neutral-200">
                <span className="truncate max-w-50">📎 {attachedFile.name}</span>
                <button onClick={file.removeAttachedFile} className="hover:text-red-500">
                  <TbX className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Suggested questions (empty state) */}
        {chat.messages.length === 0 && (
          <div className="rounded-2xl bg-white/80 p-3 shadow-lg backdrop-blur-md dark:bg-neutral-800/80">
            <p className="mb-2 text-xs font-medium text-neutral-700 dark:text-neutral-300">
              Suggested Questions:
            </p>
            <div className="space-y-1.5">
              {SUGGESTED_QUESTIONS.map((question) => (
                <button
                  key={question}
                  onClick={() => {
                    setPrompt(question);
                    chat.handleSubmit(question);
                  }}
                  className="cursor-pointer w-full rounded-md bg-neutral-100 px-3 py-1.5 text-left text-xs text-neutral-700 transition-colors hover:bg-neutral-200 dark:bg-neutral-700/50 dark:text-neutral-300 dark:hover:bg-neutral-700"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <AIComposer
          prompt={prompt}
          setPrompt={setPrompt}
          inputRef={inputRef}
          loading={chat.loading}
          attachedFile={attachedFile}
          isRecording={isRecording}
          showAttachMenu={file.showAttachMenu}
          setShowAttachMenu={file.setShowAttachMenu}
          attachMenuRef={attachMenuRef}
          fileInputRef={fileInputRef}
          onFileChange={file.handleFileChange}
          onOpenFilePicker={file.openFilePicker}
          onToggleRecording={toggleRecording}
          onSubmit={() => chat.handleSubmit()}
        />
      </div>
    </div>
  );
};

export default AIHelper;
