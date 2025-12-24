# 浪漫粒子圣诞树

一个视觉震撼的交互式 3D 圣诞树可视化项目，使用 React、TypeScript 和 HTML5 Canvas 构建。具有基于粒子的渲染系统、大气特效和浪漫的节日氛围。

## 在线演示

访问在线演示：[https://carlos-fhy.github.io/romantic-particle-christmas-tree/](https://carlos-fhy.github.io/romantic-particle-christmas-tree/)

## 功能特性

### 当前功能

**3D 粒子圣诞树**
- 超过 5,500 个动画粒子组成旋转的 3D 圣诞树
- 发光丝带和装饰球
- 顶部闪烁的星星
- 动态粒子物理和深度排序

**背景大气特效**
- 150+ 片雪花的真实降雪效果
- 夜空中闪烁的星星
- 极光效果
- 随机流星
- 带真实物理效果的烟花
- 飞行的圣诞老人雪橇
- 森林剪影和亮灯的房屋
- 雾气和烟雾效果

**交互功能**
- 背景音乐播放器（Mariah Carey - All I Want For Christmas Is You）
- 三种视觉主题：经典、冰雪、霓虹
- 许愿系统 - 用户可以创建并展示愿望
- 提交愿望时的流星动画
- 鼠标轨迹魔法粒子

**三种视觉主题**
- **经典模式**：温暖浪漫的夜空，金色和香槟色调
- **冰雪模式**：冰蓝色冬日仙境，青色和白色
- **霓虹模式**：赛博朋克风格，充满活力的洋红、青色和紫色

## 技术栈

- **前端框架**：React 19.2.3 + TypeScript 5.8.2
- **构建工具**：Vite 6.2.0
- **渲染引擎**：HTML5 Canvas API 自定义粒子系统
- **样式**：Tailwind CSS（通过 CDN）
- **图标**：Lucide React
- **部署**：GitHub Pages 自动化 CI/CD

## 项目结构

```
romantic-particle-christmas-tree/
├── components/
│   ├── TreeCanvas.tsx       # 主 3D 粒子树渲染器
│   ├── SnowSystem.tsx       # 背景特效和动画
│   ├── Controls.tsx         # UI 控制和愿望输入
│   ├── MagicOverlay.tsx     # 鼠标轨迹特效
│   └── ShootingStar.tsx     # 流星动画
├── App.tsx                  # 主应用组件
├── index.tsx                # React 入口点
├── index.html               # HTML 模板
├── constants.ts             # 配置常量
├── types.ts                 # TypeScript 类型定义
├── vite.config.ts           # Vite 构建配置
└── .github/workflows/       # GitHub Actions 部署工作流
```

## 本地开发

### 环境要求

- Node.js 20+ 和 npm

### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/Carlos-fhy/romantic-particle-christmas-tree.git
cd romantic-particle-christmas-tree

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

应用将在 `http://localhost:3000` 运行

### 生产构建

```bash
npm run build
```

生产构建文件将生成在 `dist/` 目录中。

## 未来规划

### 计划中的功能

**愿望系统的数据库集成**

下一个主要功能将是实现后端数据库系统，以增强许愿体验：

- **持久化愿望存储**：将所有用户的愿望存储在数据库中
- **随机愿望展示**：每隔 10 秒，从数据库中随机选择 4 个愿望
- **可交互的流星**：将愿望以可点击的流星形式展示
- **匿名愿望查看**：用户可以点击流星查看愿望内容（不显示作者信息）
- **实时更新**：任何用户提交的愿望都将对所有访问者可见
- **注重隐私**：仅存储愿望内容，不记录用户身份或跟踪信息

**技术实现方案**
- 后端：Supabase（无服务器，免费套餐）
- API：REST 端点用于愿望的增删改查操作
- 前端：React Hooks 实现实时愿望获取
- 动画：增强的流星组件，支持点击处理

这个功能将把应用转变为一个共享体验，让访问者可以发现并欣赏来自世界各地的愿望，创造真正的节日社区氛围。

## 部署

本项目使用 GitHub Actions 自动部署到 GitHub Pages。任何推送到 `main` 分支的代码都会触发自动构建和部署。

### 手动部署设置

1. Fork 或克隆此仓库
2. 在仓库 Settings > Pages 中启用 GitHub Pages
3. 将 Source 设置为 "GitHub Actions"
4. 更新 `vite.config.ts` 中的 `base` 以匹配你的仓库名：
   ```typescript
   base: '/你的仓库名/'
   ```
5. 推送到 `main` 分支以触发部署

## 配置

### 修改视觉主题颜色

编辑 `constants.ts` 中的 `COLORS` 和 `TRUNK_COLORS` 对象：

```typescript
export const COLORS = {
  [TreeMode.CLASSIC]: ['#FFD700', '#FFF8DC', /* ... */],
  // 添加或修改颜色调色板
};
```

### 调整粒子数量

修改 `constants.ts` 中的 `MAX_PARTICLES`：

```typescript
export const MAX_PARTICLES = 5500; // 根据性能调整
```

### 音频配置

替换 `public/` 中的音频文件并更新 `constants.ts` 中的 `AUDIO_URL`。

## 浏览器支持

- 支持 HTML5 Canvas 的现代浏览器
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

**注意**：这是一个节日主题的 Web 应用，旨在传播节日欢乐。尽情享受这棵互动圣诞树，并与世界分享你的愿望！如有侵权，请联系删除。
