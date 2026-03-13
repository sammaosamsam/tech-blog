import { useState, useEffect } from 'react';
import ArticleCard from '../components/ArticleCard';

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

interface SiteSettings {
  siteTitle: string;
  siteSubtitle: string;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<SiteSettings>({
    siteTitle: '欢迎来到技术博客',
    siteSubtitle: '分享编程知识，探索技术前沿'
  });

  useEffect(() => {
    // 并发获取文章和站点设置
    Promise.all([
      fetch('/api/articles').then(r => {
        if (!r.ok) throw new Error('获取文章失败');
        return r.json();
      }),
      fetch('/api/settings').then(r => r.json()).catch(() => ({}))
    ])
      .then(([articlesData, settingsData]) => {
        setArticles(articlesData);
        if (settingsData.siteTitle) {
          setSettings({
            siteTitle: settingsData.siteTitle,
            siteSubtitle: settingsData.siteSubtitle || ''
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setError('无法加载文章，请检查后端服务是否运行');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">正在加载文章...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
          <h2 className="mb-2 text-xl font-semibold text-red-800 dark:text-red-400">加载失败</h2>
          <p className="text-red-600 dark:text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">欢迎来到{settings.siteTitle}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {settings.siteSubtitle}
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">暂无文章</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
