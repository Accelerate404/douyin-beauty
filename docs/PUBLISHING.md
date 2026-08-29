# 发布指南：GitHub + Greasy Fork（油猴）

## 一、发布到 GitHub

### 1. 本地仓库已就绪

项目目录内已执行过 `git init` 和首次提交。你只需要：

```bash
# 在 GitHub 网页上新建一个空仓库（不要勾选 README/LICENSE）：
# https://github.com/new  → 仓库名建议 douyin-beauty → Public → Create

# 然后在本项目目录执行（把 <你的用户名> 换掉）：
git remote add origin https://github.com/<你的用户名>/douyin-beauty.git
git push -u origin main
```

如果你装了 GitHub CLI 并已登录，也可以一条命令代替（自动建仓库并推送）：

```bash
gh repo create douyin-beauty --public --source=. --push
```

### 2. 推送后做两件小事

1. 仓库页 → About → Website 填 Greasy Fork 脚本链接（发布后补）
2. 把 `douyin-beauty.user.js` 的 `@namespace` 和 README 里的用户名占位改成你的 GitHub 用户名

## 二、发布到 Greasy Fork（油猴）

### 1. 发布

1. 打开 https://greasyfork.org/zh-CN → 右上角「登录」（支持 GitHub 账号直接登录）
2. 头像菜单 → 「发布你编写的脚本」
3. 两种方式任选：
   - **粘贴代码**：把 `douyin-beauty.user.js` 全文粘贴进代码框
   - **从 URL 导入**：填 GitHub 上的原始文件地址
     `https://raw.githubusercontent.com/<你的用户名>/douyin-beauty/main/douyin-beauty.user.js`
4. 检查脚本信息（名称/描述自动读取自元数据头部）→ 勾选「是，发布此脚本」

### 2. 与 GitHub 联动更新（推荐设置）

脚本页 → 「管理」/「代码」页 → 「导入脚本 URL」填上面的 raw 地址。
以后更新流程：

```
改 douyin-beauty.user.js → @version 加 0.0.1 → git commit + push
→ Greasy Fork 脚本页点「更新」（或配置 webhook 自动同步）
```

用户端 Tampermonkey 会按 `@version` 自动拉取更新。

### 3. Greasy Fork 规则注意（已合规）

- 必须开源（我们是纯源码单文件 ✓）
- 不得混淆/压缩代码（我们未压缩 ✓）
- 不得收集用户数据（我们不收集 ✓）
- 名称/描述不得冒充官方（描述已注明美化定位 ✓）

## 三、安装链接怎么写回 README

发布成功后脚本页地址形如：
`https://greasyfork.org/zh-CN/scripts/000000`

把 README「方式一」里的占位链接换成这个地址，commit + push 即可。
