# 维护指南：抖音改版后怎么修

已实测确认的结构知识（2026-08，登录态）：

- 路由：推荐=`/`（`/?recommend=1`）、精选=`/jingxuan`（不在美化范围）、关注=`/follow`、朋友=`/friends`、我的=`/user/self`
- 左侧导航条目有语义类：`.tab-discover`（精选）、`.tab-recommend`（推荐）、`.tab-aisearch`（AI抖音）……文字匹配失效时可改用 `tab-*` 类
- 顶栏整体在 `#douyin-header` 内（`#douyin-right-container` 是主内容列，**不是**右侧小面板，勿做容器级接管）
- 播放器为标准 xgplayer：`xg-controls`、`.xgplayer-progress`、`.xgplayer-played` 等
- 章节提示条：`[data-e2e="chapter-container"]`；搜索框：`data-e2e="searchbar-input"`

## 失效排查表

| 症状 | 改哪里 |
|---|---|
| 某个页面美化不生效 | `pageType()`——路由判断（抖音改路由后更新） |
| 某导航入口没隐藏 / 新入口想隐藏 | `NAV_HIDE_TEXTS`——加入与页面文字**完全一致**的词 |
| 红包/抽奖浮窗回归 | F12 查浮窗的新 ID，替换净化段对应选择器 |
| 某链接没隐藏 | F12 看新链接的 href 前缀，往 href 规则里加一条 |
| 我的页卡片不生效 | F12 查作品列表容器的 `data-e2e`，替换 `profile.css` 段选择器 |
| 进度条样式失效 | xgplayer 类名变化（罕见），查 `.xgplayer-*` |

修改流程（油猴版）：改 `douyin-beauty.user.js` → `@version` +0.0.1 → Tampermonkey 里覆盖保存 → 刷新抖音页面即可，无需任何审核。
