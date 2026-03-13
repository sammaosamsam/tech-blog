import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
}

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-3xl font-semibold mt-6 mb-3">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-2xl font-semibold mt-4 mb-2">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mb-4 leading-relaxed">{children}</p>
  ),
  // node を DOM に渡さないよう明示的に除外
  code: ({ className, children, node: _node, ...rest }) => {
    const isBlock = Boolean(className);
    if (isBlock) {
      const lang = (className || '').replace('language-', '');
      const codeStr = String(children).replace(/\n$/, '');
      let highlighted = '';
      try {
        highlighted =
          lang && hljs.getLanguage(lang)
            ? hljs.highlight(codeStr, { language: lang }).value
            : hljs.highlightAuto(codeStr).value;
      } catch {
        highlighted = codeStr;
      }
      return (
        <code
          className={`hljs language-${lang || 'plaintext'}`}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      );
    }
    // 行内代码：同样过滤掉 node，只保留安全的 HTML 属性
    const { ...safeProps } = rest as Record<string, unknown>;
    return (
      <code
        className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono"
        {...(safeProps as React.HTMLAttributes<HTMLElement>)}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto mb-4 text-sm">
      {children}
    </pre>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-blue-600 dark:text-blue-400 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-blue-600 dark:border-blue-400 pl-4 italic my-4">
      {children}
    </blockquote>
  ),
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt || ''}
      className="max-w-full rounded-lg my-4 shadow-sm border border-gray-200 dark:border-gray-700"
      loading="lazy"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  ),
};

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
