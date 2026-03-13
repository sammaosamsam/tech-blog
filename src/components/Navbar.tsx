import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function Navbar() {
  const location = useLocation();
  const [siteTitle, setSiteTitle] = useState('技术博客');
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (data.siteTitle) setSiteTitle(data.siteTitle);
        if (data.siteTitle) document.title = data.siteTitle;
      })
      .catch(() => {});
  }, []);

  const navItems = [
    { path: '/', label: '首页' },
    { path: '/tags', label: '标签' },
    { path: '/about', label: '关于' },
    { path: '/admin', label: '后台管理' }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">💻 {siteTitle}</span>
          </Link>

          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md ${
                  location.pathname === item.path
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* 深色 / 浅色切换按钮 */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
              className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === 'dark' ? (
                /* 太阳图标 - 浅色模式 */
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                /* 月亮图标 - 深色模式 */
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
