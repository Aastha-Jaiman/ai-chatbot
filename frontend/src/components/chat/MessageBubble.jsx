// components/MessageBubble.jsx
"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, User, Copy, Check, FileText, Download } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  const formatTime = (ts) => {
    if (!ts) return "";
    return new Date(ts).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`flex w-full min-w-0 gap-2.5 sm:gap-3 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg ${
          isUser
            ? "bg-brand-primary/15 text-brand-primary"
            : "bg-emerald-500/15 text-emerald-400"
        }`}
      >
        {isUser ? <User size={15} /> : <Bot size={15} />}
      </div>

      {/* min-w-0 is the key fix: without it, flex children keep their
          intrinsic (content) width and refuse to shrink, so a long code
          line stretches this whole bubble past the screen edge. */}
      <div
        className={`flex min-w-0 max-w-[88%] sm:max-w-[80%] flex-col ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`min-w-0 max-w-full rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm leading-relaxed ${
            isUser
              ? "bg-brand-primary text-white rounded-tr-sm"
              : "bg-bg-primary border border-border-color text-text-primary rounded-tl-sm"
          }`}
        >
          {message.isTyping ? (
            <TypingDots />
          ) : (
            <MarkdownContent content={message.content} />
          )}
        </div>

        {/* Attachments rendering */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 flex flex-col gap-2 max-w-full">
            {message.attachments.map((att, idx) => {
              const isImage = att.type?.startsWith("image/");
              if (isImage) {
                return (
                  <a
                    key={att.fileId || idx}
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block hover:opacity-90 transition max-w-full"
                  >
                    <img
                      src={att.url}
                      alt={att.name || "Attachment"}
                      className="mt-1 max-h-48 sm:max-h-60 rounded-xl border border-border-color object-contain shadow-sm bg-black/10"
                    />
                  </a>
                );
              }
              return (
                <a
                  key={att.fileId || idx}
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-xl border border-border-color bg-bg-secondary p-2.5 text-xs text-text-primary hover:bg-bg-secondary/80 transition w-fit max-w-full shadow-sm"
                >
                  <FileText size={16} className="text-brand-primary shrink-0" />
                  <span className="truncate font-semibold max-w-[180px] sm:max-w-[240px]">
                    {att.name}
                  </span>
                  <Download size={14} className="text-text-secondary shrink-0 ml-1" />
                </a>
              );
            })}
          </div>
        )}

        {!message.isTyping && (
          <div className="mt-1 flex items-center gap-2 px-1 text-[10px] sm:text-[11px] text-text-secondary font-medium">
            <span>{formatTime(message.createdAt || message.timestamp)}</span>
            <CopyButton text={message.content} />
          </div>
        )}
      </div>
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!text) return null;

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-0.5 rounded p-0.5 hover:bg-bg-secondary hover:text-text-primary transition active:scale-90 cursor-pointer"
      title="Copy message"
    >
      {copied ? (
        <Check size={11} className="text-emerald-400" />
      ) : (
        <Copy size={11} />
      )}
    </button>
  );
}

function MarkdownContent({ content }) {
  return (
    <div className="min-w-0 max-w-full break-words markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code(props) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");
            const isInline = !match;

            if (isInline) {
              return (
                <code
                  className="rounded bg-black/30 px-1.5 py-0.5 text-[0.85em] break-words"
                  {...rest}
                >
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock
                code={codeString}
                language={match[1]}
              />
            );
          },
          table({ children }) {
            return (
              <div className="w-full max-w-full overflow-x-auto">
                <table className="min-w-full">{children}</table>
              </div>
            );
          },
          a({ children, href }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-primary underline break-all"
              >
                {children}
              </a>
            );
          },
          p({ children }) {
            return <p className="break-words">{children}</p>;
          },
          pre({ children }) {
            // react-markdown wraps <code> in <pre> by default — pass through,
            // CodeBlock below already renders its own <pre> internally.
            return <>{children}</>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    // w-full + min-w-0 + max-w-full + overflow-hidden on the OUTER box:
    // this box can never exceed its parent's width, no matter how long
    // the code inside is.
    <div className="not-prose my-3 w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-border-color bg-[#0d1117]">
      <div className="flex items-center justify-between border-b border-border-color/60 bg-bg-secondary px-3 py-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
          {language || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-text-secondary transition hover:bg-bg-primary hover:text-text-primary"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* THE fix: wide code scrolls horizontally INSIDE this box only —
          it never pushes the chat column or the page sideways. */}
      <div className="w-full max-w-full overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          wrapLongLines={false}
          customStyle={{
            margin: 0,
            padding: "12px 16px",
            background: "transparent",
            fontSize: "13px",
            width: "max-content",
            minWidth: "100%",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      <span className="h-2 w-2 animate-bounce rounded-full bg-text-secondary [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-text-secondary [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-text-secondary" />
    </div>
  );
}