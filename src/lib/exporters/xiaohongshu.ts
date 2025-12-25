export function exportToXiaohongshu(markdown: string): string {
  let text = markdown
    .replace(/^#{1,6}\s+(.+)$/gm, "📌 $1\n")
    .replace(/\*\*(.+?)\*\*/g, "✨$1✨")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/^>\s+(.+)$/gm, "💭 $1");

  return text;
}
