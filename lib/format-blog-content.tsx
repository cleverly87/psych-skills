/**
 * Formats blog content with markdown-style syntax
 * Supports:
 * - > Quote lines (indented, italic, with left border)
 * - **bold text**
 * - *italic text*
 * - Line breaks and paragraphs
 */
export function formatBlogContent(content: string): string {
  if (!content) return ''

  // Split into paragraphs (double line breaks)
  const paragraphs = content.split(/\n\n+/)

  return paragraphs
    .map((para) => {
      const trimmed = para.trim()
      if (!trimmed) return ''

      // Check if it's a quote (starts with >)
      if (trimmed.startsWith('>')) {
        const quoteText = trimmed.substring(1).trim()
        const formatted = formatInlineStyles(quoteText)
        return `<blockquote class="border-l-4 border-primary/30 pl-4 my-4 italic text-muted-foreground">${formatted}</blockquote>`
      }

      // Regular paragraph
      const formatted = formatInlineStyles(trimmed)
      return `<p class="mb-4">${formatted}</p>`
    })
    .join('')
}

/**
 * Formats inline styles like bold and italic
 */
function formatInlineStyles(text: string): string {
  // Replace **text** with <strong>text</strong>
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  // Replace *text* with <em>text</em> (but not if it's part of **)
  text = text.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')

  // Preserve line breaks within paragraphs
  text = text.replace(/\n/g, '<br />')

  return text
}

/**
 * React component-friendly version that returns JSX
 */
export function BlogContent({ content }: { content: string }) {
  const html = formatBlogContent(content)
  
  return (
    <div 
      className="prose prose-slate dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
