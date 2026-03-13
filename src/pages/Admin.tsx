import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ArticleListManager from '../components/ArticleListManager';
import ArticleEditor from '../components/ArticleEditor';

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

type AdminView = 'list' | 'new' | 'edit';

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminView>('list');
  const [editingArticle, setEditingArticle] = useState<Article | undefined>();
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // 从后端API获取文章
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/articles', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('获取文章失败');
      }

      const data = await response.json();
      setAllArticles(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleSave = async (article: Article) => {
    try {
      const token = localStorage.getItem('token');

      if (article._id) {
        // 更新现有文章
        const response = await fetch(`/api/articles/${article._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(article),
        });

        if (!response.ok) {
          throw new Error('更新文章失败');
        }

        alert('文章更新成功！');
      } else {
        // 创建新文章
        const response = await fetch('/api/articles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(article),
        });

        if (!response.ok) {
          throw new Error('创建文章失败');
        }

        alert('文章创建成功！');
      }

      setActiveTab('list');
      setEditingArticle(undefined);
      fetchArticles();
    } catch (error) {
      console.error('Error saving article:', error);
      alert('保存失败，请重试');
    }
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setActiveTab('edit');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除这篇文章吗？')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('删除文章失败');
      }

      alert('文章已删除！');
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('删除失败，请重试');
    }
  };

  const handleCancel = () => {
    setEditingArticle(undefined);
    setActiveTab('list');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">正在加载...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-4 text-4xl font-bold">后台管理</h1>
            <p className="text-gray-600 dark:text-gray-400">
              欢迎回来，{user.name || '管理员'}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/"
              className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              返回首页
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
            >
              退出登录
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 border-b border-gray-200 dark:border-gray-800">
        <nav className="flex space-x-8">
          <button
            onClick={() => {
              setActiveTab('list');
              setEditingArticle(undefined);
            }}
            className={`pb-4 text-sm font-medium transition-colors ${
              activeTab === 'list'
                ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            文章管理 ({allArticles.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('new');
              setEditingArticle(undefined);
            }}
            className={`pb-4 text-sm font-medium transition-colors ${
              activeTab === 'new'
                ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            新建文章
          </button>
        </nav>
      </div>

      <div>
        {activeTab === 'list' && (
          <div>
            <h2 className="mb-4 text-2xl font-semibold">文章列表</h2>
            <ArticleListManager
              articles={allArticles}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        )}
        {(activeTab === 'new' || activeTab === 'edit') && (
          <div>
            <h2 className="mb-4 text-2xl font-semibold">
              {activeTab === 'new' ? '新建文章' : '编辑文章'}
            </h2>
            <ArticleEditor
              article={editingArticle}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        )}
      </div>
    </div>
  );
}
