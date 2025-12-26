import { useState, useCallback, useEffect } from 'react';
import { StyleTemplate, Article, HTMLTemplate } from '@/types';
import { StyleTemplateStorage, ArticleStorage, HTMLTemplateStorage } from '@/lib/storage/templates';

export function useStyleTemplates() {
  const [templates, setTemplates] = useState<StyleTemplate[]>([]);

  useEffect(() => {
    setTemplates(StyleTemplateStorage.getAll());
  }, []);

  const saveTemplate = useCallback((template: Omit<StyleTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const saved = StyleTemplateStorage.save(template);
    setTemplates(StyleTemplateStorage.getAll());
    return saved;
  }, []);

  const updateTemplate = useCallback((id: string, updates: Partial<StyleTemplate>) => {
    const updated = StyleTemplateStorage.update(id, updates);
    setTemplates(StyleTemplateStorage.getAll());
    return updated;
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    const success = StyleTemplateStorage.delete(id);
    setTemplates(StyleTemplateStorage.getAll());
    return success;
  }, []);

  return {
    templates,
    saveTemplate,
    updateTemplate,
    deleteTemplate,
  };
}

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    setArticles(ArticleStorage.getAll());
  }, []);

  const saveArticle = useCallback((article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) => {
    const saved = ArticleStorage.save(article);
    setArticles(ArticleStorage.getAll());
    return saved;
  }, []);

  const updateArticle = useCallback((id: string, updates: Partial<Article>) => {
    const updated = ArticleStorage.update(id, updates);
    setArticles(ArticleStorage.getAll());
    return updated;
  }, []);

  const deleteArticle = useCallback((id: string) => {
    const success = ArticleStorage.delete(id);
    setArticles(ArticleStorage.getAll());
    return success;
  }, []);

  const searchArticles = useCallback((query: string) => {
    return ArticleStorage.search(query);
  }, []);

  return {
    articles,
    saveArticle,
    updateArticle,
    deleteArticle,
    searchArticles,
  };
}

export function useHTMLTemplates() {
  const [templates, setTemplates] = useState<HTMLTemplate[]>([]);

  useEffect(() => {
    setTemplates(HTMLTemplateStorage.getAll());
  }, []);

  const saveTemplate = useCallback((template: Omit<HTMLTemplate, 'id' | 'createdAt'>) => {
    const saved = HTMLTemplateStorage.save(template);
    setTemplates(HTMLTemplateStorage.getAll());
    return saved;
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    const success = HTMLTemplateStorage.delete(id);
    setTemplates(HTMLTemplateStorage.getAll());
    return success;
  }, []);

  return {
    templates,
    saveTemplate,
    deleteTemplate,
  };
}