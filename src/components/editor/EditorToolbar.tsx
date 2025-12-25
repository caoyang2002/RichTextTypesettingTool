import React from "react";
import { EditorAPI, ToolbarAction } from "@/types";
import { Button } from "@/components/ui";

interface EditorToolbarProps {
  editorAPI: EditorAPI;
  actions?: ToolbarAction[];
}

const DEFAULT_ACTIONS: ToolbarAction[] = [
  { id: "h1", label: "H1", action: (api) => api.insertText("# ", "") },
  { id: "h2", label: "H2", action: (api) => api.insertText("## ", "") },
  { id: "h3", label: "H3", action: (api) => api.insertText("### ", "") },
  {
    id: "bold",
    label: "粗体",
    action: (api) => api.insertText("**", "**"),
    hotkey: "Ctrl+B",
  },
  {
    id: "italic",
    label: "斜体",
    action: (api) => api.insertText("*", "*"),
    hotkey: "Ctrl+I",
  },
  { id: "quote", label: "引用", action: (api) => api.insertText("> ", "") },
  { id: "code", label: "代码", action: (api) => api.insertText("`", "`") },
  { id: "link", label: "链接", action: (api) => api.insertText("[", "](url)") },
  { id: "list", label: "列表", action: (api) => api.insertText("- ", "") },
];

export function EditorToolbar({
  editorAPI,
  actions = DEFAULT_ACTIONS,
}: EditorToolbarProps) {
  return (
    <div className="flex items-center gap-2 p-3 bg-white border-b border-gray-200 flex-wrap">
      {actions.map((action) => (
        <Button
          key={action.id}
          variant="outline"
          size="sm"
          onClick={() => action.action(editorAPI)}
          title={action.hotkey}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
