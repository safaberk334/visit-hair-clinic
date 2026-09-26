# -*- coding: utf-8 -*-
"""Cok dilli statik sayfa ureteci — Visit Hair Clinic.

Girdi : _template.html  (data-i18n isaretli sablon)
        i18n/translations.json  (tr / en / ar / it)
        js/main.src.js  (i18n blogu iceren kaynak JS)
Cikti : /index.html (EN, x-default)  +  /tr/  /ar/  /it/index.html
        js/main.js  (i18n blogu cikarilmis — metin artik HTML'e gomulu)
        sitemap.xml

Neden: onceki sistem metni JS ile degistiriyordu. Google JS ile degisen metni
tek sayfa olarak gorup sadece bir dili indeksliyordu. Artik her dil kendi
URL'inde, metin kaynak HTML'de.

Kullanim: python gen_i18n.py
"""
import json, os, re, io, sys, shutil
from datetime import date
from lxml import html as LH, etree

HERE = os.path.dirname(os.path.abspath(__file__))
DOMAIN = "https://visithairclinic.com"
INSTAGRAM = "https://instagram.com/visithairclinic"

# dil -> (klasor, html lang, dir, og locale)
LANGS = {
    "en": ("",    "en", "ltr", "en_US"),   # kok = x-default (uluslararasi pazar)
    "tr": ("tr/", "tr", "ltr", "tr_TR"),
    "ar": ("ar/", "ar", "rtl", "ar_SA"),
    "it": ("it/", "it", "ltr", "it_IT"),
}
LANG_LABEL = {"en": "EN", "tr": "TR", "ar": "AR", "it": "IT"}

SEO = {
    "en": dict(
        title="Hair Transplant Turkey | FUE, DHI & Sapphire FUE – Visit Hair Clinic",
        desc="Premium hair transplant in Turkey: FUE, DHI and Sapphire FUE. 5,000+ successful operations, natural and permanent results. Free consultation on WhatsApp.",
        keywords="hair transplant turkey, FUE hair transplant, DHI, sapphire FUE, hair transplant cost turkey, visit hair clinic"),
    "tr": dict(
        title="Saç Ekimi Türkiye | FUE, DHI, Safir FUE – Visit Hair Clinic",
        desc="Türkiye'de premium saç ekimi: FUE, DHI ve Safir FUE. 5.000+ başarılı operasyon, doğal ve kalıcı sonuç. Ücretsiz konsültasyon — WhatsApp'tan yazın.",
        keywords="saç ekimi, saç ekimi türkiye, FUE saç ekimi, DHI, safir fue, saç ekimi fiyatları, visit hair clinic, sedat kuren"),
    "ar": dict(
        title="زراعة الشعر في تركيا | تقنيات FUE و DHI والسفير – Visit Hair Clinic",
        desc="زراعة شعر متميزة في تركيا: تقنيات FUE و DHI وسفير FUE. أكثر من 5000 عملية ناجحة ونتائج طبيعية ودائمة. استشارة مجانية عبر واتساب.",
        keywords="زراعة الشعر في تركيا, زراعة الشعر, تقنية FUE, تقنية DHI, سفير, تكلفة زراعة الشعر, visit hair clinic"),
    "it": dict(
        title="Trapianto Capelli Turchia | FUE, DHI e FUE Zaffiro – Visit Hair Clinic",
        desc="Trapianto di capelli in Turchia: FUE, DHI e FUE Zaffiro. Oltre 5.000 operazioni riuscite, risultati naturali e permanenti. Consulenza gratuita su WhatsApp.",
        keywords="trapianto capelli turchia, trapianto di capelli, FUE, DHI, FUE zaffiro, costo trapianto capelli turchia, visit hair clinic"),
}

VERIFY = "4dCbDa08Nvf3TZVqLjh5RtWiMnv8tUctYn0Yu17rO0Y"


# ---------- yardimcilar ----------
def url_for(lang):
    return DOMAIN + "/" + LANGS[lang][0]

def strip_tags(s):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", s)).strip()

REL_SKIP = ("http://", "https://", "//", "/", "#", "mailto:", "tel:", "data:", "javascript:")

def absolutize(value):
    """Relatif yolu koke sabitler: alt klasordeki sayfalar da ayni yolu kullanabilsin."""
    if not value or value.startswith(REL_SKIP):
        return value
    return "/" + value.lstrip("./")

def fix_fragment_links(frag):
    """Ceviri metinlerinin icindeki relatif href'leri koke sabitler."""
    return re.sub(r'href="(?!https?:|//|/|#|mailto:|tel:)([^"]+)"', r'href="/\1"', frag)


