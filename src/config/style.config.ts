import { StyleConfig } from "@/types";

export const DEFAULT_STYLE_CONFIG: StyleConfig = {
  fontSize: 16,
  lineHeight: 1.75,
  fontColor: "#333333",
  titleColor: "#2c3e50",
  linkColor: "#1e88e5",
  codeBackground: "#f5f5f5",
  blockquoteBorder: "#dddddd",
};

export const WECHAT_STYLE_RULES = {
  h1: (config: StyleConfig) =>
    `font-size:24px; color:${config.titleColor}; line-height:1.2; letter-spacing:1px; text-align:center; margin:0.5em 0;`,
  h2: (config: StyleConfig) =>
    `font-size:20px; color:${config.titleColor}; line-height:1.3; margin:1.5em 0 0.8em 0;`,
  h3: (config: StyleConfig) =>
    `font-size:18px; color:${config.titleColor}; line-height:1.5; margin:1.2em 0 0.6em 0;`,
  p: (config: StyleConfig) =>
    `font-size:${config.fontSize}px; color:${config.fontColor}; line-height:${config.lineHeight}; letter-spacing:0.5px; margin:0 0 1em 0;`,
  a: (config: StyleConfig) =>
    `color:${config.linkColor}; text-decoration:underline;`,
  code: (config: StyleConfig) =>
    `background-color:${config.codeBackground}; padding:2px 6px; border-radius:3px; font-family:Consolas,Monaco,monospace; font-size:0.9em;`,
  pre: (config: StyleConfig) =>
    `background-color:${config.codeBackground}; padding:1em; border-radius:5px; overflow-x:auto; margin:1em 0;`,
  blockquote: (config: StyleConfig) =>
    `border-left:3px solid ${config.blockquoteBorder}; padding-left:1em; margin:1em 0; color:#666; font-style:italic;`,
  img: () =>
    `max-width:100%; border-radius:8px; box-shadow:0 4px 6px rgba(0,0,0,0.15);`,
};
