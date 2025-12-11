# 锦绣马面裙电商平台 - 部署指南

本文档详细介绍了如何构建、运行和部署“锦绣马面裙”电商前端项目。

## 1. 环境准备

在开始之前，请确保您的开发环境已安装：

- **Node.js**: v16.0.0 或更高版本
- **包管理器**: npm 或 yarn

## 2. 本地开发运行

### 2.1 安装依赖
在项目根目录下运行终端命令：

```bash
npm install
# 或者
yarn install
```

### 2.2 配置环境变量
项目集成了 Google Gemini AI 功能，需要配置 API Key。

1. 在根目录新建 `.env` 文件。
2. 添加以下内容：

```env
API_KEY=your_google_gemini_api_key_here
```

> **注意**: 在本地运行时，Vite 会自动加载 `.env` 文件。确保不要将此文件提交到代码仓库（已默认在 .gitignore 中忽略）。

### 2.3 启动开发服务器

```bash
npm run dev
# 或者
yarn dev
```

启动后，访问 `http://localhost:5173` 即可预览项目。

## 3. 生产环境构建

当准备发布上线时，执行构建命令以生成优化后的静态文件：

```bash
npm run build
# 或者
yarn build
```

构建完成后，所有静态资源将生成在 `dist` 目录下。

### 本地预览构建结果
在部署前，建议先在本地预览构建后的效果：

```bash
npm run preview
```

## 4. 部署方案

### 方案 A: Vercel / Netlify (推荐)
这是最简单快捷的部署方式，支持自动化 CI/CD。

1. **推送代码**：将代码提交到 GitHub/GitLab。
2. **导入项目**：在 Vercel 或 Netlify 仪表盘中导入该仓库。
3. **配置构建命令**：
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **配置环境变量**：
   - 在平台设置中添加 `API_KEY`，填入你的 Gemini API Key。
5. **点击部署**。

### 方案 B: Nginx (自建服务器)
如果您拥有自己的 Linux 服务器（如阿里云、腾讯云），可以使用 Nginx 托管。

1. 将 `dist` 目录下的所有文件上传至服务器（例如 `/var/www/jinxiu`）。
2. 配置 Nginx 以支持 SPA（单页应用）路由：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/jinxiu;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

3. 重启 Nginx: `sudo nginx -s reload`。

## 5. 注意事项

1. **数据持久化**：
   本项目当前使用浏览器 `localStorage` 进行数据模拟（用户、购物车、聊天记录）。
   - **优点**：无需配置后端数据库即可演示完整流程。
   - **限制**：数据存储在本地，更换浏览器或设备后数据不互通。清除浏览器缓存会丢失数据。

2. **API Key 安全**：
   前端项目中直接使用 API Key 存在暴露风险。在正式商业生产环境中，建议搭建后端服务（Node.js/Python）来转发 Gemini API 请求，从而隐藏真实的 API Key。

3. **路由配置**：
   如果部署到非根目录（例如 `domain.com/shop/`），需要在 `vite.config.ts` 中设置 `base: '/shop/'`，并在 `App.tsx` 的 Router 中配置 basename。
