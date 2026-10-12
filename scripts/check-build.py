"""Check the built preview's routes, fragments, assets, IDs, and page metadata."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
import argparse
import json
import re
import sys

ROOT = Path(__file__).resolve().parents[1] / "dist"
parser = argparse.ArgumentParser()
parser.add_argument("--base", default="/")
BASE = "/" + parser.parse_args().base.strip("/")
if BASE != "/":
    BASE += "/"


def local_path(url):
    if not url.startswith(BASE):
        return None
    return "/" + url[len(BASE):]


class Page(HTMLParser):
    def __init__(self, file):
        super().__init__()
        self.ids, self.links, self.assets, self.references = [], [], [], []
        self.h1 = self.titles = 0
        self.noindex = False
        self.lang = None
        self.feed(file.read_text())

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.append(a["id"])
        if tag == "html":
            self.lang = a.get("lang")
        if tag == "h1":
            self.h1 += 1
        if tag == "title":
            self.titles += 1
        if tag == "meta" and a.get("name") == "robots":
            self.noindex = "noindex" in a.get("content", "")
        if tag == "a":
            self.links.append(a.get("href", ""))
        if tag in ("img", "script") and a.get("src"):
            self.assets.append(a["src"])
        if tag == "link" and a.get("href"):
            self.assets.append(a["href"])
        for key in ("aria-controls", "aria-labelledby", "aria-describedby"):
            self.references.extend(a.get(key, "").split())


files = sorted(ROOT.rglob("*.html"))
pages = {"/" + str(p.relative_to(ROOT)).removesuffix("index.html").rstrip("/"): Page(p) for p in files}
errors = []
link_count = 0
if not pages:
    errors.append("No built HTML pages found; run npm run build first.")
for route, page in pages.items():
    if not page.lang or not page.noindex or page.h1 != 1:
        errors.append(f"{route}: expected language, noindex, and one h1")
    duplicate_ids = [value for value, n in Counter(page.ids).items() if n > 1]
    if duplicate_ids:
        errors.append(f"{route}: duplicate IDs {duplicate_ids}")
    for ref in page.references:
        if ref not in page.ids:
            errors.append(f"{route}: missing ARIA target {ref}")
    for href in page.links:
        link_count += 1
        if not href or href == "#":
            errors.append(f"{route}: empty link")
            continue
        dest = urlsplit(urljoin("https://preview.invalid" + BASE + route.strip("/") + ("/" if route != "/" else ""), href))
        if dest.netloc != "preview.invalid" or dest.scheme not in ("https", "http"):
            continue
        local = local_path(unquote(dest.path))
        if local is None:
            errors.append(f"{route}: link escapes deployment base {href}")
            continue
        target = local.rstrip("/") or "/"
        if target not in pages:
            errors.append(f"{route}: missing route {href}")
        elif dest.fragment and unquote(dest.fragment) not in pages[target].ids:
            errors.append(f"{route}: missing fragment {href}")
    for src in page.assets:
        dest = urlsplit(src)
        if dest.netloc or dest.scheme:
            continue
        local = local_path(unquote(dest.path))
        if local is None:
            errors.append(f"{route}: asset escapes deployment base {src}")
            continue
        asset = ROOT / local.lstrip("/")
        if not asset.is_file():
            errors.append(f"{route}: missing asset {src}")

for css in ROOT.rglob("*.css"):
    for src in re.findall(r"url\(([^)]+)\)", css.read_text()):
        src = src.strip("\"'")
        if src.startswith("data:") or urlsplit(src).netloc:
            continue
        local = local_path(src)
        if local is None or not (ROOT / local.lstrip("/")).is_file():
            errors.append(f"{css.name}: missing or incorrectly prefixed CSS asset {src}")

print(json.dumps({"base": BASE, "pages": len(pages), "links": link_count, "errors": errors}, indent=2))
sys.exit(bool(errors))
