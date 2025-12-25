import { useState, useCallback, useRef } from "react";
import { EditorAPI } from "@/types";

export function useMarkdown(initialValue: string = "") {
  const [markdown, setMarkdown] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = useCallback(
    (before: string, after: string = "") => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = markdown.substring(start, end);
      const newText =
        markdown.substring(0, start) +
        before +
        selectedText +
        after +
        markdown.substring(end);

      setMarkdown(newText);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, end + before.length);
      }, 0);
    },
    [markdown],
  );

  const getSelection = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return { start: 0, end: 0, text: "" };

    return {
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
      text: markdown.substring(textarea.selectionStart, textarea.selectionEnd),
    };
  }, [markdown]);

  const editorAPI: EditorAPI = {
    insertText,
    getSelection,
    setContent: setMarkdown,
    getContent: () => markdown,
  };

  return {
    markdown,
    setMarkdown,
    textareaRef,
    editorAPI,
  };
}
