import { StyleConfig } from "@/types";
import { WECHAT_STYLE_RULES } from "@/config/style.config";

export function exportToWechat(
  htmlContent: string,
  styleConfig: StyleConfig,
): string {
  if (typeof window === "undefined") return htmlContent;

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");

  processElement(doc.body, styleConfig);

  return doc.body.innerHTML;
}

function processElement(element: Element, styleConfig: StyleConfig): void {
  const tagName = element.tagName.toLowerCase();

  // 移除微信不支持的属性
  element.removeAttribute("id");
  element.removeAttribute("class");

  // 应用内联样式
  if (tagName in WECHAT_STYLE_RULES) {
    const styleRule =
      WECHAT_STYLE_RULES[tagName as keyof typeof WECHAT_STYLE_RULES];
    const style =
      typeof styleRule === "function" ? styleRule(styleConfig) : styleRule;
    element.setAttribute("style", style);
  }

  // 递归处理子元素
  Array.from(element.children).forEach((child) => {
    processElement(child, styleConfig);
  });
}
