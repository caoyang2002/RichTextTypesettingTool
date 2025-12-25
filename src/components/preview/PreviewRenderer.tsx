"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

interface PreviewRendererProps {
  markdown: string;
}

export function PreviewRenderer({ markdown }: PreviewRendererProps) {
  return (
    <div className="preview-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const code = String(children).replace(/\n$/, "");

            if (!inline && match) {
              if (match[1] === "mermaid") {
                return (
                  <div className="bg-gray-50 p-5 rounded-lg my-4 text-center">
                    <pre className="m-0 whitespace-pre-wrap">{code}</pre>
                    <p className="text-xs text-gray-500 mt-2.5">
                      Mermaid 图表（在实际环境中会渲染为图形）
                    </p>
                  </div>
                );
              }
              return (
                <SyntaxHighlighter
                  style={tomorrow}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {code}
                </SyntaxHighlighter>
              );
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
