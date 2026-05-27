"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";

function extractCodeInfo(children) {
  const child = Array.isArray(children) ? children[0] : children;
  if (!child || typeof child !== "object" || !("props" in child)) {
    return { language: "", code: String(children) };
  }
  const className = child.props?.className || "";
  const match = /language-(\w+)/.exec(className);
  return {
    language: match ? match[1] : "",
    code: String(child.props?.children || "").replace(/\n$/, ""),
  };
}

function CodeBlock({ children }) {
  const { language, code } = extractCodeInfo(children);

  if (!language) {
    return (
      <pre className="my-5 overflow-auto rounded-xl border border-border/40 bg-muted/20 p-5">
        <code className="font-mono text-[13px] leading-relaxed text-foreground/85">{code}</code>
      </pre>
    );
  }

  return (
    <div className="group/code relative my-5 overflow-hidden rounded-xl border border-border/40 shadow-sm">
      <div className="flex items-center justify-between border-b border-border/30 bg-muted/30 px-5 py-2">
        <span className="font-mono text-[11px] font-medium tracking-wide uppercase text-muted-foreground">
          {language}
        </span>
        <button
          type="button"
          className="text-[11px] font-medium text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover/code:opacity-100"
          onClick={() => navigator.clipboard.writeText(code)}
        >
          Copy
        </button>
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: "0.8125rem",
          lineHeight: "1.6",
          background: "oklch(0.145 0 0 / 0.97)",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

const markdownComponents = {
  h1: ({ children, ...props }) => (
    <h1 className="mt-12 mb-5 scroll-m-20 text-[1.625rem] font-bold leading-tight tracking-tight first:mt-0" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="mt-10 mb-4 scroll-m-20 text-xl font-semibold leading-snug tracking-tight border-b border-border/40 pb-2.5" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="mt-8 mb-3 scroll-m-20 text-[1.0625rem] font-semibold leading-snug tracking-tight" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className="mt-6 mb-2 scroll-m-20 text-[0.9375rem] font-semibold leading-snug tracking-tight" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }) => (
    <p className="my-4 text-[0.9375rem] leading-7 text-foreground/85 [&:not(:first-child)]:mt-4" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul className="my-4 ml-6 list-disc space-y-1.5 text-[0.9375rem] leading-7 text-foreground/85 marker:text-muted-foreground/50" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="my-4 ml-6 list-decimal space-y-1.5 text-[0.9375rem] leading-7 text-foreground/85 marker:text-muted-foreground/50" {...props}>
      {children}
    </ol>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote className="my-5 border-l-[3px] border-primary/30 bg-muted/10 py-3 pl-5 pr-3 text-[0.9375rem] italic leading-7 text-muted-foreground rounded-r-lg" {...props}>
      {children}
    </blockquote>
  ),
  hr: (props) => <hr className="my-8 border-border/40" {...props} />,
  table: ({ children, ...props }) => (
    <div className="my-5 w-full overflow-hidden rounded-xl border border-border/40 shadow-sm">
      <table className="w-full text-sm" {...props}>{children}</table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="border-b border-border/40 bg-muted/20" {...props}>{children}</thead>
  ),
  tr: ({ children, ...props }) => (
    <tr className="border-b border-border/20 transition-colors last:border-0 hover:bg-muted/10" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }) => (
    <th className="px-4 py-3 text-left text-[0.8125rem] font-semibold tracking-wide text-muted-foreground" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="px-4 py-3 text-[0.9375rem] leading-relaxed" {...props}>{children}</td>
  ),
  pre: CodeBlock,
  code: ({ children }) => (
    <code className="rounded-md bg-muted/60 px-1.5 py-0.5 font-mono text-[0.8125rem] text-primary/80">{children}</code>
  ),
  a: ({ children, href, ...props }) => (
    <a
      href={href}
      className="font-medium text-primary underline underline-offset-2 decoration-primary/30 transition-colors hover:decoration-primary"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  strong: ({ children, ...props }) => <strong className="font-semibold text-foreground" {...props}>{children}</strong>,
  em: ({ children, ...props }) => <em className="italic text-foreground/90" {...props}>{children}</em>,
};

const MarkdownRenderer = memo(function MarkdownRenderer({ content, className }) {
  if (!content) return null;

  return (
    <div className={cn("w-full", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
});

export { MarkdownRenderer };
