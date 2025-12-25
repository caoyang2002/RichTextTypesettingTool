import React from "react";

interface EditorTextareaProps {
  value: string;
  onChange: (value: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export function EditorTextarea({
  value,
  onChange,
  textareaRef,
}: EditorTextareaProps) {
  return (
    <div className="flex-1 overflow-auto bg-gray-900 p-5">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-full bg-gray-900 text-gray-100 border-none outline-none resize-none font-mono text-sm leading-relaxed p-2.5"
        placeholder="在此输入 Markdown 内容..."
        spellCheck={false}
      />
    </div>
  );
}
