/** Shared types + constants for the AI helper module. */

/** Max attachment size accepted by the composer + backend (4.5MB). */
export const MAX_FILE_SIZE = 4.5 * 1024 * 1024;

/** A file queued for sending, already base64-encoded. */
export interface AttachedFile {
  name: string;
  mimeType: string;
  data: string;
}

/** One entry in the conversation history. */
export interface Message {
  type: string;
  text: string;
  platform?: string;
  fileName?: string;
}

/** SSE payload shape streamed by the backend `/ai/generate` endpoint. */
export interface StreamChunk {
  text?: string;
  type?: 'redirectLocal' | 'redirect';
  url?: string;
  platform?: string;
  status?: string;
}
