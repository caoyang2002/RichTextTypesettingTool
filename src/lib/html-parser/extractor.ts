import { ExtractedElements, StyleConfig, ImportHTMLResult } from '@/types';
import TurndownService from 'turndown';
import { DEFAULT_STYLE_CONFIG } from '@/config/style.config';

export class HTMLExtractor {
  private parser: DOMParser;
  private turndownService: TurndownService;

  constructor() {
    if (typeof window === 'undefined') {
      throw new Error('HTMLExtractor can only be used in browser environment');
    }
    this.parser = new DOMParser();
    this.turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
    });
  }

  /**
   * 从 HTML 提取所有元素和样式
   */
  extract(html: string): ImportHTMLResult {
    const doc = this.parser.parseFromString(html, 'text/html');
    
    const extractedElements: ExtractedElements = {
      headers: this.extractHeaders(doc),
      paragraphs: this.extractParagraphs(doc),
      links: this.extractLinks(doc),
      images: this.extractImages(doc),
      codeBlocks: this.extractCodeBlocks(doc),
      quotes: this.extractQuotes(doc),
      dominantColors: this.extractColors(doc),
      fontSizes: this.extractFontSizes(doc),
    };

    const markdown = this.turndownService.turndown(html);
    const suggestedStyleConfig = this.generateStyleConfig(extractedElements);

    return {
      markdown,
      extractedElements,
      suggestedStyleConfig,
    };
  }

  private extractHeaders(doc: Document) {
    const headers: ExtractedElements['headers'] = [];
    const headerTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    
    headerTags.forEach((tag, index) => {
      const elements = doc.querySelectorAll(tag);
      elements.forEach(el => {
        const computed = this.getComputedStyles(el as HTMLElement);
        headers.push({
          level: index + 1,
          text: el.textContent?.trim() || '',
          styles: computed,
        });
      });
    });
    
    return headers;
  }

  private extractParagraphs(doc: Document) {
    const paragraphs: ExtractedElements['paragraphs'] = [];
    const elements = doc.querySelectorAll('p');
    
    elements.forEach(el => {
      const text = el.textContent?.trim();
      if (text && text.length > 0) {
        paragraphs.push({
          text,
          styles: this.getComputedStyles(el as HTMLElement),
        });
      }
    });
    
    return paragraphs.slice(0, 10); // 只取前10个
  }

  private extractLinks(doc: Document) {
    const links: ExtractedElements['links'] = [];
    const elements = doc.querySelectorAll('a');
    
    elements.forEach(el => {
      links.push({
        text: el.textContent?.trim() || '',
        href: el.getAttribute('href') || '',
        styles: this.getComputedStyles(el as HTMLElement),
      });
    });
    
    return links.slice(0, 10);
  }

  private extractImages(doc: Document) {
    const images: ExtractedElements['images'] = [];
    const elements = doc.querySelectorAll('img');
    
    elements.forEach(el => {
      images.push({
        src: el.getAttribute('src') || '',
        alt: el.getAttribute('alt') || '',
        styles: this.getComputedStyles(el as HTMLElement),
      });
    });
    
    return images;
  }

  private extractCodeBlocks(doc: Document) {
    const codeBlocks: ExtractedElements['codeBlocks'] = [];
    const elements = doc.querySelectorAll('pre code, code');
    
    elements.forEach(el => {
      const isBlock = el.parentElement?.tagName === 'PRE';
      if (isBlock) {
        codeBlocks.push({
          language: this.detectLanguage(el),
          code: el.textContent || '',
          styles: this.getComputedStyles(el as HTMLElement),
        });
      }
    });
    
    return codeBlocks;
  }

  private extractQuotes(doc: Document) {
    const quotes: ExtractedElements['quotes'] = [];
    const elements = doc.querySelectorAll('blockquote');
    
    elements.forEach(el => {
      quotes.push({
        text: el.textContent?.trim() || '',
        styles: this.getComputedStyles(el as HTMLElement),
      });
    });
    
    return quotes;
  }

  private extractColors(doc: Document): string[] {
    const colors = new Set<string>();
    const elements = doc.querySelectorAll('*');
    
    elements.forEach(el => {
      const style = (el as HTMLElement).style;
      if (style.color) colors.add(style.color);
      if (style.backgroundColor) colors.add(style.backgroundColor);
    });
    
    return Array.from(colors).slice(0, 10);
  }

  private extractFontSizes(doc: Document): number[] {
    const sizes = new Set<number>();
    const elements = doc.querySelectorAll('*');
    
    elements.forEach(el => {
      const style = (el as HTMLElement).style;
      if (style.fontSize) {
        const size = parseInt(style.fontSize);
        if (!isNaN(size)) sizes.add(size);
      }
    });
    
    return Array.from(sizes).sort((a, b) => a - b);
  }

  private getComputedStyles(el: HTMLElement): Record<string, string> {
    const style = el.style;
    const important = [
      'color', 'backgroundColor', 'fontSize', 'fontWeight', 
      'lineHeight', 'letterSpacing', 'textAlign', 'margin', 
      'padding', 'borderRadius', 'boxShadow'
    ];
    
    const styles: Record<string, string> = {};
    important.forEach(prop => {
      const value = style.getPropertyValue(prop);
      if (value) styles[prop] = value;
    });
    
    return styles;
  }

  private detectLanguage(el: Element): string {
    const className = el.className || '';
    const match = className.match(/language-(\w+)/);
    return match ? match[1] : 'text';
  }

  private generateStyleConfig(elements: ExtractedElements): StyleConfig {
    const config = { ...DEFAULT_STYLE_CONFIG };

    // 从段落提取字体大小
    if (elements.paragraphs.length > 0) {
      const sizes = elements.paragraphs
        .map(p => parseInt(p.styles.fontSize || '16'))
        .filter(s => !isNaN(s));
      if (sizes.length > 0) {
        config.fontSize = Math.round(sizes.reduce((a, b) => a + b) / sizes.length);
      }
    }

    // 从标题提取颜色
    if (elements.headers.length > 0) {
      const colors = elements.headers
        .map(h => h.styles.color)
        .filter(c => c && c !== 'rgb(0, 0, 0)');
      if (colors.length > 0) {
        config.titleColor = this.rgbToHex(colors[0]);
      }
    }

    // 从链接提取颜色
    if (elements.links.length > 0) {
      const colors = elements.links
        .map(l => l.styles.color)
        .filter(c => c);
      if (colors.length > 0) {
        config.linkColor = this.rgbToHex(colors[0]);
      }
    }

    // 从代码块提取背景色
    if (elements.codeBlocks.length > 0) {
      const bgColors = elements.codeBlocks
        .map(c => c.styles.backgroundColor)
        .filter(c => c);
      if (bgColors.length > 0) {
        config.codeBackground = this.rgbToHex(bgColors[0]);
      }
    }

    return config;
  }

  private rgbToHex(rgb: string): string {
    if (rgb.startsWith('#')) return rgb;
    
    const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) return rgb;
    
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    
    return '#' + [r, g, b]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
  }
}
