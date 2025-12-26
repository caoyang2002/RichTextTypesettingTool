// ============================================
// src/app/page.tsx - 更新版（集成所有功能）
// ============================================
'use client';

import React, { useEffect } from 'react';
import { MarkdownEditor } from '@/components/editor';
import { Header } from '@/components/layout';
import { StyleEditor } from '@/components/modals/StyleEditor';
import { StyleTemplateManager } from '@/components/modals/StyleTemplateManager';
import { ArticleArchive } from '@/components/modals/ArticleArchive';
import { HTMLImporter } from '@/components/modals/HTMLImporter';
import { useMarkdown } from '@/hooks/useMarkdown';
import { useStyleConfig } from '@/hooks/useStyleConfig';
import { useArticles } from '@/hooks/useTemplates';
import { Article, ImportHTMLResult } from '@/types';

const INITIAL_MARKDOWN = `# 欢迎使用 Markdown 编辑器

## 🎨 新功能

### 1. 样式模板
保存和管理您喜欢的样式配置，一键应用到不同文章。

### 2. 文章归档
自动保存您编辑的文章，随时查看和加载历史记录。

### 3. HTML 导入
导入富文本 HTML，自动提取样式并转换为 Markdown。

## 功能特性

这是一个支持多平台导出的 **Markdown 编辑器**，支持：

- ✅ 实时预览
- ✅ 代码高亮
- ✅ 数学公式
- ✅ Mermaid 图表
- ✅ 多平台格式导出
- ✅ 样式模板管理
- ✅ 文章归档
- ✅ HTML 智能导入

### 代码示例

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### 数学公式

行内公式：$E = mc^2$

块级公式：

$$
\\int_{a}^{b} f(x) dx = F(b) - F(a)
$$

### 表格示例

| 功能 | 支持 | 说明 |
|------|------|------|
| 样式模板 | ✅ | 保存和管理样式 |
| 文章归档 | ✅ | 自动保存历史 |
| HTML 导入 | ✅ | 智能提取样式 |

---

开始创作您的第一篇文章吧！🚀
`;

export default function Home() {
  const { markdown, setMarkdown, textareaRef, editorAPI } = useMarkdown(INITIAL_MARKDOWN);
  const { styleConfig, updateStyleConfig, setStyleConfig } = useStyleConfig();
  const { saveArticle, updateArticle } = useArticles();
  const [activeModal, setActiveModal] = React.useState<string | null>(null);
  const [currentArticleId, setCurrentArticleId] = React.useState<string | null>(null);
  const [lastSaveTime, setLastSaveTime] = React.useState<Date | null>(null);

  // 自动保存
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      handleAutoSave();
    }, 30000); // 30秒自动保存一次

    return () => clearTimeout(autoSaveTimer);
  }, [markdown, styleConfig]);

  const handleAutoSave = () => {
    if (!markdown.trim()) return;

    const title = extractTitle(markdown);
    const preview = extractPreview(markdown);
    const wordCount = markdown.length;

    const articleData = {
      title,
      content: markdown,
      preview,
      wordCount,
      styleTemplateId: undefined,
      tags: extractTags(markdown),
    };

    if (currentArticleId) {
      updateArticle(currentArticleId, articleData);
    } else {
      const saved = saveArticle(articleData);
      setCurrentArticleId(saved.id);
    }

    setLastSaveTime(new Date());
  };

  const handleManualSave = () => {
    handleAutoSave();
    alert('文章已保存！');
  };

  const handleLoadArticle = (article: Article) => {
    setMarkdown(article.content);
    setCurrentArticleId(article.id);
    if (article.styleTemplateId) {
      // 如果文章关联了样式模板，可以加载该样式
    }
  };

  const handleImportHTML = (result: ImportHTMLResult) => {
    setMarkdown(result.markdown);
    setStyleConfig(result.suggestedStyleConfig);
    setCurrentArticleId(null); // 新导入的内容作为新文章
  };

  const handleMenuClick = (menu: string | null) => {
    setActiveModal(menu);
  };

  // 工具函数
  const extractTitle = (content: string): string => {
    const match = content.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : '无标题';
  };

  const extractPreview = (content: string): string => {
    const withoutTitle = content.replace(/^#.+$/m, '').trim();
    return withoutTitle.substring(0, 100) + (withoutTitle.length > 100 ? '...' : '');
  };

  const extractTags = (content: string): string[] => {
    const tags: string[] = [];
    // 简单的标签提取逻辑，可以根据需要完善
    if (content.includes('```')) tags.push('代码');
    if (content.includes('$')) tags.push('公式');
    if (content.includes('![')) tags.push('图片');
    if (content.includes('|')) tags.push('表格');
    return tags;
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header
        editorAPI={editorAPI}
        markdown={markdown}
        styleConfig={styleConfig}
        onMenuClick={handleMenuClick}
        onSave={handleManualSave}
        lastSaveTime={lastSaveTime}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <MarkdownEditor
          markdown={markdown}
          onChange={setMarkdown}
          textareaRef={textareaRef}
          editorAPI={editorAPI}
          styleConfig={styleConfig}
        />
      </div>

      {/* 样式编辑器 */}
      {activeModal === 'style' && (
        <StyleEditor
          config={styleConfig}
          onChange={updateStyleConfig}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* 样式模板管理 */}
      {activeModal === 'template' && (
        <StyleTemplateManager
          currentConfig={styleConfig}
          onClose={() => setActiveModal(null)}
          onApplyTemplate={setStyleConfig}
        />
      )}

      {/* 文章归档 */}
      {activeModal === 'archive' && (
        <ArticleArchive
          onClose={() => setActiveModal(null)}
          onLoadArticle={handleLoadArticle}
        />
      )}

      {/* HTML 导入器 */}
      {activeModal === 'import' && (
        <HTMLImporter
          onClose={() => setActiveModal(null)}
          onImport={handleImportHTML}
        />
      )}
    </div>
  );
}