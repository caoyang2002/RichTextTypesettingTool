
// ============================================
// src/components/layout/Header.tsx - 更新版
// ============================================
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Copy, Menu, ChevronDown, Settings, Layout, FileText, 
  Code, Check, AlertCircle, Save, Clock, Archive, Upload 
} from 'lucide-react';
import { Button } from '@/components/ui';
import { EditorAPI, StyleConfig, ExportPlatform } from '@/types';
import { exportToWechat, exportToXiaohongshu } from '@/lib/exporters';
import { copyRichText, copyPlainText, copyForWechat } from '@/utils/clipboard';

interface HeaderProps {
  editorAPI: EditorAPI;
  markdown: string;
  styleConfig: StyleConfig;
  onMenuClick: (menu: string | null) => void;
  onSave: () => void;
  lastSaveTime: Date | null;
}

export function Header({ 
  editorAPI, 
  markdown, 
  styleConfig, 
  onMenuClick,
  onSave,
  lastSaveTime,
}: HeaderProps) {
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [showCopyMenu, setShowCopyMenu] = useState(false);
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const copyMenuRef = useRef<HTMLDivElement>(null);
  const mainMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (copyMenuRef.current && !copyMenuRef.current.contains(event.target as Node)) {
        setShowCopyMenu(false);
      }
      if (mainMenuRef.current && !mainMenuRef.current.contains(event.target as Node)) {
        setShowMainMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (copiedPlatform) {
      const timer = setTimeout(() => {
        setCopiedPlatform(null);
        setCopyStatus('idle');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [copiedPlatform]);

  const exportToHTML = (): string => {
    if (typeof window === 'undefined') return '';
    const previewContent = document.querySelector('.preview-content');
    return previewContent ? previewContent.innerHTML : '';
  };

  const handleCopy = async (platform: ExportPlatform) => {
    let success = false;
    let message = '';
    
    try {
      setCopyStatus('idle');
      
      switch(platform) {
        case 'html': {
          const htmlContent = exportToHTML();
          success = await copyRichText({ html: htmlContent, text: htmlContent });
          message = 'HTML';
          break;
        }
        case 'wechat': {
          const htmlContent = exportToHTML();
          const wechatHtml = exportToWechat(htmlContent, styleConfig);
          success = await copyForWechat(wechatHtml);
          message = '微信公众号';
          break;
        }
        case 'xiaohongshu': {
          const plainText = exportToXiaohongshu(markdown);
          success = await copyPlainText(plainText);
          message = '小红书';
          break;
        }
        case 'markdown': {
          success = await copyPlainText(markdown);
          message = 'Markdown';
          break;
        }
      }

      if (success) {
        setCopiedPlatform(platform);
        setCopyStatus('success');
      } else {
        setCopyStatus('error');
      }
    } catch (err) {
      console.error('复制失败:', err);
      setCopyStatus('error');
    }
  };

  const menuItems = [
    { icon: <Settings size={16} />, label: '样式编辑器', key: 'style' },
    { icon: <FileText size={16} />, label: '样式模板', key: 'template' },
    { icon: <Archive size={16} />, label: '文章归档', key: 'archive' },
    { icon: <Upload size={16} />, label: 'HTML 导入', key: 'import' },
    { icon: <Layout size={16} />, label: '排版编辑器', key: 'layout' },
    { icon: <Code size={16} />, label: 'H5 编辑器', key: 'h5' },
  ];

  const exportPlatforms = [
    { label: 'HTML', value: 'html' as ExportPlatform, description: '带样式的 HTML 格式', badge: '富文本' },
    { label: '微信公众号', value: 'wechat' as ExportPlatform, description: '符合微信规范的内联样式', badge: '富文本' },
    { label: '小红书', value: 'xiaohongshu' as ExportPlatform, description: '纯文本 + Emoji', badge: '纯文本' },
    { label: 'Markdown', value: 'markdown' as ExportPlatform, description: '原始 Markdown 源码', badge: '纯文本' },
  ];

  const formatSaveTime = (time: Date | null) => {
    if (!time) return '未保存';
    const now = new Date();
    const diff = Math.floor((now.getTime() - time.getTime()) / 1000);
    
    if (diff < 60) return '刚刚保存';
    if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`;
    return time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <header className="h-15 bg-white border-b border-gray-200 flex items-center justify-between px-5 shadow-sm">
      <div className="flex items-center gap-3" ref={mainMenuRef}>
        <Button variant="outline" size="sm" onClick={() => setShowMainMenu(!showMainMenu)}>
          <Menu size={16} className="mr-1.5" />
          菜单
          <ChevronDown size={14} className="ml-1.5" />
        </Button>

        <Button variant="outline" size="sm" onClick={onSave}>
          <Save size={16} className="mr-1.5" />
          保存
        </Button>

        {showMainMenu && (
          <div className="absolute top-16 left-5 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50 min-w-[200px]">
            {menuItems.map(item => (
              <button
                key={item.key}
                onClick={() => {
                  onMenuClick(item.key);
                  setShowMainMenu(false);
                }}
                className="w-full px-3 py-2.5 border-none bg-white cursor-pointer flex items-center gap-2.5 rounded text-sm transition-colors hover:bg-gray-50"
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="text-lg font-semibold text-gray-800">
          Markdown 编辑器
        </div>
        {lastSaveTime && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock size={14} />
            <span>{formatSaveTime(lastSaveTime)}</span>
          </div>
        )}
      </div>

      <div className="relative" ref={copyMenuRef}>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowCopyMenu(!showCopyMenu)}
          className={
            copyStatus === 'success' ? 'bg-green-600 hover:bg-green-700' :
            copyStatus === 'error' ? 'bg-red-600 hover:bg-red-700' : ''
          }
        >
          {copyStatus === 'success' ? (
            <>
              <Check size={16} className="mr-1.5" />
              已复制
            </>
          ) : copyStatus === 'error' ? (
            <>
              <AlertCircle size={16} className="mr-1.5" />
              复制失败
            </>
          ) : (
            <>
              <Copy size={16} className="mr-1.5" />
              复制
              <ChevronDown size={14} className="ml-1.5" />
            </>
          )}
        </Button>

        {showCopyMenu && (
          <div className="absolute top-11 right-0 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50 min-w-[260px]">
            <div className="p-2">
              {exportPlatforms.map(platform => (
                <button
                  key={platform.value}
                  onClick={() => handleCopy(platform.value)}
                  disabled={copiedPlatform === platform.value && copyStatus === 'success'}
                  className="w-full px-3 py-2.5 border-none bg-white cursor-pointer text-left rounded text-sm transition-colors hover:bg-gray-50 disabled:opacity-60"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{platform.label}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        platform.badge === '富文本' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {platform.badge}
                      </span>
                    </div>
                    {copiedPlatform === platform.value && copyStatus === 'success' && (
                      <Check size={14} className="text-green-500" />
                    )}
                  </div>
                  <div className="text-xs text-gray-500">{platform.description}</div>
                </button>
              ))}
            </div>
            <div className="bg-blue-50 px-3 py-2.5 border-t border-blue-100">
              <div className="flex items-start gap-2">
                <div className="text-blue-500 mt-0.5">💡</div>
                <div className="text-xs text-blue-700 leading-relaxed">
                  <strong>提示：</strong>富文本格式复制后可直接粘贴到目标平台编辑器，保留所有样式和格式。
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}