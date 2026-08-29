# -*- coding: utf-8 -*-
"""抖美 — 打包扩展为 zip（可直传 Edge Partner Center）

要求：manifest.json 位于压缩包根部；仅包含运行所需文件；
压缩包内路径全部使用正斜杠（PowerShell Compress-Archive 的反斜杠坑规避）。
"""
import os
import sys
import zipfile

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INCLUDE = ["manifest.json", "_locales", "content", "icons"]


def main():
    # 版本号取自 manifest.json，保证命名一致
    import json

    with open(os.path.join(BASE, "manifest.json"), encoding="utf-8") as f:
        version = json.load(f)["version"]

    out_dir = os.path.join(BASE, "package")
    os.makedirs(out_dir, exist_ok=True)
    out = os.path.join(out_dir, "douyin-beauty-v%s.zip" % version)
    if os.path.exists(out):
        os.remove(out)

    count = 0
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        for item in INCLUDE:
            full = os.path.join(BASE, item)
            if os.path.isfile(full):
                z.write(full, item)
                count += 1
                continue
            for root, _dirs, files in os.walk(full):
                for name in files:
                    p = os.path.join(root, name)
                    arc = os.path.relpath(p, BASE).replace("\\", "/")
                    z.write(p, arc)
                    count += 1
    size_kb = os.path.getsize(out) / 1024
    print("packed: %s (%d files, %.1f KB)" % (out, count, size_kb))


if __name__ == "__main__":
    sys.exit(main())
