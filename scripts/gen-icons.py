# -*- coding: utf-8 -*-
"""抖美 — 生成扩展图标（16/32/48/128）与商店 Logo（300x300）

原创设计：红→橙渐变圆角方块 + 白色圆角播放三角。
不使用任何抖音官方商标素材，规避商店商标审核风险。
"""
import os

from PIL import Image, ImageDraw

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ICONS = os.path.join(BASE, "icons")
STORE = os.path.join(BASE, "store-assets")
os.makedirs(ICONS, exist_ok=True)
os.makedirs(STORE, exist_ok=True)

SS = 4  # 超采样倍率，缩小后边缘平滑

C1 = (254, 44, 85)   # #fe2c55 抖音红
C2 = (255, 143, 31)  # #ff8f1f 橙


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def make(size, radius_ratio, path):
    S = size * SS
    # 对角渐变背景
    grad = Image.new("RGB", (S, S))
    gd = ImageDraw.Draw(grad)
    for y in range(S):
        for_x = y / (S - 1)
        gd.line([(0, y), (S, y)], fill=lerp(C1, C2, for_x))
    # 45° 倾斜：把渐变图旋转后裁回
    grad = grad.rotate(-18, expand=False)

    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    mask = Image.new("L", (S, S), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        [0, 0, S - 1, S - 1], radius=int(S * radius_ratio), fill=255
    )
    img.paste(grad, (0, 0), mask)

    d = ImageDraw.Draw(img)
    # 白色圆角播放三角：多边形 + 顶点圆
    cx, cy = S * 0.54, S * 0.5
    r = S * 0.26
    tri = [
        (cx - r * 0.78, cy - r * 0.82),
        (cx - r * 0.78, cy + r * 0.82),
        (cx + r * 0.98, cy),
    ]
    d.polygon(tri, fill=(255, 255, 255, 255))
    rr = S * 0.06
    for px, py in tri:
        d.ellipse([px - rr, py - rr, px + rr, py + rr], fill=(255, 255, 255, 255))

    img = img.resize((size, size), Image.LANCZOS)
    img.save(path)
    print("ok:", path)


for s in (16, 32, 48, 128):
    make(s, 0.22, os.path.join(ICONS, "icon%d.png" % s))
make(300, 0.18, os.path.join(STORE, "logo-300.png"))
print("done")
