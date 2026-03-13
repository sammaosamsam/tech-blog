interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
  readTime: number;
}

interface Tag {
  id: string;
  name: string;
  count: number;
}

export const articles: Article[] = [
  {
    id: '1',
    title: '深入理解 JavaScript 闭包',
    excerpt: '闭包是 JavaScript 中最重要的概念之一。本文将深入探讨闭包的原理、应用场景以及常见的陷阱，帮助你真正掌握这个强大的特性。',
    content: `# 深入理解 JavaScript 闭包

## 什么是闭包？

闭包（Closure）是指有权访问另一个函数作用域中变量的函数。简单来说，当一个函数能够记住并访问其词法作用域时，就产生了闭包。

\`\`\`javascript
function outer() {
  const name = 'JavaScript';
  
  function inner() {
    console.log(name); // 访问外部函数的变量
  }
  
  return inner;
}

const myFunction = outer();
myFunction(); // 输出: JavaScript
\`\`\`

## 闭包的原理

闭包的创建基于**词法作用域**。JavaScript 引擎在编译时会确定变量的位置，并在运行时保持对词法环境的引用。

### 关键点：

1. **作用域链**：函数可以访问其定义时所在的作用域
2. **内存保持**：即使外部函数执行完毕，闭包仍保持对其作用域的引用
3. **私有变量**：可以模拟私有方法和属性

## 实际应用

### 1. 数据私有化

\`\`\`javascript
function createCounter() {
  let count = 0;
  
  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount());  // 2
\`\`\`

### 2. 函数柯里化

\`\`\`javascript
function multiply(a) {
  return function(b) {
    return a * b;
  };
}

const double = multiply(2);
console.log(double(5)); // 10
\`\`\`

## 常见陷阱

### 内存泄漏

闭包会导致内存无法及时释放，需要谨慎使用：

\`\`\`javascript
// 不好的例子
function heavy() {
  const largeData = new Array(1000000).fill('data');
  
  return function() {
    console.log('done');
  };
}

// 解决方法：及时清除不需要的引用
const handler = heavy();
handler = null;
\`\`\`

## 总结

闭包是 JavaScript 中强大而重要的特性：

✅ **优势**：
- 数据私有化
- 模块化编程
- 函数式编程基础

⚠️ **注意事项**：
- 注意内存管理
- 避免过度使用
- 理解作用域链

掌握闭包将使你的 JavaScript 代码更加优雅和强大！`,
    author: '技术博主',
    date: '2024-03-10',
    tags: ['JavaScript', '前端开发', '编程基础'],
    readTime: 8
  },
  {
    id: '2',
    title: 'React Hooks 最佳实践指南',
    excerpt: 'React Hooks 彻底改变了我们编写组件的方式。本文总结了一些最佳实践，帮助你写出更清晰、更高效的 Hooks 代码。',
    content: `# React Hooks 最佳实践指南

## 为什么使用 Hooks？

Hooks 让我们能够在函数组件中使用 state 和其他 React 特性，无需编写类组件。

## 基础 Hooks

### useState

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
\`\`\`

### useEffect

\`\`\`jsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
  
  return user ? <div>{user.name}</div> : <div>Loading...</div>;
}
\`\`\`

## 自定义 Hooks

自定义 Hooks 是复用逻辑的强大方式：

\`\`\`jsx
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return size;
}
\`\`\`

## 最佳实践

### 1. 遵循 Hooks 规则

✅ 只在最顶层调用 Hooks  
✅ 只在 React 函数中调用 Hooks

### 2. 使用依赖数组

\`\`\`jsx
// 错误：缺少依赖
useEffect(() => {
  console.log(count);
}, []);

// 正确：包含所有依赖
useEffect(() => {
  console.log(count);
}, [count]);
\`\`\`

### 3. 合理使用 useCallback 和 useMemo

\`\`\`jsx
const memoizedCallback = useCallback(
  () => { doSomething(a, b); },
  [a, b]
);

const memoizedValue = useMemo(
  () => computeExpensiveValue(a, b),
  [a, b]
);
\`\`\`

## 总结

掌握 Hooks 是现代 React 开发的必备技能。遵循最佳实践，你将能写出更优雅的代码！`,
    author: '技术博主',
    date: '2024-03-08',
    tags: ['React', '前端开发', '最佳实践'],
    readTime: 6
  },
  {
    id: '3',
    title: 'Docker 容器化部署实战',
    excerpt: 'Docker 已经成为现代应用部署的标准工具。本文通过实际案例，带你从零开始学习如何使用 Docker 进行容器化部署。',
    content: `# Docker 容器化部署实战

## 什么是 Docker？

Docker 是一个开源的容器化平台，允许开发者将应用及其依赖打包到一个可移植的容器中。

## 核心概念

### 1. 镜像 (Image)

镜像是容器的只读模板：

\`\`\`dockerfile
# Dockerfile 示例
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
\`\`\`

### 2. 容器 (Container)

容器是镜像的运行实例：

\`\`\`bash
# 构建镜像
docker build -t my-app:latest .

# 运行容器
docker run -p 3000:3000 my-app:latest
\`\`\`

## 常用命令

### 镜像操作

\`\`\`bash
# 拉取镜像
docker pull nginx:latest

# 查看本地镜像
docker images

# 删除镜像
docker rmi <image-id>
\`\`\`

### 容器操作

\`\`\`bash
# 查看运行中的容器
docker ps

# 查看所有容器
docker ps -a

# 停止容器
docker stop <container-id>

# 删除容器
docker rm <container-id>
\`\`\`

## Docker Compose

Docker Compose 简化多容器应用的管理：

\`\`\`yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
  
  database:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: example
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
\`\`\`

使用 Compose：

\`\`\`bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs

# 停止所有服务
docker-compose down
\`\`\`

## 最佳实践

### 1. 多阶段构建

\`\`\`dockerfile
# 构建阶段
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm run build

# 运行阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
\`\`\`

### 2. 使用 .dockerignore

\`\`\`
node_modules
npm-debug.log
.git
.env
\`\`\`

### 3. 优化镜像大小

- 使用 alpine 基础镜像
- 合并 RUN 命令
- 清理不必要的文件

## 总结

Docker 极大地简化了应用的部署和管理。掌握 Docker 将使你的开发工作更加高效！`,
    author: '技术博主',
    date: '2024-03-05',
    tags: ['Docker', 'DevOps', '部署', '容器化'],
    readTime: 10
  },
  {
    id: '4',
    title: 'TypeScript 高级类型系统',
    excerpt: 'TypeScript 的类型系统非常强大。本文深入探讨高级类型特性，帮助你写出更类型安全的代码。',
    content: `# TypeScript 高级类型系统

## 泛型 (Generics)

泛型允许我们创建可重用的组件：

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

const num = identity<number>(42);
const str = identity('hello');
\`\`\`

### 泛型约束

\`\`\`typescript
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

logLength('hello'); // 5
logLength([1, 2, 3]); // 3
\`\`\`

## 条件类型

\`\`\`typescript
type IsArray<T> = T extends any[] ? true : false;

type Test1 = IsArray<string>; // false
type Test2 = IsArray<number[]>; // true
\`\`\`

## 映射类型

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

interface User {
  name: string;
  age: number;
  email: string;
}

type ReadonlyUser = Readonly<User>;
type PartialUser = Partial<User>;
\`\`\`

## 类型守卫

\`\`\`typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function processValue(value: unknown) {
  if (isString(value)) {
    console.log(value.toUpperCase()); // TypeScript 知道这是字符串
  }
}
\`\`\`

## 工具类型

### Pick

\`\`\`typescript
type UserBasic = Pick<User, 'name' | 'email'>;
\`\`\`

### Omit

\`\`\`typescript
type UserWithoutEmail = Omit<User, 'email'>;
\`\`\`

### Record

\`\`\`typescript
type UserRoles = Record<string, 'admin' | 'user' | 'guest'>;

const roles: UserRoles = {
  john: 'admin',
  jane: 'user'
};
\`\`\`

## 总结

TypeScript 的高级类型系统能够帮助我们编写更安全、更易维护的代码。深入理解这些特性将提升你的开发效率！`,
    author: '技术博主',
    date: '2024-03-01',
    tags: ['TypeScript', '前端开发', '类型系统'],
    readTime: 7
  },
  {
    id: '5',
    title: 'Git 工作流最佳实践',
    excerpt: '有效的 Git 工作流对于团队协作至关重要。本文介绍几种主流的 Git 工作流，以及如何选择适合自己团队的工作流。',
    content: `# Git 工作流最佳实践

## 常见的工作流

### 1. Git Flow

Git Flow 是最早也是最流行的分支模型：

- **master**: 生产环境代码
- **develop**: 开发主线
- **feature**: 新功能开发
- **release**: 发布准备
- **hotfix**: 紧急修复

### 2. GitHub Flow

更简洁的分支模型：

1. 从 main 创建分支
2. 提交更改
3. 创建 Pull Request
4. 代码审查
5. 合并到 main
6. 部署

### 3. GitLab Flow

结合了 Git Flow 和 GitHub Flow 的优点：

- 使用环境分支（staging、production）
- 通过 Merge Request 进行代码审查
- 自动化 CI/CD 集成

## 分支命名规范

\`\`\`bash
# 功能分支
feature/user-authentication
feature/dark-mode

# 修复分支
fix/login-bug
fix/memory-leak

# 发布分支
release/v1.0.0

# 热修复分支
hotfix/critical-security
\`\`\`

## 提交信息规范

使用约定式提交（Conventional Commits）：

\`\`\`
feat: 添加用户认证功能

fix: 修复登录页面的样式问题

docs: 更新 README 文档

style: 格式化代码

refactor: 重构用户服务

test: 添加单元测试

chore: 更新依赖包
\`\`\`

## 常用命令

### 分支管理

\`\`\`bash
# 创建并切换分支
git checkout -b feature/new-feature

# 查看所有分支
git branch -a

# 删除分支
git branch -d feature/completed
\`\`\`

### 暂存与提交

\`\`\`bash
# 查看修改
git status

# 暂存文件
git add .

# 提交
git commit -m "feat: 添加新功能"

# 撤销暂存
git reset HEAD file.txt
\`\`\`

### 合并与变基

\`\`\`bash
# 合并分支
git merge feature-branch

# 变基
git rebase main

# 解决冲突后继续
git rebase --continue
\`\`\`

## 最佳实践

### 1. 保持提交历史清晰

- 频繁提交，小步快跑
- 编写清晰的提交信息
- 及时删除已合并的分支

### 2. 使用 .gitignore

\`\`\`
node_modules
dist
.env
*.log
.DS_Store
\`\`\`

### 3. 配置 Git

\`\`\`bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# 设置默认分支名
git config --global init.defaultBranch main
\`\`\`

## 总结

选择合适的 Git 工作流并遵循最佳实践，将大大提升团队协作效率和代码质量！`,
    author: '技术博主',
    date: '2024-02-28',
    tags: ['Git', '版本控制', '工作流', '团队协作'],
    readTime: 9
  }
];

export const tags: Tag[] = [
  { id: '1', name: 'JavaScript', count: 1 },
  { id: '2', name: '前端开发', count: 3 },
  { id: '3', name: 'React', count: 1 },
  { id: '4', name: 'Docker', count: 1 },
  { id: '5', name: 'DevOps', count: 1 },
  { id: '6', name: 'TypeScript', count: 1 },
  { id: '7', name: 'Git', count: 1 },
  { id: '8', name: '编程基础', count: 1 },
  { id: '9', name: '最佳实践', count: 1 },
  { id: '10', name: '部署', count: 1 },
  { id: '11', name: '容器化', count: 1 },
  { id: '12', name: '类型系统', count: 1 },
  { id: '13', name: '版本控制', count: 1 },
  { id: '14', name: '工作流', count: 1 },
  { id: '15', name: '团队协作', count: 1 }
];
