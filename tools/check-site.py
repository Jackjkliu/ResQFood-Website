"""Offline sanity check for the ResQFood static site.

Run from the repo root:  python tools/check-site.py
Checks every top-level .html page for:
  - links/scripts/styles/images pointing at local files that don't exist
  - <img> tags without an alt attribute
  - ES `import` statements inside classic (non-module) <script> blocks,
    which throw a SyntaxError and stop the whole script from running
Exit code 0 = no problems, 1 = problems found (each one is printed).
External URLs are not fetched, so this works without network access.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
ATTR = re.compile(r'<(a|link|script|img)\b[^>]*?\s(href|src)\s*=\s*"([^"]*)"', re.I)
IMG = re.compile(r'<img\b[^>]*>', re.I)
SCRIPT = re.compile(r'<script\b([^>]*)>(.*?)</script>', re.I | re.S)


def local_target(url):
    if not url or "${" in url or url.startswith(("#", "http:", "https:", "//", "mailto:", "tel:", "data:", "javascript:")):
        return None
    return url.split("#")[0].split("?")[0] or None


def check(page):
    html = page.read_text(encoding="utf-8", errors="replace")
    problems = []
    for _tag, _attr, url in ATTR.findall(html):
        target = local_target(url)
        if target and not (page.parent / target).exists():
            problems.append(f"missing file: {url}")
    for img in IMG.findall(html):
        if not re.search(r'[\s"]alt\s*=', img, re.I):
            problems.append(f"img without alt: {img[:80]}")
    for attrs, body in SCRIPT.findall(html):
        if "src=" in attrs or 'type="module"' in attrs or "text/babel" in attrs:
            continue
        if re.search(r'^\s*import\s', body, re.M):
            problems.append("ES import inside a classic <script> (SyntaxError at runtime)")
    return problems


def main():
    total = 0
    for page in sorted(ROOT.glob("*.html")):
        problems = check(page)
        total += len(problems)
        status = "ok" if not problems else f"{len(problems)} problem(s)"
        print(f"{page.name}: {status}")
        for p in problems:
            print(f"  - {p}")
    print(f"\n{total} problem(s) total")
    return 1 if total else 0


if __name__ == "__main__":
    sys.exit(main())
