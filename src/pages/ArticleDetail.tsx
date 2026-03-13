import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MarkdownRenderer from '../components/MarkdownRenderer';
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

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/articles/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('获取文章失败');
        }
        return response.json();
      })
      .then(data => {
        setArticle(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching article:', err);
        setError('无法加载文章');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">正在加载文章...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">文章未找到</h1>
        <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline">
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-4"
        >
          ← 返回文章列表
        </Link>

        <h1 className="mb-4 text-4xl font-bold">{article.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>作者: {article.author}</span>
          <span>•</span>
          <span>{article.date}</span>
          <span>•</span>
          <span>{article.readTime}</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <Link
              key={tag}
              to={`/tags?tag=${encodeURIComponent(tag)}`}
              className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-800 px-2.5 py-0.5 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-4xl">
        <MarkdownRenderer content={article.content} />
      </div>
    </article>
  );
}
