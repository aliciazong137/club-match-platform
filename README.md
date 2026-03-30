# ClubMatch 校园社团智能匹配平台

基于 AI 的校园社团推荐与报名系统，帮助新生快速找到最适合自己的社团。

## 在线体验

- 国际访问：https://club-match-platform-mocha.vercel.app
- 国内访问：http://39.105.141.81:3000

## 核心功能

### AI 智能对话
内置 AI 助手，通过自然对话了解你的兴趣爱好，实时推荐匹配社团，支持一键查看详情和报名。

### 社团人格测试
6 维度趣味测试（创造力、社交力、运动力、学术力、表演力、技术力），生成个性化社团匹配报告。

### 社团浏览与报名
40+ 社团完整展示，包含简介、核心成员、学员评价、团费信息，支持加入意向单和一键报名。

### 意向单管理
最多收藏 3 个心仪社团，防止贪多，帮助聚焦选择。

### 报名进度追踪
输入学号即可查看所有报名状态（待处理 / 审核中 / 已通过 / 未通过）。

### 管理后台
社团管理员可查看报名数据、审核申请、管理社团信息。

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS |
| 数据库 | Prisma + SQLite |
| AI | Claude API (Anthropic) |
| 部署 | Vercel / PM2 + 阿里云 |

## 项目结构

```
src/
├── app/
│   ├── page.tsx              # 首页
│   ├── clubs/                # 社团列表 & 详情页
│   ├── quiz/                 # 智能匹配问卷
│   ├── result/               # 匹配结果页
│   ├── personality/          # 社团人格测试
│   ├── my-applications/      # 我的报名进度
│   ├── admin/                # 管理后台
│   └── api/                  # API 路由
├── components/
│   ├── ChatWidget.tsx        # AI 对话组件
│   ├── Navbar.tsx            # 导航栏
│   └── WishlistContext.tsx   # 意向单状态管理
└── lib/
    ├── claude.ts             # AI 接口封装
    └── db.ts                 # 数据库连接
```

## 本地开发

```bash
# 安装依赖
npm install

# 初始化数据库
npx prisma db push
npx prisma db seed

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入 ANTHROPIC_API_KEY

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 环境变量

| 变量名 | 说明 |
|--------|------|
| `ANTHROPIC_API_KEY` | Claude API 密钥 |
| `ANTHROPIC_BASE_URL` | API 代理地址（可选，国内中转用） |

## 部署

### Vercel 部署
1. 连接 GitHub 仓库到 Vercel
2. 在 Vercel 设置中添加环境变量
3. 自动构建部署

### 服务器部署（PM2）
```bash
npm run build
pm2 start npm --name "club-match" -- start
pm2 save
pm2 startup
```
