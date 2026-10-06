import { TbPaperclip, TbMicrophone, TbPlayerStop, TbSend, TbPhoto, TbVideo, TbFileText } from 'react-icons/tb';
import type { AttachedFile } from './types';
import { useTranslation } from '@/i18n';

interface AIComposerProps {
  prompt: string;
  setPrompt: (value: string) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  loading: boolean;
  attachedFile: AttachedFile | null;
  isRecording: boolean;
  showAttachMenu: boolean;
  setShowAttachMenu: React.Dispatch<React.SetStateAction<boolean>>;
  attachMenuRef: React.RefObject<HTMLDivElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenFilePicker: (accept: string) => void;
  onToggleRecording: () => void;
  onSubmit: () => void;
}

/** Composer row: attach menu, dictation toggle and send button. */
export default function AIComposer({
  prompt,
  setPrompt,
  inputRef,
  loading,
  attachedFile,
  isRecording,
  showAttachMenu,
  setShowAttachMenu,
  attachMenuRef,
  fileInputRef,
  onFileChange,
  onOpenFilePicker,
  onToggleRecording,
  onSubmit,
}: AIComposerProps) {
  const { t } = useTranslation();
  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        className="hidden"
        accept="image/*"
      />

      <div className="flex flex-col rounded-3xl border border-neutral-200/70 bg-white/85 shadow-2xl backdrop-blur-xl dark:border-neutral-700/60 dark:bg-neutral-900/85">
        <textarea
          ref={inputRef}
          rows={1}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
          placeholder={t("ai.composerPlaceholder")}
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
              aria-label={t("ai.attach")}
              title={t("ai.attach")}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors focus-ring focus-ring-rounded hover:bg-neutral-200/70 hover:text-blue-500 dark:hover:bg-neutral-700/60 ${showAttachMenu ? 'bg-neutral-200/70 text-blue-500 dark:bg-neutral-700/60' : ''
                }`}
            >
              <TbPaperclip className="h-5 w-5" />
            </button>

            <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 select-none">
              {t("ai.attachMax")}
            </span>

            {showAttachMenu && (
              <div
                ref={attachMenuRef}
                className="absolute bottom-full left-0 mb-2 z-30 w-44 overflow-hidden rounded-2xl border border-neutral-200/70 bg-white/95 p-1 shadow-2xl backdrop-blur-xl dark:border-neutral-700/60 dark:bg-neutral-900/95"
              >
                <button
                  type="button"
                  onClick={() => onOpenFilePicker('image/*')}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-neutral-700 transition-colors focus-ring hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <TbPhoto className="h-4 w-4 text-blue-500" />
                  {t("ai.attachImage")}
                </button>
                <button
                  type="button"
                  onClick={() => onOpenFilePicker('video/*')}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-neutral-700 transition-colors focus-ring hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <TbVideo className="h-4 w-4 text-emerald-500" />
                  {t("ai.attachVideo")}
                </button>
                <button
                  type="button"
                  onClick={() => onOpenFilePicker('.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx')}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-neutral-700 transition-colors focus-ring hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  <TbFileText className="h-4 w-4 text-amber-500" />
                  {t("ai.attachDocument")}
                </button>
              </div>
            )}
          </div>

          {/* Mic / recording bars / Send */}
          <div className="flex items-center gap-1.5">
            {isRecording && (
              <div className="recording-bars" role="img" aria-label={t("ai.recording")} title={t("ai.recording")}>
                <span />
                <span />
                <span />
                <span />
              </div>
            )}

            <button
              type="button"
              onClick={onToggleRecording}
              disabled={loading}
              aria-label={isRecording ? t("ai.stopDictation") : t("ai.startDictation")}
              title={isRecording ? t("ai.stopDictation") : t("ai.dictateWithVoice")}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-ring focus-ring-rounded disabled:cursor-not-allowed disabled:opacity-40 ${isRecording
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
              onClick={onSubmit}
              disabled={loading || (!prompt.trim() && !attachedFile)}
              aria-label={t("ai.send")}
              title={t("ai.send")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all focus-ring focus-ring-rounded hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <TbSend className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
