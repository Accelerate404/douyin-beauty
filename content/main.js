/**
 * 抖美 — 抖音网页极简美化
 * content/main.js — 页面识别 + 界面净化
 *
 * v1.4.0：按需求移除全部弹窗与设置界面，扩展全自动生效、零交互。
 * 保留（从未出过问题的核心）：
 * - 路由识别 + <html> 功能类（样式开关与 SPA 解耦）
 * - 导航/浮窗净化（文字精确匹配 + aria 锚点 + 槽位上爬）
 * - 启动初期高频补扫（压掉渐进渲染组件的闪现）
 */
(() => {
  "use strict";

  const HTML = document.documentElement;
  const PAGE_CLASSES = [
    "dyb-on",
    "dyb-feed",
    "dyb-profile",
    "dyb-recommend",
    "dyb-follow",
    "dyb-friends",
  ];

  /* 净化黑名单：按文字精确匹配（与 2026-08 实测导航一致；抖音改版后只需增删此表） */
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
  /* 净化子串黑名单：匹配 aria-label（语义锚点，覆盖图标按钮类干扰） */
  const ARIA_HIDE_SUBSTRINGS = ["下载抖音", "打开抖音", "扫码下载", "客服"];

  /* 清理范围：链接 + 按钮类元素（顶栏充钻石/壁纸是按钮不是链接） */
  const CLEANUP_SELECTOR =
    "a, button, [role='button'], [role='menuitem'], [role='tab'], [role='link']";

  /* 头部/导航内的文本节点（充钻石/壁纸/下载抖音精选等 div 包文字结构；
     div 也纳入扫描，依靠「文字完全一致 + 长度护栏」防止误伤，只扫这两个容器） */
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

  /* 找到条目的"槽位"包装层：从命中元素向上爬，直到碰到有文字兄弟或带 id/data-e2e
     的真实容器为止。允许跨过无文字的图标兄弟节点（按钮 = 图标 + 文字标签的结构）。
     只隐藏内侧文字会留下占位空白（v1.0.4 教训），必须隐藏槽位本身。 */
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

  /* ——— 界面净化 ——— */
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
      // 防误伤：目标若是整个导航/头部容器或文字过多的大块，退回最小元素
      if (
        target.id === "douyin-navigation" ||
        target.id === "douyin-header" ||
        (target.textContent || "").trim().length > 16
      ) {
        target = el.closest("li") || el;
      }
      slotOf(target).classList.add("dyb-nav-hidden");
    });
    // 3) 全页"纯文字叶节点"div：独立悬浮组件（如"下载抖音精选"悬浮按钮）。
    //    只看无子元素的 div 且文字完全一致；排除视频主内容区，防止误伤卡片角标。
    const mainColumn = document.getElementById("douyin-right-container");
    document.querySelectorAll("div").forEach((el) => {
      if (el.childElementCount !== 0) return;
      if (mainColumn && mainColumn.contains(el)) return;
      const text = (el.textContent || "").trim();
      if (!NAV_HIDE_TEXTS.includes(text)) return;
      slotOf(el).classList.add("dyb-nav-hidden");
    });
  }

  /* ——— 页面识别（易变点集中处；抖音改版只需更新此函数） ——— */
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

  /* ——— SPA 路由变化：Navigation API + popstate + 轻量 pathname 比对兜底 ——— */
  function onRouteChange() {
    apply();
  }
  try {
    if (window.navigation && typeof window.navigation.addEventListener === "function") {
      window.navigation.addEventListener("navigatesuccess", onRouteChange);
    }
  } catch (e) {
    /* Navigation API 不可用时由下方兜底覆盖 */
  }
  window.addEventListener("popstate", onRouteChange);

  let lastPath = location.pathname;
  setInterval(() => {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      onRouteChange();
    }
  }, 800);

  /* ——— DOM 变化后补扫（SPA 重渲染），300ms 防抖 ——— */
  let navTimer = null;
  const mo = new MutationObserver(() => {
    clearTimeout(navTimer);
    navTimer = setTimeout(() => {
      if (HTML.classList.contains("dyb-on")) cleanupNav();
    }, 300);
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });

  /* ——— 启动 ——— */
  apply();
  /* 启动初期高频补扫：头部组件（充钻石等）是渐进渲染的，
     不等 MutationObserver 的防抖，把闪现窗口压到最短 */
  [200, 500, 1000, 1800, 3000, 5000].forEach((t) => setTimeout(cleanupNav, t));
})();
