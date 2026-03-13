import { useState } from 'react';

interface Article {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
  readTime: string;
}

interface ArticleEditorProps {
  article?: Article;
  onSave: (article: Article) => void;
  onCancel: () => void;
}

export default function ArticleEditor({ article, onSave, onCancel }: ArticleEditorProps) {
  const [title, setTitle] = useState(article?.title || '');
  const [excerpt, setExcerpt] = useState(article?.excerpt || '');
  const [content, setContent] = useState(article?.content || '');
  const [author, setAuthor] = useState(article?.author || '技术博主');
  const [tags, setTags] = useState(article?.tags.join(', ') || '');
  const [readTime, setReadTime] = useState(article?.readTime || 5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newArticle: Article = {
      _id: article?._id || '',
      title,
      excerpt,
      content,
      author,
      date: article?.date || new Date().toISOString().split('T')[0],
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      readTime: readTime.toString()
    };

    onSave(newArticle);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      <div>
        <label htmlFor="title" className="mb-2 block text-sm font-semibold">
          文章标题
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-2 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:border-blue-400 dark:focus:ring-blue-400"
          required
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="mb-2 block text-sm font-semibold">
          文章摘要
        </label>
        <textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-2 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:border-blue-400 dark:focus:ring-blue-400"
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="mb-2 block text-sm font-semibold">
          文章内容 (支持 Markdown)
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={20}
          className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-2 font-mono text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:border-blue-400 dark:focus:ring-blue-400"
          placeholder="# 标题&#10;&#10;在这里写文章内容...&#10;&#10;## 子标题&#10;&#10;- 列表项 1&#10;- 列表项 2&#10;&#10;\`\`\`javascript&#10;// 代码示例&#10;console.log('Hello World');&#10;\`\`\`"
          required
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="author" className="mb-2 block text-sm font-semibold">
            作者
          </label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-2 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:border-blue-400 dark:focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label htmlFor="readTime" className="mb-2 block text-sm font-semibold">
            阅读时间（分钟）
          </label>
          <input
            type="number"
            id="readTime"
            value={readTime}
            onChange={(e) => setReadTime(parseInt(e.target.value) || 0)}
            min="1"
            className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-2 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:border-blue-400 dark:focus:ring-blue-400"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="tags" className="mb-2 block text-sm font-semibold">
          标签（用逗号分隔）
        </label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="JavaScript, React, 前端开发"
          className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-2 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:border-blue-400 dark:focus:ring-blue-400"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          保存文章
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-6 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          取消
        </button>
      </div>
    </form>
  );
}
