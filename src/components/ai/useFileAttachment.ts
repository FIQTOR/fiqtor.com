import { useCallback, useRef, useState } from 'react';
import { MAX_FILE_SIZE } from './types';
import type { AttachedFile } from './types';

/**
 * Manages the composer's file attachment: drag-and-drop, the native picker
 * (per media type), size validation and removal.
 *
 * @param onError - surfaces a user-facing error message
 */
export function useFileAttachment(onError: (message: string) => void) {
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processFile = useCallback(
    (selectedFile: File) => {
      onError('');
      if (selectedFile.size > MAX_FILE_SIZE) {
        onError('File exceeds max limit of 4.5MB');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = (reader.result as string).split(',')[1] || '';
        setAttachedFile({
          name: selectedFile.name,
          mimeType: selectedFile.type || 'application/octet-stream',
          data: base64Data,
        });
      };
      reader.readAsDataURL(selectedFile);
    },
    [onError]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) processFile(selectedFile);
    },
    [processFile]
  );

  const removeAttachedFile = useCallback(() => {
    setAttachedFile(null);
    onError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [onError]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files?.[0];
      if (droppedFile) processFile(droppedFile);
    },
    [processFile]
  );

  // Open the native file picker for a specific media type.
  const openFilePicker = useCallback((accept: string) => {
    setShowAttachMenu(false);
    onError('');
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  }, [onError]);

  /** Reset the attachment (used after a successful send). */
  const clearAttachment = useCallback(() => {
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  return {
    attachedFile,
    isDragging,
    showAttachMenu,
    setShowAttachMenu,
    fileInputRef,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeAttachedFile,
    openFilePicker,
    clearAttachment,
  };
}
