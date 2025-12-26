

// ============================================
// src/components/modals/HTMLImporter.tsx
// ============================================
'use client';

import React, { useState } from 'react';
import { Upload, FileCode, Sparkles, Download, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { HTMLExtractor } from '@/lib/html-parser/extractor';
import { ExtractedElements, ImportHTMLResult } from '@/types';
import { useHTMLTemplates } from '@/hooks/useTemplates';

interface HTMLImporterProps {
  onClose: () => void;
  onImport: (result: ImportHTMLResult) => void;
}

export function HTMLImporter({ onClose, onImport }: HTMLImporterProps) {
  const [htmlContent, setHtmlContent] = useState('');
  const [extractResult, setExtractResult] = useState<ImportHTMLResult | null>(null);
  const [templateName, setTemplateName] = useState('');
  const { saveTemplate } = useHTMLTemplates();

  const handleExtract = () => {
    if (!htmlContent.trim()) {
      alert('请输入 HTML 内容');
      return;
    }

    try {
      const extractor = new HTMLExtractor();
      const result = extractor.extract(htmlContent);
      setExtractResult(result);
    } catch (error) {
      alert('HTML 解析失败，请检查格式是否正确');
      console.error(error);
    }
  };

  const handleImport = () => {
    if (!extractResult) return;
    onImport(extractResult);
    alert('已导入 Markdown 和样式配置！');
    onClose();
  };

  const handleSaveTemplate = () => {
    if (!extractResult || !templateName.trim()) {
      alert('请输入模板名称');
      return;
    }

    saveTemplate({
      name: templateName,
      htmlContent,
      extractedElements: extractResult.extractedElements,
      styleConfig: extractResult.suggestedStyleConfig,
    });

    alert('HTML 模板保存成功！');
    setTemplateName('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setHtmlContent(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h2 className="text-xl font-semibold">HTML 导入与提取</h2>
            <p className="text-sm text-gray-500 mt-1">
              导入富文本，自动提取样式并转换为 Markdown
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-2 gap-6">
            {/* 左侧：输入 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">1. 输入 HTML</h3>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".html,.htm"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button variant="outline" size="sm" as="span">
                    <Upload size={16} className="mr-1.5" />
                    上传文件
                  </Button>
                </label>
              </div>

              <textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                placeholder="粘贴 HTML 内容..."
                className="w-full h-96 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <Button
                onClick={handleExtract}
                className="w-full mt-3"
                disabled={!htmlContent.trim()}
              >
                <Sparkles size={16} className="mr-1.5" />
                提取样式和内容
              </Button>
            </div>

            {/* 右侧：结果 */}
            <div>
              <h3 className="font-medium mb-3">2. 提取结果</h3>

              {!extractResult ? (
                <div className="h-96 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <FileCode size={48} className="mx-auto mb-2" />
                    <p>提取结果将显示在这里</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Markdown 预览 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">转换的 Markdown</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(extractResult.markdown);
                          alert('Markdown 已复制');
                        }}
                      >
                        复制
                      </Button>
                    </div>
                    <pre className="p-3 bg-gray-50 rounded border text-xs overflow-auto max-h-48">
                      {extractResult.markdown}
                    </pre>
                  </div>

                  {/* 提取的元素统计 */}
                  <div>
                    <span className="text-sm font-medium">提取的元素</span>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 bg-blue-50 rounded">
                        标题: {extractResult.extractedElements.headers.length}
                      </div>
                      <div className="p-2 bg-green-50 rounded">
                        段落: {extractResult.extractedElements.paragraphs.length}
                      </div>
                      <div className="p-2 bg-purple-50 rounded">
                        链接: {extractResult.extractedElements.links.length}
                      </div>
                      <div className="p-2 bg-yellow-50 rounded">
                        图片: {extractResult.extractedElements.images.length}
                      </div>
                      <div className="p-2 bg-pink-50 rounded">
                        代码块: {extractResult.extractedElements.codeBlocks.length}
                      </div>
                      <div className="p-2 bg-indigo-50 rounded">
                        引用: {extractResult.extractedElements.quotes.length}
                      </div>
                    </div>
                  </div>

                  {/* 建议的样式配置 */}
                  <div>
                    <span className="text-sm font-medium">建议的样式配置</span>
                    <div className="mt-2 p-3 bg-gray-50 rounded text-xs space-y-1">
                      <div>字号: {extractResult.suggestedStyleConfig.fontSize}px</div>
                      <div>行高: {extractResult.suggestedStyleConfig.lineHeight}</div>
                      <div className="flex items-center gap-2">
                        <span>标题颜色:</span>
                        <div
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: extractResult.suggestedStyleConfig.titleColor }}
                        />
                        <span>{extractResult.suggestedStyleConfig.titleColor}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>链接颜色:</span>
                        <div
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: extractResult.suggestedStyleConfig.linkColor }}
                        />
                        <span>{extractResult.suggestedStyleConfig.linkColor}</span>
                      </div>
                    </div>
                  </div>

                  {/* 保存为模板 */}
                  <div className="pt-3 border-t">
                    <input
                      type="text"
                      placeholder="输入模板名称以保存..."
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveTemplate}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        disabled={!templateName.trim()}
                      >
                        <Download size={16} className="mr-1.5" />
                        保存模板
                      </Button>
                      <Button
                        onClick={handleImport}
                        size="sm"
                        className="flex-1"
                      >
                        导入到编辑器
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}