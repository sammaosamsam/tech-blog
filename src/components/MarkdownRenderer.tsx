import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
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
          code: ({ className, children, ...props }) => {
            const isBlock = Boolean(className);
            if (isBlock) {
              const lang = (className || '').replace('language-', '');
              const code = String(children).replace(/\n$/, '');
              let highlighted = '';
              try {
                highlighted = lang && hljs.getLanguage(lang)
                  ? hljs.highlight(code, { language: lang }).value
                  : hljs.highlightAuto(code).value;
              } catch {
                highlighted = code;
              }
              return (
                <code
                  className={`hljs language-${lang || 'plaintext'}`}
                  dangerouslySetInnerHTML={{ __html: highlighted }}
                />
              );
            }
            return (
              <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
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
          li: ({ children }) => (
            <li>{children}</li>
          ),
          a: ({ children, href }) => (
            <a href={href} className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
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
                const target = e.currentTarget;
                target.style.display = 'none';
              }}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

