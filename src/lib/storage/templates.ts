import { StyleTemplate, Article, HTMLTemplate } from '@/types';

const STORAGE_KEYS = {
  STYLE_TEMPLATES: 'wxmd_style_templates',
  ARTICLES: 'wxmd_articles',
  HTML_TEMPLATES: 'wxmd_html_templates',
};

// 样式模板存储
export class StyleTemplateStorage {
  static getAll(): StyleTemplate[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.STYLE_TEMPLATES);
    return data ? JSON.parse(data) : [];
  }

  static save(template: Omit<StyleTemplate, 'id' | 'createdAt' | 'updatedAt'>): StyleTemplate {
    const templates = this.getAll();
    const newTemplate: StyleTemplate = {
      ...template,
      id: `template_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    templates.push(newTemplate);
    localStorage.setItem(STORAGE_KEYS.STYLE_TEMPLATES, JSON.stringify(templates));
    return newTemplate;
  }

  static update(id: string, updates: Partial<StyleTemplate>): StyleTemplate | null {
    const templates = this.getAll();
    const index = templates.findIndex(t => t.id === id);
    if (index === -1) return null;

    templates[index] = {
      ...templates[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.STYLE_TEMPLATES, JSON.stringify(templates));
    return templates[index];
  }

  static delete(id: string): boolean {
    const templates = this.getAll();
    const filtered = templates.filter(t => t.id !== id);
    if (filtered.length === templates.length) return false;
    localStorage.setItem(STORAGE_KEYS.STYLE_TEMPLATES, JSON.stringify(filtered));
    return true;
  }

  static getById(id: string): StyleTemplate | null {
    const templates = this.getAll();
    return templates.find(t => t.id === id) || null;
  }
}

// 文章存储
export class ArticleStorage {
  static getAll(): Article[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.ARTICLES);
    return data ? JSON.parse(data) : [];
  }

  static save(article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Article {
    const articles = this.getAll();
    const newArticle: Article = {
      ...article,
      id: `article_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    articles.unshift(newArticle); // 最新的在前面
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
    return newArticle;
  }

  static update(id: string, updates: Partial<Article>): Article | null {
    const articles = this.getAll();
    const index = articles.findIndex(a => a.id === id);
    if (index === -1) return null;

    articles[index] = {
      ...articles[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
    return articles[index];
  }

  static delete(id: string): boolean {
    const articles = this.getAll();
    const filtered = articles.filter(a => a.id !== id);
    if (filtered.length === articles.length) return false;
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(filtered));
    return true;
  }

  static getById(id: string): Article | null {
    const articles = this.getAll();
    return articles.find(a => a.id === id) || null;
  }

  static search(query: string): Article[] {
    const articles = this.getAll();
    const lowerQuery = query.toLowerCase();
    return articles.filter(a => 
      a.title.toLowerCase().includes(lowerQuery) ||
      a.content.toLowerCase().includes(lowerQuery) ||
      a.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
}

// HTML 模板存储
export class HTMLTemplateStorage {
  static getAll(): HTMLTemplate[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.HTML_TEMPLATES);
    return data ? JSON.parse(data) : [];
  }

  static save(template: Omit<HTMLTemplate, 'id' | 'createdAt'>): HTMLTemplate {
    const templates = this.getAll();
    const newTemplate: HTMLTemplate = {
      ...template,
      id: `html_template_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    templates.push(newTemplate);
    localStorage.setItem(STORAGE_KEYS.HTML_TEMPLATES, JSON.stringify(templates));
    return newTemplate;
  }

  static delete(id: string): boolean {
    const templates = this.getAll();
    const filtered = templates.filter(t => t.id !== id);
    if (filtered.length === templates.length) return false;
    localStorage.setItem(STORAGE_KEYS.HTML_TEMPLATES, JSON.stringify(filtered));
    return true;
  }

  static getById(id: string): HTMLTemplate | null {
    const templates = this.getAll();
    return templates.find(t => t.id === id) || null;
  }
}
