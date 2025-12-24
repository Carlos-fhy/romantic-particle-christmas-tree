# 🚀 GitHub Pages 自动化部署指南

本项目已配置好自动化部署流程，当你推送代码到 GitHub 时，会自动构建并部署到 GitHub Pages。

## 📋 部署步骤

### 1. 创建 GitHub 仓库

```bash
# 如果还没有 git 仓库，先初始化
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 在 GitHub 上创建新仓库，然后关联
git remote add origin https://github.com/your-username/romantic-particle-christmas-tree.git

# 推送到 GitHub
git push -u origin main
```

### 2. 配置 GitHub Pages

1. 进入你的 GitHub 仓库页面
2. 点击 **Settings** (设置)
3. 在左侧菜单找到 **Pages**
4. 在 **Source** (来源) 部分，选择 **GitHub Actions**

   ```
   Source: GitHub Actions
   ```

### 3. 调整配置（如果需要）

#### 如果你的仓库名不是 `romantic-particle-christmas-tree`

打开 `vite.config.ts`，修改第 11 行的 `base` 配置：

```typescript
// 将 'romantic-particle-christmas-tree' 替换为你的实际仓库名
base: '/你的仓库名/',
```

#### 如果你使用自定义域名或用户页面（username.github.io）

打开 `vite.config.ts`，将 `base` 改为：

```typescript
base: '/',
```

### 4. 触发部署

部署会在以下情况自动触发：

- **推送代码到 main 分支**
  ```bash
  git add .
  git commit -m "Your commit message"
  git push
  ```

- **手动触发** (在 GitHub 仓库页面)
  1. 进入 **Actions** 标签页
  2. 点击左侧的 **Deploy to GitHub Pages**
  3. 点击 **Run workflow** 按钮

### 5. 查看部署状态

1. 进入仓库的 **Actions** 标签页
2. 你会看到正在运行或已完成的工作流
3. 点击查看详细日志

部署成功后，网站地址为：
```
https://your-username.github.io/romantic-particle-christmas-tree/
```

## 🔍 工作流说明

部署流程包含两个任务：

### Build (构建)
- 检出代码
- 安装 Node.js 20
- 安装依赖 (`npm install`)
- 构建项目 (`npm run build`)
- 上传构建产物

### Deploy (部署)
- 将构建产物部署到 GitHub Pages
- 生成可访问的网站 URL

## ⚙️ 自定义配置

### 修改触发分支

如果你想从其他分支部署，修改 `.github/workflows/deploy.yml` 第 6 行：

```yaml
branches: ['main']  # 改成 ['dev'] 或其他分支名
```

### 修改 Node.js 版本

修改 `.github/workflows/deploy.yml` 第 30 行：

```yaml
node-version: '20'  # 改成 '18' 或其他版本
```

## 🐛 常见问题

### 问题 1: 部署成功但页面空白或 404

**原因**: `base` 配置不正确

**解决方案**: 检查 `vite.config.ts` 中的 `base` 配置是否与仓库名匹配

### 问题 2: Actions 没有权限部署

**解决方案**:
1. 进入仓库 **Settings** → **Actions** → **General**
2. 找到 **Workflow permissions**
3. 选择 **Read and write permissions**
4. 保存更改

### 问题 3: 静态资源加载失败

**原因**: 路径问题

**解决方案**: 确保所有资源引用使用相对路径或正确的 base URL

## 📝 文件结构

```
.github/
  workflows/
    deploy.yml       # GitHub Actions 工作流配置
vite.config.ts       # Vite 配置（包含 base URL 设置）
dist/                # 构建输出目录（自动生成）
```

## 🎉 完成！

推送代码后，稍等几分钟，你的圣诞树网站就会自动部署上线了！
