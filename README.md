# 抖美 · douyin-beauty

打开即用的抖音网页版（douyin.com）极简美化油猴脚本：**界面净化 + 细节打磨 + 性能优化**。
零依赖、单文件、不收集任何数据。

> 浏览器扩展版（Edge/Chrome）已停止维护，源码保留在 `content/` 仅供参考；请使用油猴脚本版。

## ✨ 功能

| 类别 | 内容 |
|---|---|
| 界面净化 | 隐藏导航非核心入口（直播/放映厅/短剧/小游戏/充钻石/客户端/壁纸/AI抖音）、红包浮窗、客服气泡、下载引导、IM 弹窗、章节提示条、未读红点角标 |
| 细节打磨 | 进度条 2px 强调色、细滚动条、文字选区强调色、侧栏条目圆角 hover、我的页作品网格圆角卡片 |
| 性能优化 | 清理大面积毛玻璃（GPU 大户）；被净化的元素不再参与渲染；脚本自身零后台、零轮询开销 |

覆盖页面：推荐 `/` · 关注 `/follow` · 朋友 `/friends` · 我的 `/user/self`
（脚本在抖音其他页面不注入任何样式，行为与原版一致）

## 📦 安装

**方式一：从 Greasy Fork 安装（推荐，自动更新）**

打开脚本发布页，点击「安装此脚本」：
<!-- 发布到 Greasy Fork 后，把链接填到这里 -->
https://greasyfork.org/zh-CN/scripts/xxxxx

**方式二：手动安装**

1. 浏览器安装 [Tampermonkey](https://www.tampermonkey.net/)（Edge/Chrome/Firefox 均可）
2. 点击 Tampermonkey 图标 → 「添加新脚本」→ 全选删除模板 → 粘贴 [`douyin-beauty.user.js`](./douyin-beauty.user.js) 全部内容 → `Ctrl+S` 保存
3. 打开 `www.douyin.com`，自动生效

## 🎨 想自己改？

所有可定制点都集中在脚本顶部，改完保存即时生效：

| 想改什么 | 改哪里 |
|---|---|
| 隐藏/恢复某个导航入口 | `NAV_HIDE_TEXTS`（与页面文字完全一致即可） |
| 强调色 | CSS 中 `--dyb-accent` |
| 界面配色 | CSS 中 `--semi-color-*` / `--dyb-*` 变量 |
| 其他样式 | 直接追加自定义规则（脚本 CSS 已注入页面，F12 可查 `#dyb-style`） |

## 🔧 原理

- 所有样式通过 `<html>` 上的功能类（`dyb-on` / `dyb-feed` / `dyb-profile`）生效，与抖音 SPA 的 DOM 重渲染天然解耦
- 净化规则依赖**稳定锚点**（`data-e2e` 属性、结构性 ID、href 模式、导航文字精确匹配），不依赖每次构建都会变化的混淆 class
- 深色观感借力抖音自身的 Semi Design 设计令牌 + 原生暗色开关

## 📝 抖音改版后如何修复

见 [`docs/维护指南.md`](./docs/MAINTENANCE.md)——每一类失效对应改哪里，通常只需改 1-3 行。

## ⚠️ 免责声明

本项目为个人学习性质的界面美化脚本，与抖音、字节跳动官方无任何关联。
不含自动化点击、网络拦截、数据收集；如抖音页面结构变更导致失效，欢迎提 Issue。

## 📄 License

[MIT](./LICENSE)
