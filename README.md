# GameTrend Radar Frontend

前端React应用，部署到Vercel平台。

## 功能特性

- 🎮 游戏数据展示和统计
- 📊 实时数据更新
- 🔄 一键执行完整检测
- 📱 响应式设计

## 部署到Vercel

1. 在Vercel官网创建新项目
2. 连接GitHub仓库
3. 选择此frontend目录作为部署目录
4. Vercel会自动检测并部署

## 配置说明

前端会自动连接到Railway部署的后端API：
- 后端地址：`https://game-trend-radar-backend.railway.app`
- API端点：`/api/games` 和 `/api/daily-job`

## 本地开发

```bash
cd frontend
npm install
npm run dev
```

应用将在 http://localhost:5173 运行

## 注意事项

确保后端服务已在Railway上正常运行，否则前端将无法获取数据。