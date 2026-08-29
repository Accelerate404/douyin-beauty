// ==UserScript==
// @name         抖美 - 抖音网页极简美化
// @namespace    https://github.com/Accelerate404/douyin-beauty
// @version      1.0.0
// @description  打开即用的抖音网页极简美化：界面净化、隐藏视觉干扰、细节打磨。零依赖、不收集任何数据。
// @author       douyin-beauty
// @match        https://www.douyin.com/*
// @run-at       document-start
// @grant        none
// @noframes
// @license      MIT
// ==/UserScript==

/**
 * 抖美 — 抖音网页极简美化（油猴脚本版）
 *
 * 功能：
 * - 界面净化：隐藏导航非核心入口（直播/放映厅/短剧/小游戏/充钻石/客户端/壁纸/AI抖音）、
 *   红包浮窗、客服气泡、下载引导、章节提示条、未读红点角标
 * - 细节打磨：进度条强调色、细滚动条、侧栏条目圆角 hover、我的页卡片化
 * - 性能：清理大面积毛玻璃（GPU 大户）；被净化的元素不再参与渲染
 *
 * 维护：抖音改版后只需更新 NAV_HIDE_TEXTS（导航文字黑名单）或对应 CSS 选择器。
 */
(() => {
  "use strict";

  /* ================= 样式 ================= */

  const CSS = `
/* ===== 设计令牌 ===== */
html.dyb-on {
  --dyb-bg: #0f0f12;
  --dyb-bg-card: #1a1a1f;
  --dyb-bg-float: #1c1c22;
  --dyb-text-1: #e8e8ea;
  --dyb-text-2: #9a9aa2;
  --dyb-text-3: #6b6b73;
  --dyb-accent: #fe2c55;
  --dyb-line: rgba(255, 255, 255, 0.07);
}

/* ===== Semi Design 令牌覆盖（抖音 web 组件库设计令牌） ===== */
html.dyb-on {
  --semi-color-bg-0: #0f0f12;
  --semi-color-bg-1: #131317;
  --semi-color-bg-2: #1a1a1f;
  --semi-color-bg-3: #1c1c22;
  --semi-color-bg-4: #232329;
  --semi-color-text-0: #e8e8ea;
  --semi-color-text-1: #b9b9c0;
  --semi-color-text-2: #9a9aa2;
  --semi-color-fill-0: rgba(255, 255, 255, 0.05);
  --semi-color-fill-1: rgba(255, 255, 255, 0.08);
  --semi-color-fill-2: rgba(255, 255, 255, 0.12);
  --semi-color-border: rgba(255, 255, 255, 0.08);
  --semi-color-primary: var(--dyb-accent);
  --semi-color-primary-hover: var(--dyb-accent);
  --semi-color-primary-active: var(--dyb-accent);
  color-scheme: dark;
}

/* ===== 界面净化 ===== */

/* 导航黑名单（JS 文字匹配后加类） */
html.dyb-on .dyb-nav-hidden {
  display: none !important;
}

/* href 模式兜底（由业务路由决定，跨版本稳定） */
html.dyb-on a[href*="live.douyin.com/?from_nav="],
html.dyb-on a[href^="/vs"],
html.dyb-on a[href*="/series"],
html.dyb-on a[href*="/microgame"],
html.dyb-on a[href*="/aisearch"] {
  display: none !important;
}

/* 活动浮窗 / 红包 / 抽奖（社区脚本长期验证的稳定 ID） */
html.dyb-on #short_touch_land_redpacket_land,
html.dyb-on #lottery_close_cotainer,
html.dyb-on #btn-feelgood {
  display: none !important;
}

/* IM 悬浮弹窗 */
html.dyb-on [data-e2e="im-dialog"] {
  display: none !important;
}

/* aria 语义锚点净化（下载引导浮窗、客服气泡等） */
html.dyb-on [aria-label*="下载抖音"],
html.dyb-on [aria-label*="打开抖音"],
html.dyb-on [aria-label*="扫码下载"],
html.dyb-on [aria-label*="客服"] {
  display: none !important;
}

/* 红点角标（右上角头像旁的未读红点等；不动带数字的计数角标） */
html.dyb-on [class*="reddot"],
html.dyb-on [class*="red-dot"],
html.dyb-on [class*="badge-dot"],
html.dyb-on [class*="dot-badge"] {
  display: none !important;
}

/* class 名含 download 的引导/下载组件 */
html.dyb-on [class*="ownload"] {
  display: none !important;
}

/* ===== 播放器净化（2026-08 实测锚点：data-e2e + xgplayer 标准类） ===== */

/* 充钻石按钮（data-e2e 实测指向它） */
html.dyb-on [data-e2e="something-button"] {
  display: none !important;
}

/* 右缘上下切换箭头（滚轮即可切换；候选选择器，未命中则自动无效果） */
html.dyb-on [data-e2e="feed-switch-button"],
html.dyb-on [class*="switch-btn"],
html.dyb-on [class*="switchBtn"],
html.dyb-on [class*="switch_button"],
html.dyb-on [class*="feedSwitch"] {
  display: none !important;
}

/* 章节提示条（"章节要点 / 下一章"悬浮条） */
html.dyb-feed [data-e2e="chapter-container"] {
  display: none !important;
}

/* 进度条：2px 强调色，hover 加粗 */
html.dyb-feed .xgplayer-progress {
  height: 2px !important;
}
html.dyb-feed .xgplayer-progress:hover {
  height: 4px !important;
}
html.dyb-feed .xgplayer-played {
  background: var(--dyb-accent) !important;
}

/* ===== 性能：去掉大范围毛玻璃（GPU 大户） ===== */
html.dyb-on [style*="backdrop-filter"] {
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

/* ===== 全局细节 ===== */
html.dyb-on ::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
html.dyb-on ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.14);
  border-radius: 4px;
}
html.dyb-on ::-webkit-scrollbar-track {
  background: transparent;
}
html.dyb-on ::selection {
  background: rgba(254, 44, 85, 0.4);
}

/* 侧栏条目圆润 hover（槽位类名为实测锚点） */
html.dyb-on #douyin-navigation .kCzNsmN5 {
  border-radius: 10px;
  transition: background 0.16s ease-out;
}
html.dyb-on #douyin-navigation .kCzNsmN5:hover {
  background: rgba(255, 255, 255, 0.07);
}

/* ===== 我的页 ===== */
html.dyb-profile body {
  background: #0f0f12 !important;
}
html.dyb-profile #douyin-right-container {
  background: #0f0f12 !important;
}
html.dyb-profile [data-e2e="user-post-list"] li,
html.dyb-profile ul[data-e2e="user-post-list"] > li {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.16s ease-out, box-shadow 0.16s ease-out;
}
html.dyb-profile [data-e2e="user-post-list"] li:hover,
html.dyb-profile ul[data-e2e="user-post-list"] > li:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
  outline: 1px solid rgba(254, 44, 85, 0.45);
}
html.dyb-profile [data-e2e="user-post-list"] {
  gap: 16px;
}
`;

  const style = document.createElement("style");
  style.id = "dyb-style";
  style.textContent = CSS;
  (document.head || document.documentElement).appendChild(style);

  /* ================= 逻辑 ================= */

  const HTML = document.documentElement;
  const PAGE_CLASSES = [
    "dyb-on",
    "dyb-feed",
    "dyb-profile",
    "dyb-recommend",
    "dyb-follow",
    "dyb-friends",
  ];

  /* 净化黑名单：按文字精确匹配（抖音改版后只需增删此表） */
  const NAV_HIDE_TEXTS = [
    "直播",
    "放映厅",
    "短剧",
    "小游戏",
    "充钻石",
    "客户端",
    "壁纸",
    "AI抖音",
    "下载抖音",
    "下载抖音精选",
  ];
  /* 净化子串黑名单：匹配 aria-label */
  const ARIA_HIDE_SUBSTRINGS = ["下载抖音", "打开抖音", "扫码下载", "客服"];

  const CLEANUP_SELECTOR =
    "a, button, [role='button'], [role='menuitem'], [role='tab'], [role='link']";

  const HEADER_TEXT_SELECTOR =
    "#douyin-header p, #douyin-header span, #douyin-header div, #douyin-navigation p, #douyin-navigation span, #douyin-navigation div";

  function shouldHide(el) {
    const text = (el.textContent || "").trim();
    if (text && NAV_HIDE_TEXTS.includes(text)) return true;
    const label = el.getAttribute("aria-label") || "";
    if (label && ARIA_HIDE_SUBSTRINGS.some((s) => label.includes(s))) return true;
    if (label && NAV_HIDE_TEXTS.includes(label.trim())) return true;
    return false;
  }

  /* 找到条目的"槽位"包装层：向上爬过纯包装节点（允许跨过无文字的图标兄弟），
     隐藏槽位本身，避免"看不见但占位" */
  function slotOf(el) {
    let target = el;
    for (let depth = 0; depth < 6; depth++) {
      const p = target.parentElement;
      if (!p || p === document.body || p === document.documentElement) break;
      if (p.id) break;
      if (p.hasAttribute("data-e2e")) break;
      let siblingText = "";
      for (const c of p.children) {
        if (c !== target) siblingText += c.textContent || "";
      }
      let hasOwnText = false;
      for (const n of p.childNodes) {
        if (n.nodeType === 3 && n.textContent.trim()) {
          hasOwnText = true;
          break;
        }
      }
      if (siblingText.trim() === "" && !hasOwnText) target = p;
      else break;
    }
    return target;
  }

  function cleanupNav() {
    // 1) 全页链接与按钮类元素
    document.querySelectorAll(CLEANUP_SELECTOR).forEach((el) => {
      if (el.dataset.dybChecked === "1") return;
      el.dataset.dybChecked = "1";
      if (!shouldHide(el)) return;
      slotOf(el).classList.add("dyb-nav-hidden");
    });
    // 2) 头部/导航区内的文本节点（充钻石、壁纸、下载抖音精选等 div 包文字结构）
    document.querySelectorAll(HEADER_TEXT_SELECTOR).forEach((el) => {
      if (el.dataset.dybChecked === "1") return;
      el.dataset.dybChecked = "1";
      const text = (el.textContent || "").trim();
      if (!NAV_HIDE_TEXTS.includes(text)) return;
      let target = el.closest("[data-e2e]") || el.closest("li") || el;
      if (
        target.id === "douyin-navigation" ||
        target.id === "douyin-header" ||
        (target.textContent || "").trim().length > 16
      ) {
        target = el.closest("li") || el;
      }
      slotOf(target).classList.add("dyb-nav-hidden");
    });
    // 3) 全页"纯文字叶节点"div：独立悬浮组件（排除视频主内容区防误伤）
    const mainColumn = document.getElementById("douyin-right-container");
    document.querySelectorAll("div").forEach((el) => {
      if (el.childElementCount !== 0) return;
      if (mainColumn && mainColumn.contains(el)) return;
      const text = (el.textContent || "").trim();
      if (!NAV_HIDE_TEXTS.includes(text)) return;
      slotOf(el).classList.add("dyb-nav-hidden");
    });
  }

  /* 页面识别（易变点集中处；抖音改版只需更新此函数） */
  function pageType(pathname) {
    const p = (pathname || "/").replace(/\/+$/, "") || "/";
    if (p === "/") return { type: "feed", key: "recommend" };
    if (p === "/follow") return { type: "feed", key: "follow" };
    if (p === "/friends") return { type: "feed", key: "friends" };
    if (p.indexOf("/user/self") === 0) return { type: "profile", key: "profile" };
    return null;
  }

  function apply() {
    PAGE_CLASSES.forEach((c) => HTML.classList.remove(c));
    const info = pageType(location.pathname);
    if (!info) return;
    HTML.classList.add("dyb-on", "dyb-" + info.type, "dyb-" + info.key);
    cleanupNav();
  }

  /* SPA 路由变化：Navigation API + popstate + 轻量 pathname 比对兜底 */
  function onRouteChange() {
    apply();
  }
  try {
    if (window.navigation && typeof window.navigation.addEventListener === "function") {
      window.navigation.addEventListener("navigatesuccess", onRouteChange);
    }
  } catch (e) {
    /* ignore */
  }
  window.addEventListener("popstate", onRouteChange);

  let lastPath = location.pathname;
  setInterval(() => {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      onRouteChange();
    }
  }, 800);

  /* DOM 变化后补扫（SPA 重渲染），300ms 防抖 */
  let navTimer = null;
  const mo = new MutationObserver(() => {
    clearTimeout(navTimer);
    navTimer = setTimeout(() => {
      if (HTML.classList.contains("dyb-on")) cleanupNav();
    }, 300);
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });

  /* 启动 */
  apply();
  [200, 500, 1000, 1800, 3000, 5000].forEach((t) => setTimeout(cleanupNav, t));
})();
