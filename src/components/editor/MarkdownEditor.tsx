"use client";

import React from "react";
import { EditorAPI, StyleConfig } from "@/types";
import { EditorToolbar } from "./EditorToolbar";
import { EditorTextarea } from "./EditorTextarea";
import { MarkdownPreview } from "@/components/preview";

interface MarkdownEditorProps {
  markdown: string;
  onChange: (value: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  editorAPI: EditorAPI;
  styleConfig: StyleConfig;
}

export function MarkdownEditor({
  markdown,
  onChange,
  textareaRef,
  editorAPI,
  styleConfig,
}: MarkdownEditorProps) {
  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-200">
        <MarkdownPreview markdown={markdown} styleConfig={styleConfig} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <EditorToolbar editorAPI={editorAPI} />
        <EditorTextarea
          value={markdown}
          onChange={onChange}
          textareaRef={textareaRef}
        />
      </div>
    </>
  );
}
