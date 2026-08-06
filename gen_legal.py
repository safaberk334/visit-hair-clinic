# -*- coding: utf-8 -*-
"""Yasal sayfa ureteci — cookies / privacy / kvkk, 4 dilde.

Cikti:  /privacy.html /kvkk.html /cookies.html          (EN, kok)
        /tr/... /ar/... /it/...

Sayfa iskeleti mevcut cookies.html'den alindi (ayni CSS siniflari).
Kullanim: python gen_legal.py
"""
import io, os, sys, html as H
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "i18n"))
from legal_content import PAGES, UPDATED, BACK, RIGHTS

HERE = os.path.dirname(os.path.abspath(__file__))
DOMAIN = "https://visithairclinic.com"
LANGS = {"en": ("", "en", "ltr"), "tr": ("tr/", "tr", "ltr"),
         "ar": ("ar/", "ar", "rtl"), "it": ("it/", "it", "ltr")}
SLUGS = ["privacy", "kvkk", "cookies"]


def render_blocks(blocks, links):
    out = []
    for kind, val in blocks:
        if kind == "p":
            out.append(f"    <p>{val.format(**links)}</p>")
        elif kind == "h2":
            out.append(f"    <h2>{H.escape(val)}</h2>")
        elif kind == "ul":
            items = "\n".join(f"        <li>{v.format(**links)}</li>" for v in val)
            out.append(f"    <ul>\n{items}\n    </ul>")
        elif kind == "tb":
            head = "".join(f"<th>{H.escape(c)}</th>" for c in val[0])
            rows = "\n".join(
                "        <tr>" + "".join(f"<td>{H.escape(c)}</td>" for c in r) + "</tr>"
                for r in val[1:])
            out.append(f"    <table>\n      <thead>\n        <tr>{head}</tr>\n"
                       f"      </thead>\n      <tbody>\n{rows}\n      </tbody>\n    </table>")
        elif kind == "nt":
            out.append(f'    <div class="legal__note">{H.escape(val)}</div>')
    return "\n\n".join(out)


def build(slug, lang):
    folder, hl, direction = LANGS[lang]
    title, blocks = PAGES[slug][lang]
    base = "/" + folder
    links = {s: base + s + ".html" for s in SLUGS}
    canon = f"{DOMAIN}{base}{slug}.html"
    alts = "\n  ".join(
        f'<link rel="alternate" hreflang="{LANGS[l][1]}" '
        f'href="{DOMAIN}/{LANGS[l][0]}{slug}.html">' for l in LANGS)

    return f"""<!DOCTYPE html>
<html lang="{hl}" dir="{direction}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{H.escape(title)} | Visit Hair Clinic</title>
  <meta name="description" content="{H.escape(title)} — Visit Hair Clinic">
  <link rel="canonical" href="{canon}">
  <meta name="robots" content="index, follow">
  {alts}
  <link rel="alternate" hreflang="x-default" href="{DOMAIN}/{slug}.html">
  <link rel="icon" type="image/png" sizes="48x48" href="/img/logo/favicon-48.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <main class="legal">
    <a href="{base}" class="legal__back">{H.escape(BACK[lang])}</a>
    <div class="legal__header">
      <h1>{H.escape(title)}</h1>
      <p class="legal__updated">{H.escape(UPDATED[lang])}</p>
    </div>

{render_blocks(blocks, links)}

    <div class="legal__footer">
      {H.escape(RIGHTS[lang])}
    </div>
  </main>
</body>
</html>
"""


def main():
    n = 0
    for lang in LANGS:
        outdir = os.path.join(HERE, LANGS[lang][0]) if LANGS[lang][0] else HERE
        os.makedirs(outdir, exist_ok=True)
        for slug in SLUGS:
            io.open(os.path.join(outdir, slug + ".html"), "w", encoding="utf-8").write(build(slug, lang))
            n += 1
        print(f"  /{LANGS[lang][0]:4s} -> {', '.join(s + '.html' for s in SLUGS)}")
    print(f"  toplam {n} sayfa")


if __name__ == "__main__":
    main()
