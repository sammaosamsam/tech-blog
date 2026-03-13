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
  category?: string;
  coverImage?: string;
}

interface ArticleCardProps {
  article: Article;
  categoryName?: string;
  categoryColor?: string;
}

export default function ArticleCard({ article, categoryName, categoryColor }: ArticleCardProps) {
  return (
    <article className="group overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      {/* 封面图 */}
      {article.coverImage && (
        <Link to={`/article/${article._id}`} className="block overflow-hidden h-44">
          <img
            src={article.coverImage}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      )}

      <Link to={`/article/${article._id}`} className="block p-6">
        {/* 分类 + 日期 + 阅读时间 */}
        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          {categoryName && (
            <span
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
              style={{ backgroundColor: categoryColor || '#6b7280' }}
            >
              {categoryName}
            </span>
          )}
          <span>{article.date}</span>
          <span>•</span>
          <span>{article.readTime} 分钟</span>
        </div>

        <h2 className="mb-3 text-xl font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
          {article.title}
        </h2>

        <p className="mb-4 text-gray-600 dark:text-gray-400 line-clamp-2 text-sm leading-relaxed">
          {article.excerpt}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {article.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-400"
            >
              {tag}
            </span>
          ))}
          {article.tags.length > 4 && (
            <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs text-gray-400">
              +{article.tags.length - 4}
            </span>
          )}
        </div>
      </Link>
    </article>
  );
}