# ---------- head ----------
def build_head_html(lang, t):
    folder, hl, direction, oglocale = LANGS[lang]
    s = SEO[lang]
    canon = url_for(lang)
    alts = "\n  ".join(
        f'<link rel="alternate" hreflang="{LANGS[l][1]}" href="{url_for(l)}">' for l in LANGS
    )
    og_alt = "\n  ".join(
        f'<meta property="og:locale:alternate" content="{LANGS[l][3]}">'
        for l in LANGS if l != lang
    )

    clinic = {
        "@context": "https://schema.org",
        "@type": "MedicalClinic",
        "name": "Visit Hair Clinic",
        "description": strip_tags(t["about_text1"]),
        "url": canon,
        "logo": f"{DOMAIN}/img/logo/logo-transparent.png",
        "image": f"{DOMAIN}/img/og-image.jpg",
        "email": "visithairclinic@gmail.com",
        "telephone": "+905078814325",
        "medicalSpecialty": "PlasticSurgery",
        "priceRange": "$$",
        "founder": {"@type": "Person", "name": "Sedat Kuren",
                    "jobTitle": strip_tags(t.get("about_badge", "Hair Transplant Specialist"))},
        "address": {"@type": "PostalAddress", "addressCountry": "TR"},
        "availableLanguage": ["Turkish", "English", "Arabic"],
        "areaServed": ["TR", "SA", "IT", "JO", "AE", "KE"],
        "inLanguage": hl,
        "sameAs": [INSTAGRAM],
    }
    faq = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "inLanguage": hl,
        "mainEntity": [
            {"@type": "Question", "name": strip_tags(t[f"faq_q{i}"]),
             "acceptedAnswer": {"@type": "Answer", "text": strip_tags(t[f"faq_a{i}"])}}
            for i in range(1, 7) if f"faq_q{i}" in t
        ],
    }

    return f"""  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{s['desc']}">
  <meta name="keywords" content="{s['keywords']}">
  <title>{s['title']}</title>

  <meta name="google-site-verification" content="{VERIFY}" />

  <link rel="canonical" href="{canon}">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#0077B6">

  {alts}
  <link rel="alternate" hreflang="x-default" href="{DOMAIN}/">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Visit Hair Clinic">
  <meta property="og:title" content="{s['title']}">
  <meta property="og:description" content="{s['desc']}">
  <meta property="og:url" content="{canon}">
  <meta property="og:image" content="{DOMAIN}/img/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="{oglocale}">
  {og_alt}

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{s['title']}">
  <meta name="twitter:description" content="{s['desc']}">
  <meta name="twitter:image" content="{DOMAIN}/img/og-image.jpg">

  <link rel="icon" type="image/png" sizes="48x48" href="/img/logo/favicon-48.png">
  <link rel="icon" type="image/png" sizes="512x512" href="/img/logo/favicon.png">
  <link rel="apple-touch-icon" href="/img/logo/apple-touch-icon.png">

  <link rel="stylesheet" href="/css/style.css">

  <script type="application/ld+json">
{json.dumps(clinic, ensure_ascii=False, indent=2)}
  </script>

  <script type="application/ld+json">
{json.dumps(faq, ensure_ascii=False, indent=2)}
  </script>
"""


# ---------- sayfa uretimi ----------
def build_page(template_src, lang, translations):
    t = translations[lang]
    folder, hl, direction, _ = LANGS[lang]
    doc = LH.fromstring(template_src)

    # 1) html lang / dir
    doc.set("lang", hl)
    doc.set("dir", direction)
    doc.set("data-prerendered", "1")

    # 2) head'i bastan kur — ilk 3 <link>/<script> disi harici kaynaklari koru
    head = doc.head
    # Sadece harici varliklar korunur (fonts, unpkg). Eski canonical/hreflang/meta
    # bloklari atilir — yenisi build_head_html'de bastan kuruluyor.
    def is_external_asset(el):
        if el.tag == "style":
            return True
        if el.tag == "link":
            rel = " ".join(el.get("rel", "")).lower() if isinstance(el.get("rel"), list) else (el.get("rel") or "").lower()
            if rel in ("canonical", "alternate", "icon", "apple-touch-icon"):
                return False
            return el.get("href", "").startswith("http") and DOMAIN not in el.get("href", "")
        if el.tag == "script":
            return el.get("src", "").startswith("http") and DOMAIN not in el.get("src", "")
        return False

    keep = [el for el in head if is_external_asset(el)]
    for el in list(head):
        head.remove(el)
    new_head = LH.fragment_fromstring(f"<div>{build_head_html(lang, t)}</div>")
    for el in new_head:
        head.append(el)
    for el in keep:
        head.append(el)

    # 3) data-i18n metinlerini goro
    missing = []
    for el in doc.xpath("//*[@data-i18n]"):
        key = el.get("data-i18n")
        if key not in t:
            missing.append(key); continue
        val = fix_fragment_links(t[key])
        if re.search(r"<[a-z]", val, re.I):
            tail = el.tail
            frag = LH.fragment_fromstring(f"<span>{val}</span>")
            el.text = frag.text
            for ch in list(el):
                el.remove(ch)
            for ch in frag:
                el.append(ch)
            el.tail = tail
        else:
            for ch in list(el):
                el.remove(ch)
            el.text = val

    # 4) tum relatif href/src -> koke sabit
    for el in doc.xpath("//*[@href]"):
        el.set("href", absolutize(el.get("href")))
    for el in doc.xpath("//*[@src]"):
        v = el.get("src")
        if v:
            el.set("src", absolutize(v))
    # lightbox'in buyuk gorsel yolu: relatif kalirsa /tr/ /ar/ /it/ altinda
    # /tr/img/... diye 404'e gidiyor, mobilde kirik resim ikonu kaliyordu
    for el in doc.xpath("//*[@data-full]"):
        el.set("data-full", absolutize(el.get("data-full")))

    # 4b) yasal sayfa linkleri dile gore: /privacy.html -> /it/privacy.html
    for el in doc.xpath("//*[@href]"):
        h = el.get("href")
        for slug in ("privacy", "kvkk", "cookies"):
            if h == f"/{slug}.html":
                el.set("href", f"/{folder}{slug}.html")

    # 5) dil secici: buton -> gercek link (Google takip edebilsin)
    for cls in ("lang-btn", "lang-btn-sm"):
        btns = doc.xpath(f"//*[contains(concat(' ',normalize-space(@class),' '),' {cls} ')]")
        if not btns:
            continue
        parent = btns[0].getparent()
        idx = list(parent).index(btns[0])
        for b in btns:
            parent.remove(b)
        # Otomatik cevirmen "EN"/"IT" kodlarini kelime sanip ceviriyor
        # (IT -> BT, EN -> TR). notranslate + translate="no" bunu keser.
        pcls = parent.get("class", "")
        if "notranslate" not in pcls.split():
            parent.set("class", (pcls + " notranslate").strip())
        parent.set("translate", "no")
        for i, l in enumerate(LANGS):
            a = etree.SubElement(parent, "a")
            a.set("class", cls + " notranslate" + (" active" if l == lang else ""))
            a.set("href", "/" + LANGS[l][0])
            a.set("hreflang", LANGS[l][1])
            a.set("translate", "no")
            a.text = LANG_LABEL[l]
            parent.remove(a); parent.insert(idx + i, a)

    return b"<!DOCTYPE html>\n" + LH.tostring(doc, encoding="utf-8", method="html", pretty_print=False), missing


