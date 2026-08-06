# -*- coding: utf-8 -*-
"""Icerik duzeltmeleri:
  1) IT about_text1'e Istanbul eklenir (diger diller zaten iceriyor -> tutarlilik)
  2) why4 karti: "3 dilde hizmet" -> "her dilde tercuman" (4 dil)
"""
import json, io, os

PATCH = {
    "it": {
        "about_text1": "Visit Hair Clinic è una delle realtà leader in Turchia nel trapianto di capelli, con oltre 9 anni di esperienza sul campo e più di 5.000 operazioni riuscite. Nel nostro centro moderno di Istanbul accogliamo ospiti da tutto il mondo, offrendo risultati naturali e duraturi.",
        "why4_title": "Interprete in Ogni Lingua",
        "why4_text": "Supporto di un interprete nella lingua che preferisci, durante la consulenza e l'operazione",
    },
    "tr": {
        "why4_title": "Her Dilde Tercüman",
        "why4_text": "Görüşmeden operasyona kadar, talep ettiğiniz dilde tercüman desteği sağlanır",
    },
    "en": {
        "why4_title": "Interpreter in Any Language",
        "why4_text": "Interpreter support in the language you request, from consultation through operation",
    },
    "ar": {
        "why4_title": "مترجم بأي لغة",
        "why4_text": "دعم مترجم باللغة التي تطلبها، من الاستشارة حتى إجراء العملية",
    },
}

HERE = os.path.dirname(os.path.abspath(__file__))
path = os.path.join(HERE, "translations.json")
t = json.load(io.open(path, encoding="utf-8"))

for lang, kv in PATCH.items():
    for k, v in kv.items():
        assert k in t[lang], f"{lang}/{k} yok"
        t[lang][k] = v
        print(f"  {lang}/{k:12s} -> {v[:60]}")

json.dump(t, io.open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print("OK ->", path)
