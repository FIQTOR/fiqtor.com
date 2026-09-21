import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Isolated so the react-markdown + remark-gfm stack (hundreds of KB) can be
 * code-split: AIHelper imports this lazily, and it only renders once there is
 * at least one chat message.
 */
export default function MarkdownMessage({ text }: { text: string }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>;
}