def build_main_js():
    """main.src.js'ten i18n blogunu cikarir — metin artik HTML'de gomulu."""
    src = io.open(os.path.join(HERE, "js/main.src.js"), encoding="utf-8").read().split("\n")
    start = next(i for i, l in enumerate(src) if "const translations" in l)
    end = max(i for i, l in enumerate(src) if l.strip() == "});")   # DOMContentLoaded kapanisi
    out = src[:start] + [
        "  // [gen_i18n] Ceviri blogu kaldirildi: metin sunucu tarafinda HTML'e gomuluyor.",
        "  // Dil secimi artik /tr/ /en/ /ar/ /it/ URL'leri ile yapiliyor.",
        "",
    ] + src[end:]
    io.open(os.path.join(HERE, "js/main.js"), "w", encoding="utf-8").write("\n".join(out))
    return len(src) - len(out)


def build_sitemap():
    today = date.today().isoformat()
    parts = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
             '        xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    alts = "".join(
        f'\n    <xhtml:link rel="alternate" hreflang="{LANGS[l][1]}" href="{url_for(l)}"/>'
        for l in LANGS
    ) + f'\n    <xhtml:link rel="alternate" hreflang="x-default" href="{DOMAIN}/"/>'
    for l in LANGS:
        parts.append(f'  <url>\n    <loc>{url_for(l)}</loc>\n    <lastmod>{today}</lastmod>'
                     f'\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>{alts}\n  </url>')
    for slug in ("privacy", "kvkk", "cookies"):
        legal_alts = "".join(
            f'\n    <xhtml:link rel="alternate" hreflang="{LANGS[l][1]}"'
            f' href="{DOMAIN}/{LANGS[l][0]}{slug}.html"/>' for l in LANGS)
        for l in LANGS:
            parts.append(f'  <url>\n    <loc>{DOMAIN}/{LANGS[l][0]}{slug}.html</loc>'
                         f'\n    <lastmod>{today}</lastmod>\n    <changefreq>yearly</changefreq>'
                         f'\n    <priority>0.3</priority>{legal_alts}\n  </url>')
    parts.append('</urlset>')
    io.open(os.path.join(HERE, "sitemap.xml"), "w", encoding="utf-8").write("\n".join(parts) + "\n")


def main():
    tpl = io.open(os.path.join(HERE, "_template.html"), encoding="utf-8").read()
    tr = json.load(io.open(os.path.join(HERE, "i18n/translations.json"), encoding="utf-8"))

    for lang in LANGS:
        folder = LANGS[lang][0]
        outdir = os.path.join(HERE, folder) if folder else HERE
        os.makedirs(outdir, exist_ok=True)
        content, missing = build_page(tpl, lang, tr)
        io.open(os.path.join(outdir, "index.html"), "wb").write(content)
        note = f"  EKSIK: {missing}" if missing else ""
        print(f"  {'/' + folder:8s} -> {len(content)//1024:3d} KB  ({LANGS[lang][1]}){note}")

    removed = build_main_js()
    print(f"  js/main.js  -> i18n blogu cikarildi ({removed} satir)")
    build_sitemap()
    print(f"  sitemap.xml -> {len(LANGS)} dil + 3 yasal sayfa")


if __name__ == "__main__":
    main()
