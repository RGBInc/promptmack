import { Check, Copy } from "lucide-react";
import Link from "next/link";
import React, { memo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={copyToClipboard}
      className="absolute top-2 right-2 size-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-zinc-200 dark:hover:bg-zinc-700"
    >
      {copied ? (
        <Check className="size-4 text-green-500" />
      ) : (
        <Copy className="size-4 text-zinc-500 dark:text-zinc-400" />
      )}
    </Button>
  );
};

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  const components = {
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      const codeText = String(children).replace(/\n$/, '');
      
      return !inline && match ? (
        <div className="relative group">
          <pre
            {...props}
            className={`${className} text-sm max-w-full overflow-x-auto bg-zinc-100 p-3 pr-12 rounded-lg mt-2 dark:bg-zinc-800 whitespace-pre-wrap break-words`}
          >
            <code className={`${match[1]} block`}>{children}</code>
          </pre>
          <CopyButton text={codeText} />
        </div>
      ) : (
        <code
          className={`${className} text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded-md break-words`}
          {...props}
        >
          {children}
        </code>
      );
    },
    ol: ({ node, children, ...props }: any) => {
      return (
        <ol className="list-decimal list-outside ml-6 pl-2" {...props}>
          {children}
        </ol>
      );
    },
    li: ({ node, children, ...props }: any) => {
      return (
        <li className="py-1" {...props}>
          {children}
        </li>
      );
    },
    ul: ({ node, children, ...props }: any) => {
      return (
        <ul className="list-disc list-outside ml-6 pl-2" {...props}>
          {children}
        </ul>
      );
    },
    strong: ({ node, children, ...props }: any) => {
      return (
        <span className="font-semibold" {...props}>
          {children}
        </span>
      );
    },
    a: ({ node, children, ...props }: any) => {
      return (
        <Link
          className="text-blue-500 hover:underline"
          target="_blank"
          rel="noreferrer"
          {...props}
        >
          {children}
        </Link>
      );
    },
    table: ({ node, children, ...props }: any) => {
      return (
        <div className="overflow-x-auto my-4">
          <table className="min-w-full border-collapse border border-zinc-300 dark:border-zinc-600 rounded-lg" {...props}>
            {children}
          </table>
        </div>
      );
    },
    thead: ({ node, children, ...props }: any) => {
      return (
        <thead className="bg-zinc-50 dark:bg-zinc-800" {...props}>
          {children}
        </thead>
      );
    },
    tbody: ({ node, children, ...props }: any) => {
      return (
        <tbody {...props}>
          {children}
        </tbody>
      );
    },
    tr: ({ node, children, ...props }: any) => {
      return (
        <tr className="border-b border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50" {...props}>
          {children}
        </tr>
      );
    },
    th: ({ node, children, ...props }: any) => {
      return (
        <th className="px-4 py-2 text-left font-medium text-zinc-900 dark:text-zinc-100 border-r border-zinc-200 dark:border-zinc-700 last:border-r-0" {...props}>
          {children}
        </th>
      );
    },
    td: ({ node, children, ...props }: any) => {
      return (
        <td className="px-4 py-2 text-zinc-700 dark:text-zinc-300 border-r border-zinc-200 dark:border-zinc-700 last:border-r-0" {...props}>
          {children}
        </td>
      );
    },
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);
