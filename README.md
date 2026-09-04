# 高校 Wiki（HighSchoolWiKi）

面向每个高校的 Wiki 知识库，由学生自发维护、共同编写的生活指南，帮助新生与在校生快速获取校园生活、学习资源、社团活动等实用信息。

本站基于 [VitePress](https://vitepress.dev/) 构建、内容以 Markdown 编写。本仓库为可复用的 Wiki 工具仓库：核心能力封装成 VitePress 插件 `packages/vitepress-qutwiki-kit`，并提供可直接复制建站的 `template/wiki` 模板，`docs/` 承载插件文档与示例；整体结构见下文「项目结构」。

## 本地开发

需要 Node.js 22.17 或更高版本；依赖安装优先使用 `npm ci`，避免无意改动锁文件。在项目根目录执行：

```bash
npm ci
npm run dev      # 启动开发服务器，访问 http://localhost:5173
```

在 Windows 上也可用 PowerShell 一键构建并启动本地开发服务器：

```powershell
./build.ps1
```

## 参与编写

想补充或修正站点内容？完整的环境准备、文档规范与提交流程见 [参与编写](https://wiki.quters.top/start/about/contribute) 页面，站点内容组织见下文「项目结构」。

## 项目结构

仓库以 npm workspace 组织，根目录为插件文档站：

```
.
├── .gitattributes              # GitHub Linguist 配置
├── .gitignore
├── LICENSE
├── README.md
├── package.json                # npm workspace 根
├── package-lock.json
├── docs/                       # 插件文档与示例（VitePress）
│   ├── index.md                # 文档首页
│   ├── template.md             # 模板使用说明
│   ├── examples/               # 各组件真实用法示例
│   ├── plugin/                 # 插件介绍 / 安装 / API
│   ├── public/
│   └── .vitepress/             # 文档站配置与主题
├── packages/
│   └── vitepress-qutwiki-kit/  # 可独立安装的 Wiki 组件与插件
│       └── package.json
└── template/
    └── wiki/                   # 可复制建站的 Wiki 内容站模板
        ├── package.json
        └── docs/
            ├── index.md        # 模板首页
            ├── guide/          # 示例内容页
            ├── public/
            └── .vitepress/     # site.ts / config.ts / theme
```

## 致谢

本项目的部分前端样式和后端代码参考了[西邮 Wiki](https://wiki.cooo.site/)（[xupt-wiki/xupt-wiki](https://github.com/xupt-wiki/xupt-wiki)），在此感谢西邮 Wiki 项目组的无私开源。

校园地图功能参考了[重庆大学校园地图导航系统](https://github.com/littlemana-bot/CQUMAPS)（[CQUMAPS](https://github.com/littlemana-bot/CQUMAPS)）与[重庆大学资源共享计划 CQU-openlib](https://github.com/INFO-studio/CQU-openlib)（[cqu-openlib.cn/map](https://cqu-openlib.cn/map)）的页面布局、交互设计与配色方案，在此感谢两个项目的无私开源。

本仓库模板参考了[青岛理工大学 Wiki](https://wiki.quters.top/)（[quters/qut-wiki](https://github.com/quters/qut-wiki)），在此感谢青岛理工大学 Wiki 项目组的无私开源。