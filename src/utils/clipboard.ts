// src/utils/clipboard.ts

/**
 * 剪贴板工具函数
 * 支持复制富文本（HTML）和纯文本到剪贴板
 */

export interface CopyOptions {
  html?: string;
  text?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * 复制富文本到剪贴板（推荐方法）
 * 同时复制 HTML 和纯文本格式，确保在各种场景下都能正确粘贴
 */
export async function copyRichText(options: CopyOptions): Promise<boolean> {
  const { html, text, onSuccess, onError } = options;

  if (!html && !text) {
    console.warn('copyRichText: 至少需要提供 html 或 text 参数');
    return false;
  }

  try {
    // 方法 1: 使用现代 Clipboard API (推荐)
    if (navigator.clipboard && window.ClipboardItem) {
      return await copyWithClipboardAPI(html, text || html);
    }
    
    // 方法 2: 降级到 execCommand
    return copyWithExecCommand(html, text || html);
  } catch (error) {
    console.error('复制失败:', error);
    onError?.(error as Error);
    return false;
  }
}

/**
 * 使用现代 Clipboard API 复制
 * 支持同时复制多种格式
 */
async function copyWithClipboardAPI(
  html: string = '',
  text: string = ''
): Promise<boolean> {
  try {
    const items: Record<string, Blob> = {};

    // 添加 HTML 格式
    if (html) {
      items['text/html'] = new Blob([html], { type: 'text/html' });
    }

    // 添加纯文本格式
    if (text) {
      items['text/plain'] = new Blob([text], { type: 'text/plain' });
    }

    const clipboardItem = new ClipboardItem(items);
    await navigator.clipboard.write([clipboardItem]);
    
    console.log('✅ 使用 Clipboard API 复制成功');
    return true;
  } catch (error) {
    console.error('Clipboard API 复制失败:', error);
    throw error;
  }
}

/**
 * 使用 execCommand 复制（降级方案）
 * 兼容不支持 Clipboard API 的旧浏览器
 */
function copyWithExecCommand(html: string = '', text: string = ''): boolean {
  try {
    // 创建临时容器
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-999999px';
    container.style.top = '-999999px';
    container.style.opacity = '0';
    container.style.pointerEvents = 'none';
    container.contentEditable = 'true';
    
    // 设置内容
    container.innerHTML = html || text;
    
    // 添加到 DOM
    document.body.appendChild(container);

    // 选择内容
    const range = document.createRange();
    range.selectNodeContents(container);
    
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }

    // 执行复制
    const success = document.execCommand('copy');
    
    // 清理
    document.body.removeChild(container);
    
    if (success) {
      console.log('✅ 使用 execCommand 复制成功');
    } else {
      console.warn('⚠️ execCommand 复制失败');
    }
    
    return success;
  } catch (error) {
    console.error('execCommand 复制失败:', error);
    return false;
  }
}

/**
 * 复制纯文本到剪贴板
 */
export async function copyPlainText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      console.log('✅ 纯文本复制成功');
      return true;
    }
    
    // 降级方案
    return copyWithExecCommand('', text);
  } catch (error) {
    console.error('复制纯文本失败:', error);
    return false;
  }
}

/**
 * 检查剪贴板 API 是否可用
 */
export function isClipboardSupported(): boolean {
  return !!(navigator.clipboard && window.ClipboardItem);
}

/**
 * 为微信公众号优化的复制函数
 * 确保样式能正确粘贴到微信编辑器
 */
export async function copyForWechat(htmlContent: string): Promise<boolean> {
  // 微信公众号编辑器更倾向于接收完整的 HTML 结构
  const wrappedHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      ${htmlContent}
    </div>
  `;

  return copyRichText({
    html: wrappedHtml,
    text: htmlContent, // 提供降级的纯文本版本
  });
}

/**
 * 通用导出复制函数
 */
export async function copyContent(
  content: string,
  format: 'html' | 'text' = 'html'
): Promise<boolean> {
  if (format === 'text') {
    return copyPlainText(content);
  }
  
  return copyRichText({
    html: content,
    text: content,
  });
}

/**
 * 带用户反馈的复制函数
 */
export async function copyWithFeedback(
  content: string,
  format: 'html' | 'text' = 'html',
  platformName: string = '内容'
): Promise<void> {
  const success = await copyContent(content, format);
  
  if (success) {
    // 这里可以集成 toast 通知库
    console.log(`✅ ${platformName}已复制到剪贴板`);
    
    // 如果有全局通知系统，可以这样调用：
    // showToast({ message: `${platformName}已复制`, type: 'success' });
  } else {
    console.error(`❌ 复制${platformName}失败`);
    alert(`复制失败，请手动选择并复制内容`);
  }
}

// ============================================
// 使用示例
// ============================================

/*
// 示例 1: 复制富文本
import { copyRichText } from '@/utils/clipboard';

const htmlContent = '<p style="color: red;">Hello</p>';
await copyRichText({
  html: htmlContent,
  text: 'Hello',
  onSuccess: () => console.log('复制成功'),
  onError: (err) => console.error('复制失败', err),
});

// 示例 2: 复制纯文本
import { copyPlainText } from '@/utils/clipboard';

await copyPlainText('Hello World');

// 示例 3: 微信公众号复制
import { copyForWechat } from '@/utils/clipboard';

const wechatHtml = '<h1 style="...">标题</h1>';
await copyForWechat(wechatHtml);

// 示例 4: 带反馈的复制
import { copyWithFeedback } from '@/utils/clipboard';

await copyWithFeedback(htmlContent, 'html', '微信公众号格式');
*/