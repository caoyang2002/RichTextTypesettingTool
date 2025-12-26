

// ============================================
// src/components/modals/ArticleArchive.tsx
// ============================================
'use client';

import React, { useState } from 'react';
import { FileText, Trash2, Search, Calendar, Tag, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { Article } from '@/types';
import { useArticles } from '@/hooks/useTemplates';

interface ArticleArchiveProps {
  onClose: () => void;
  onLoadArticle: (article: Article) => void;
}

export function ArticleArchive({ onClose, onLoadArticle }: ArticleArchiveProps) {
  const { articles, deleteArticle, searchArticles } = useArticles();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(articles);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setFilteredArticles(searchArticles(query));
    } else {
      setFilteredArticles(articles);
    }
  };

  const handleLoad = (article: Article) => {
    onLoadArticle(article);
    onClose();
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`确定要删除文章「${title}」吗？`)) {
      deleteArticle(id);
      setFilteredArticles(filteredArticles.filter(a => a.id !== id));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}个月前`;
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h2 className="text-xl font-semibold">文章归档</h2>
            <p className="text-sm text-gray-500 mt-1">
              共 {articles.length} 篇文章
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* 搜索栏 */}
        <div className="p-4 border-b bg-gray-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="搜索文章标题、内容或标签..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg">
                {searchQuery ? '未找到匹配的文章' : '还没有保存任何文章'}
              </p>
              <p className="text-sm mt-2">
                {searchQuery ? '尝试使用其他关键词' : '编辑完成后保存文章即可查看'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="border rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleLoad(article)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {article.title || '无标题文章'}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {article.preview}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(article.id, article.title);
                      }}
                      className="ml-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{formatDate(article.updatedAt)}</span>
                    </div>
                    <span>{article.wordCount} 字</span>
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Tag size={14} />
                        <span>{article.tags.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose} className="w-full">
            关闭
          </Button>
        </div>
      </div>
    </div>
  );
}