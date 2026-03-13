export default function About() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-4xl font-bold">关于本博客</h1>

      <div className="max-w-3xl space-y-6">
        <section>
          <h2 className="mb-3 text-2xl font-semibold">博客简介</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            欢迎来到我的技术博客！这是一个专注于分享编程知识、技术经验和开发心得的平台。
            我希望通过这个博客，将我在学习和工作中积累的技术经验分享给更多的开发者朋友。
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">技术栈</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
              <h3 className="mb-2 font-semibold">前端开发</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                React, TypeScript, Vue.js, Next.js
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
              <h3 className="mb-2 font-semibold">后端开发</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Node.js, Python, Java, Go
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
              <h3 className="mb-2 font-semibold">数据库</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                PostgreSQL, MySQL, MongoDB, Redis
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
              <h3 className="mb-2 font-semibold">DevOps</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Docker, Kubernetes, CI/CD, AWS
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">博客特色</h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li>✓ 深入浅出的技术教程</li>
            <li>✓ 实战经验分享</li>
            <li>✓ 最佳实践总结</li>
            <li>✓ 代码示例丰富</li>
            <li>✓ 持续更新内容</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">联系方式</h2>
          <p className="text-gray-600 dark:text-gray-400">
            如果你对博客内容有任何问题或建议，欢迎通过以下方式联系我：
          </p>
          <div className="mt-4 space-y-2">
            <p className="text-gray-600 dark:text-gray-400">
              📧 Email: tech@example.com
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              🐙 GitHub: github.com/techblog
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              🐦 Twitter: @techblog
            </p>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6">
          <h2 className="mb-3 text-xl font-semibold">开源项目</h2>
          <p className="text-gray-600 dark:text-gray-400">
            本博客是使用 React + TypeScript + Vite + Tailwind CSS 构建的。
            源代码开源，欢迎 Star 和 Fork！
          </p>
        </section>
      </div>
    </div>
  );
}
