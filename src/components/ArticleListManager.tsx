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
  visible?: boolean;
}

interface ArticleListManagerProps {
  articles: Article[];
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, visible: boolean) => void;
}

export default function ArticleListManager({
  articles,
  onEdit,
  onDelete,
  onToggleVisibility
}: ArticleListManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVisible, setFilterVisible] = useState<'all' | 'shown' | 'hidden'>('all');

  const filteredArticles = articles.filter(article => {
    const matchSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchFilter =
      filterVisible === 'all' ||
      (filterVisible === 'shown' && article.visible !== false) ||
      (filterVisible === 'hidden' && article.visible === false);

    return matchSearch && matchFilter;
  });

  const shownCount = articles.filter(a => a.visible !== false).length;
  const hiddenCount = articles.filter(a => a.visible === false).length;

  return (
    <div className="space-y-4">
      {/* 搜索 + 筛选栏 */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="搜索文章标题或标签..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-sm">
          {(['all', 'shown', 'hidden'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilterVisible(f)}
              className={`px-3 py-2 font-medium transition-colors ${
                filterVisible === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {f === 'all' ? `全部 (${articles.length})` : f === 'shown' ? `已显示 (${shownCount})` : `已隐藏 (${hiddenCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* 文章列表 */}
      <div className="space-y-3">
        {filteredArticles.length === 0 ? (
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">没有找到相关文章</p>
          </div>
        ) : (
          filteredArticles.map((article) => {
            const isVisible = article.visible !== false;
            return (
              <div
                key={article._id}
                className={`rounded-lg border bg-white dark:bg-gray-950 p-5 shadow-sm transition-opacity ${
                  isVisible
                    ? 'border-gray-200 dark:border-gray-800'
                    : 'border-gray-200 dark:border-gray-700 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold truncate">{article.title}</h3>
                      {!isVisible && (
                        <span className="shrink-0 inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400">
                          已隐藏
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {article.author} · {article.date} · {article.readTime}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-700 px-2 py-0.5 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
                    {/* 显示/隐藏切换 */}
                    <button
                      onClick={() => onToggleVisibility(article._id, !isVisible)}
                      title={isVisible ? '点击隐藏' : '点击显示'}
                      className={`flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-medium transition-colors ${
                        isVisible
                          ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40'
                          : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                      }`}
                    >
                      {isVisible ? (
                        <>
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          显示中
                        </>
                      ) : (
                        <>
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                          已隐藏
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => onEdit(article)}
                      className="rounded border border-blue-500 bg-blue-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-600 dark:border-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('确定要删除这篇文章吗？')) {
                          onDelete(article._id);
                        }
                      }}
                      className="rounded border border-red-500 bg-red-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-600 dark:border-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
