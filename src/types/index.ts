export interface EditorConfig {
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  theme: "light" | "dark";
}

export interface StyleConfig {
  fontSize: number;
  lineHeight: number;
  fontColor: string;
  titleColor: string;
  linkColor: string;
  codeBackground: string;
  blockquoteBorder: string;
}

export type ExportPlatform = "html" | "wechat" | "xiaohongshu" | "markdown";

export interface ExportOptions {
  platform: ExportPlatform;
  styleConfig: StyleConfig;
  includeStyles: boolean;
}

export interface ToolbarAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  action: (editor: EditorAPI) => void;
  hotkey?: string;
}

export interface EditorAPI {
  insertText: (before: string, after?: string) => void;
  getSelection: () => { start: number; end: number; text: string };
  setContent: (content: string) => void;
  getContent: () => string;
}
