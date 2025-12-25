"use client";

import React from "react";
import { MarkdownEditor } from "@/components/editor/MarkdownEditor";
import { Header } from "@/components/layout";
import { StyleEditor } from "@/components/modals";
import { useMarkdown } from "@/hooks/useMarkdown";
import { useStyleConfig } from "@/hooks/useStyleConfig";

const INITIAL_MARKDOWN = `# 欢迎使用 Markdown 编辑器

## 功能特性

这是一个支持多平台导出的 **Markdown 编辑器**，支持：

- 实时预览
- 代码高亮
- 数学公式
- Mermaid 图表
- 多平台格式导出

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

### Mermaid 流程图

\`\`\`mermaid
graph TD
    A[开始] --> B{是否继续}
    B -->|是| C[处理数据]
    B -->|否| D[结束]
    C --> B
\`\`\`

### 列表示例

1. 第一项
2. 第二项
   - 子项 A
   - 子项 B
3. 第三项

> 这是一段引用文字，可以用来强调重要内容。

---

**加粗文字** 和 *斜体文字* 以及 ~~删除线~~

[链接示例](https://example.com)

### 表格示例

| 功能 | 支持 | 说明 |
|------|------|------|
| 代码高亮 | ✅ | 多语言支持 |
| 数学公式 | ✅ | LaTeX 语法 |
| 图表 | ✅ | Mermaid |
`;

export default function Home() {
  const { markdown, setMarkdown, textareaRef, editorAPI } =
    useMarkdown(INITIAL_MARKDOWN);
  const { styleConfig, updateStyleConfig } = useStyleConfig();
  const [activeModal, setActiveModal] = React.useState<string | null>(null);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header
        editorAPI={editorAPI}
        markdown={markdown}
        styleConfig={styleConfig}
        onMenuClick={setActiveModal}
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

      {activeModal === "style" && (
        <StyleEditor
          config={styleConfig}
          onChange={updateStyleConfig}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
