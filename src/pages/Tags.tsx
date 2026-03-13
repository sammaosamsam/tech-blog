import { useSearchParams } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import ArticleCard from '../components/ArticleCard';
import { Link } from 'react-router-dom';

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

export default function Tags() {
  const [searchParams] = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const selectedTag = searchParams.get('tag');

  useEffect(() => {
    // 从后端API获取所有文章
    fetch('/api/articles')
      .then(response => {
        if (!response.ok) {
          throw new Error('获取文章失败');
        }
        return response.json();
      })
      .then(data => {
        setArticles(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching articles:', err);
        setLoading(false);
      });
  }, []);

  // 动态计算标签
  const tags = useMemo(() => {
    const tagMap = new Map<string, number>();
    articles.forEach(article => {
      article.tags.forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });

    return Array.from(tagMap.entries())
      .map(([name, count], id) => ({ id: id.toString(), name, count }))
      .sort((a, b) => b.count - a.count); // 按文章数量排序
  }, [articles]);

  // 根据选中的标签过滤文章
  const filteredArticles = selectedTag
    ? articles.filter(article => article.tags.includes(selectedTag))
    : articles;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">正在加载标签...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-4xl font-bold">标签分类</h1>

      <div className="mb-8">
        <div className="flex flex-wrap gap-3">
          <Link
            to="/tags"
            className={`inline-flex items-center rounded-full border border-gray-200 dark:border-gray-800 px-4 py-2 text-sm font-semibold transition-colors ${
              !selectedTag
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            全部 ({articles.length})
          </Link>
          {tags.map((tag) => (
            <Link
              key={tag.id}
              to={`/tags?tag=${encodeURIComponent(tag.name)}`}
              className={`inline-flex items-center rounded-full border border-gray-200 dark:border-gray-800 px-4 py-2 text-sm font-semibold transition-colors ${
                selectedTag === tag.name
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {tag.name} ({tag.count})
            </Link>
          ))}
        </div>
      </div>

      {selectedTag && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            标签: <span className="text-blue-600 dark:text-blue-400">{selectedTag}</span>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              ({filteredArticles.length} 篇文章)
            </span>
          </h2>
        </div>
      )}

      {filteredArticles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">没有找到相关文章</p>
        </div>
      )}
    </div>
  );
}
