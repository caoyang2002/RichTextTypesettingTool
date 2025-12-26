import { StyleConfig } from ".";

export interface StyleTemplate {
  id: string;
  name: string;
  description?: string;
  styleConfig: StyleConfig;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  preview: string; // 前100字作为预览
  createdAt: string;
  updatedAt: string;
  styleTemplateId?: string;
  wordCount: number;
  tags?: string[];
}

export interface HTMLTemplate {
  id: string;
  name: string;
  description?: string;
  htmlContent: string;
  extractedElements: ExtractedElements;
  styleConfig: StyleConfig;
  createdAt: string;
}

export interface ExtractedElements {
  headers: Array<{
    level: number;
    text: string;
    styles: Record<string, string>;
  }>;
  paragraphs: Array<{
    text: string;
    styles: Record<string, string>;
  }>;
  links: Array<{
    text: string;
    href: string;
    styles: Record<string, string>;
  }>;
  images: Array<{
    src: string;
    alt: string;
    styles: Record<string, string>;
  }>;
  codeBlocks: Array<{
    language: string;
    code: string;
    styles: Record<string, string>;
  }>;
  quotes: Array<{
    text: string;
    styles: Record<string, string>;
  }>;
  dominantColors: string[];
  fontSizes: number[];
}

export interface ImportHTMLResult {
  markdown: string;
  extractedElements: ExtractedElements;
  suggestedStyleConfig: StyleConfig;
}

