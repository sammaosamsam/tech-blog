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

interface ArticleListManagerProps {
  articles: Article[];
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
}

export default function ArticleListManager({ articles, onEdit, onDelete }: ArticleListManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <input
          type="text"
          placeholder="搜索文章..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-2 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:border-blue-400 dark:focus:ring-blue-400"
        />
      </div>

      <div className="space-y-4">
        {filteredArticles.length === 0 ? (
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">没有找到相关文章</p>
          </div>
        ) : (
          filteredArticles.map((article) => (
            <div
              key={article._id}
              className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 shadow-sm"
            >
              <div className="mb-3">
                <h3 className="text-xl font-semibold">{article.title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {article.author} • {article.date} • {article.readTime} 分钟
                </p>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-800 px-2.5 py-0.5 text-xs font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="mb-4 line-clamp-2 text-gray-600 dark:text-gray-400">
                {article.excerpt}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(article)}
                  className="rounded border border-blue-600 bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700 dark:border-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  编辑
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('确定要删除这篇文章吗？')) {
                      onDelete(article._id);
                    }
                  }}
                  className="rounded border border-red-600 bg-red-600 px-4 py-2 text-sm text-white transition-colors hover:bg-red-700 dark:border-red-500 dark:bg-red-500 dark:hover:bg-red-600"
                >
                  删除
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
