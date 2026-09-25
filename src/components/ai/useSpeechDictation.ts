import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Voice dictation via the Web Speech API. Appends recognized speech to the
 * composer text and stops cleanly when the panel closes or the component
 * unmounts.
 *
 * @param prompt - current composer text (appended to while dictating)
 * @param setPrompt - composer setter
 * @param setError - surfaces a user-facing error message
 * @param active - whether the AI panel is open
 */
export function useSpeechDictation(
  prompt: string,
  setPrompt: React.Dispatch<React.SetStateAction<string>>,
  setError: (message: string) => void,
  active: boolean
) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const basePromptRef = useRef<string>('');

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  }, []);

  // Stop dictation when the panel closes. `recognition.onend` (above) flips
  // `isRecording` back off, so no setState is needed here.
  useEffect(() => {
    if (!active && recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, [active]);

  // Stop dictation on unmount.
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
    };
  }, []);

  const startRecording = useCallback(() => {
    setError('');

    const SpeechRecognitionImpl =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionImpl) {
      setError('Voice input is not supported on this browser.');
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

      if (final) basePromptRef.current = `${basePromptRef.current}${final} `;
      setPrompt(`${basePromptRef.current}${interim}`);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setError('Microphone access was denied.');
      } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setError('Voice input error. Please try again.');
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
      setError('Voice input error. Please try again.');
      setIsRecording(false);
    }
  }, [prompt, setPrompt, setError]);

  const toggleRecording = useCallback(() => {
    if (isRecording) stopRecording();
    else startRecording();
  }, [isRecording, stopRecording, startRecording]);

  return { isRecording, toggleRecording };
}
