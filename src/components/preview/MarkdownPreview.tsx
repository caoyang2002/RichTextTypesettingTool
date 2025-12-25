"use client";

import React from "react";
import { StyleConfig } from "@/types";
import { PreviewRenderer } from "./PreviewRenderer";

interface MarkdownPreviewProps {
  markdown: string;
  styleConfig: StyleConfig;
}

export function MarkdownPreview({
  markdown,
  styleConfig,
}: MarkdownPreviewProps) {
  return (
    <div className="flex-1 overflow-auto bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <style>{`
          .preview-content h1 { font-size: 28px; color: ${styleConfig.titleColor}; margin: 0.5em 0; font-weight: 700; }
          .preview-content h2 { font-size: 24px; color: ${styleConfig.titleColor}; margin: 1.2em 0 0.6em; font-weight: 600; }
          .preview-content h3 { font-size: 20px; color: ${styleConfig.titleColor}; margin: 1em 0 0.5em; font-weight: 600; }
          .preview-content p { font-size: ${styleConfig.fontSize}px; color: ${styleConfig.fontColor}; line-height: ${styleConfig.lineHeight}; margin: 0 0 1em; }
          .preview-content a { color: ${styleConfig.linkColor}; text-decoration: none; }
          .preview-content a:hover { text-decoration: underline; }
          .preview-content code { background: ${styleConfig.codeBackground}; padding: 2px 6px; border-radius: 3px; font-family: Consolas, Monaco, monospace; font-size: 0.9em; }
          .preview-content pre { background: #282c34; padding: 1em; border-radius: 8px; overflow-x: auto; margin: 1em 0; }
          .preview-content pre code { background: transparent; padding: 0; color: #abb2bf; }
          .preview-content blockquote { border-left: 3px solid ${styleConfig.blockquoteBorder}; padding-left: 1em; margin: 1em 0; color: #666; font-style: italic; }
          .preview-content ul, .preview-content ol { padding-left: 2em; margin: 0.5em 0; }
          .preview-content li { margin: 0.3em 0; line-height: ${styleConfig.lineHeight}; }
          .preview-content img { max-width: 100%; border-radius: 8px; }
          .preview-content hr { border: none; border-top: 1px solid #e0e0e0; margin: 2em 0; }
          .preview-content table { border-collapse: collapse; width: 100%; margin: 1em 0; }
          .preview-content th, .preview-content td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
          .preview-content th { background: #f5f5f5; font-weight: 600; }
        `}</style>
        <PreviewRenderer markdown={markdown} />
      </div>
    </div>
  );
}
