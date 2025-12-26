// ============================================
// src/components/modals/StyleTemplateManager.tsx
// ============================================
'use client';

import React, { useState } from 'react';
import { Save, Trash2, Download, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { StyleConfig, StyleTemplate } from '@/types';
import { useStyleTemplates } from '@/hooks/useTemplates';

interface StyleTemplateManagerProps {
  currentConfig: StyleConfig;
  onClose: () => void;
  onApplyTemplate: (config: StyleConfig) => void;
}

export function StyleTemplateManager({ 
  currentConfig, 
  onClose, 
  onApplyTemplate 
}: StyleTemplateManagerProps) {
  const { templates, saveTemplate, deleteTemplate } = useStyleTemplates();
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);

  const handleSave = () => {
    if (!templateName.trim()) {
      alert('请输入模板名称');
      return;
    }

    saveTemplate({
      name: templateName,
      description: templateDescription,
      styleConfig: currentConfig,
    });

    setTemplateName('');
    setTemplateDescription('');
    setShowSaveForm(false);
    alert('样式模板保存成功！');
  };

  const handleApply = (template: StyleTemplate) => {
    onApplyTemplate(template.styleConfig);
    alert(`已应用模板: ${template.name}`);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`确定要删除模板「${name}」吗？`)) {
      deleteTemplate(id);
    }
  };

  const handleExport = (template: StyleTemplate) => {
    const data = JSON.stringify(template, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        saveTemplate({
          name: imported.name + ' (导入)',
          description: imported.description,
          styleConfig: imported.styleConfig,
        });
        alert('模板导入成功！');
      } catch (error) {
        alert('导入失败，文件格式不正确');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-semibold">样式模板管理</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {/* 保存当前样式 */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-blue-900">保存当前样式为模板</h3>
              <Button
                size="sm"
                onClick={() => setShowSaveForm(!showSaveForm)}
              >
                <Save size={16} className="mr-1.5" />
                {showSaveForm ? '取消' : '保存'}
              </Button>
            </div>

            {showSaveForm && (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="模板名称"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <textarea
                  placeholder="模板描述（可选）"
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={2}
                />
                <Button onClick={handleSave} size="sm">
                  确认保存
                </Button>
              </div>
            )}
          </div>

          {/* 导入/导出 */}
          <div className="mb-6 flex gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <Button variant="outline" size="sm" as="span">
                <Upload size={16} className="mr-1.5" />
                导入模板
              </Button>
            </label>
          </div>

          {/* 模板列表 */}
          <div>
            <h3 className="font-medium mb-3">已保存的模板 ({templates.length})</h3>
            
            {templates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>还没有保存任何模板</p>
                <p className="text-sm mt-2">保存当前样式配置以便后续使用</p>
              </div>
            ) : (
              <div className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="border rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-lg">{template.name}</h4>
                        {template.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {template.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApply(template)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                          应用
                        </button>
                        <button
                          onClick={() => handleExport(template)}
                          className="p-1 text-gray-600 hover:text-blue-600"
                          title="导出"
                        >
                          <Download size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(template.id, template.name)}
                          className="p-1 text-gray-600 hover:text-red-600"
                          title="删除"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>字号: {template.styleConfig.fontSize}px</span>
                      <span>行高: {template.styleConfig.lineHeight}</span>
                      <div className="flex items-center gap-1">
                        <span>颜色:</span>
                        <div
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: template.styleConfig.titleColor }}
                        />
                        <div
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: template.styleConfig.linkColor }}
                        />
                      </div>
                    </div>

                    <div className="text-xs text-gray-400 mt-2">
                      创建于 {new Date(template.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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