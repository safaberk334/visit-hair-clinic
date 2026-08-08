# -*- coding: utf-8 -*-
"""translations.json'a Italyanca dilini ekler. Terminoloji Italyan sac ekimi
pazarina gore secildi (trapianto di capelli / innesti / attaccatura)."""
import json, io, os

IT = {
 # nav
 "nav_about":"Chi Siamo","nav_services":"Servizi","nav_journey":"Percorso","nav_results":"Risultati",
 "nav_whyus":"Perché Noi","nav_tourism":"Turismo Medico","nav_contact":"Contatti",
 # hero
 "hero_badge":"Il centro di trapianto capelli di fiducia in Turchia",
 "hero_title1":"I Tuoi Nuovi Capelli,","hero_title2":"La Tua Nuova Vita.",
 "hero_subtitle":"Con 9 anni di esperienza e oltre 5.000 operazioni riuscite, offriamo risultati naturali e duraturi.",
 "hero_cta1":"Consulenza Gratuita",
 "stat_years":"Anni di Esperienza","stat_ops":"Operazioni Riuscite","stat_countries":"Paesi","stat_satisfaction":"Soddisfazione",
 # about
 "about_label":"CHI SIAMO",
 "about_title":"La <span class=\"text-accent\">Clinica di Trapianto Capelli</span> di Fiducia in Turchia",
 "about_text1":"Visit Hair Clinic è una delle realtà leader in Turchia nel trapianto di capelli, con oltre 9 anni di esperienza sul campo e più di 5.000 operazioni riuscite. Accogliamo ospiti da tutto il mondo, offrendo risultati naturali e duraturi.",
 "about_text2":"Con le tecniche più avanzate — FUE, DHI e FUE Zaffiro — offriamo un design personalizzato dell'attaccatura, un team di esperti e un'esperienza pianificata dall'inizio alla fine. Sotto la guida di Sedat Kuren, igiene, fiducia ed estetica sono sempre la nostra priorità.",
 "about_badge":"Anni di Esperienza",
 "about_f1_title":"Clinica Moderna e Igiene","about_f1_text":"Standard di sala operatoria sterile",
 "about_f2_title":"Team Medico Esperto","about_f2_text":"Personale sanitario qualificato",
 "about_f3_title":"Oltre 5.000 Operazioni","about_f3_text":"Pazienti soddisfatti da oltre 7 paesi",
 "about_f4_title":"Design Personalizzato","about_f4_text":"Attaccatura naturale garantita",
 # services
 "services_label":"I NOSTRI SERVIZI",
 "services_title":"Trattamenti in cui <span class=\"text-accent\">Siamo Specializzati</span>",
 "services_desc":"Offriamo soluzioni personalizzate con le tecnologie e le tecniche più avanzate.",
 "srv_fue_title":"Trapianto Capelli FUE",
 "srv_fue_text":"Con il metodo Follicular Unit Extraction si ottengono risultati naturali senza cicatrici. È la tecnica più richiesta.",
 "srv_popular":"Più Richiesto",
 "srv_dhi_title":"Trapianto Capelli DHI",
 "srv_dhi_text":"L'apertura dei canali e l'impianto avvengono simultaneamente con la penna Choi, per risultati più densi e naturali.",
 "srv_premium":"Premium",
 "srv_sapphire_title":"FUE Zaffiro",
 "srv_sapphire_text":"I microcanali vengono aperti con lame in zaffiro, garantendo una guarigione più rapida e danni minimi ai tessuti.",
 "srv_advanced":"Avanzato",
 "srv_beard_title":"Trapianto Barba e Baffi",
 "srv_beard_text":"Trapianto di barba e baffi dall'aspetto naturale nelle zone rade o vuote, con risultati permanenti.",
 "srv_eyebrow_title":"Trapianto Sopracciglia",
 "srv_eyebrow_text":"I follicoli vengono impiantati uno a uno seguendo la forma naturale del sopracciglio — risultati estetici che completano l'espressione del viso.",
 "srv_prp_title":"PRP e Mesoterapia",
 "srv_prp_text":"Trattamenti di supporto che fermano la caduta e rinforzano i capelli esistenti, applicati prima e dopo l'operazione.",
 # journey
 "journey_label":"PERCORSO",
 "journey_title":"Il Tuo <span class=\"text-accent\">Percorso</span> da Paziente",
 "journey_desc":"Siamo al tuo fianco a ogni passo — dalla prima consulenza al risultato finale.",
 "step1_title":"Consulenza Online",
 "step1_text":"Inviaci le tue foto e prepareremo un'analisi gratuita e un piano di trattamento personalizzato.",
 "step2_title":"Arrivo e Accoglienza",
 "step2_text":"Transfer VIP dall'aeroporto e soggiorno in hotel a 5 stelle già pronti. Ti accogliamo all'arrivo.",
 "step3_title":"Design dell'Attaccatura",
 "step3_text":"Progettiamo insieme un'attaccatura naturale, adatta alla struttura del tuo viso.",
 "step4_title":"L'Operazione",
 "step4_text":"Un'operazione confortevole di 6-8 ore in anestesia locale. Indolore e sicura.",
 "step5_title":"Risultato e Controlli",
 "step5_text":"Follow-up e controlli online per 12 mesi. Goditi i tuoi risultati naturali.",
 # results
 "results_label":"I NOSTRI RISULTATI",
 "results_title":"Pazienti Veri, <span class=\"text-accent\">Risultati Veri</span>",
 "results_desc":"Scopri i risultati delle nostre operazioni con le foto prima e dopo.",
 "case1_detail":"Caso #1 — Uomo, Zona Frontale",
 "case2_detail":"Caso #2 — Donna, Attaccatura",
 "case3_detail":"Caso #3 — Uomo, Zona Frontale",
 "case4_detail":"Caso #4 — Uomo, Zona del Vertice",
 "case5_detail":"Caso #5 — Uomo, Zona Frontale",
 "case6_detail":"Caso #6 — Uomo, Zona Frontale",
 # why us
 "whyus_label":"PERCHÉ NOI",
 "whyus_title":"Perché Scegliere <span class=\"text-accent\">Visit Hair Clinic</span>",
 "why1_title":"Attaccatura Personalizzata",
 "why1_text":"Un'attaccatura dall'aspetto naturale, progettata sulla struttura del viso di ogni paziente",
 "why2_title":"Tecnologia Avanzata",
 "why2_text":"FUE, DHI, FUE Zaffiro — le tecniche e le attrezzature più aggiornate del settore",
 "why3_title":"Follow-up di 12 Mesi",
 "why3_text":"Controlli online regolari e assistenza per 12 mesi dopo l'operazione",
 "why4_title":"Assistenza in 3 Lingue",
 "why4_text":"Comunicazione e supporto in turco, inglese e arabo",
 "why5_title":"Team Medico Esperto",
 "why5_text":"Operazioni sicure e professionali con medici specialisti partner",
 "why6_title":"98% di Soddisfazione",
 "why6_text":"Oltre 5.000 pazienti soddisfatti e garanzia di risultato naturale",
 # health tourism
 "tourism_label":"TURISMO MEDICO",
 "tourism_title":"Trapianto Capelli in Turchia <span class=\"text-accent\">Tutto Incluso</span>",
 "tourism_text":"Offriamo pacchetti tutto incluso ai nostri pazienti internazionali. Ogni dettaglio è pianificato per te, dall'arrivo in aeroporto alla partenza.",
 "tour_f1":"Transfer VIP dall'Aeroporto","tour_f2":"Soggiorno in Hotel 5 Stelle",
 "tour_f3":"Operazione e Tutti i Materiali","tour_f4":"Farmaci e Kit di Cura",
 "tour_f5":"Servizio di Interprete","tour_f6":"Follow-up Online di 12 Mesi",
 "tour_cta":"Richiedi un Preventivo Gratuito",
 "tour_countries_title":"Paesi che Serviamo","tour_map_text":"Accogliamo pazienti da tutto il mondo",
 "country_sa":"Arabia Saudita","country_it":"Italia","country_jo":"Giordania","country_ae":"Emirati Arabi Uniti",
 # testimonials
 "test_label":"TESTIMONIANZE",
 "test_title":"Cosa Dicono i <span class=\"text-accent\">Nostri Pazienti</span>",
 "test1_text":"«È stata un'esperienza professionale dall'inizio alla fine. Sono molto soddisfatto dei risultati. Il signor Sedat e il suo team hanno fatto un lavoro eccellente.»",
 "test2_text":"«Sono venuto dall'Italia per l'intervento. Tutto era organizzato alla perfezione — hotel, transfer e l'operazione stessa. I risultati hanno superato le mie aspettative.»",
 "test3_text":"«Un'esperienza meravigliosa dall'inizio alla fine. I risultati sono molto naturali e il team è professionale. Consiglio vivamente questa clinica.»",
 # contact
 "contact_label":"CONTATTI",
 "contact_title":"Consulenza <span class=\"text-accent\">Gratuita</span>",
 "contact_text":"Lascia che analizziamo la tua situazione e creiamo un piano di trattamento personalizzato. Inviaci le tue foto e ti risponderemo entro 24 ore.",
 "contact_wa_text":"Risposta rapida",
 "contact_hours_title":"Orari di Lavoro","contact_hours_text":"24/7 — Sempre raggiungibili",
 "form_name":"Nome e Cognome","form_email":"Email","form_phone":"Telefono","form_country":"Paese",
 "form_country_select":"Seleziona","form_country_other":"Altro",
 "form_message":"Il Tuo Messaggio","form_submit":"Invia",
 # footer
 "footer_tagline":"I tuoi nuovi capelli, la tua nuova vita.",
 "footer_quick":"Link Rapidi","footer_services":"I Nostri Servizi","footer_contact":"Contatti",
 "footer_rights":"Tutti i diritti riservati.",
 "footer_privacy":"Informativa sulla Privacy","footer_kvkk":"Informativa KVKK","footer_cookies":"Politica sui Cookie",
 # cookies
 "cookie_text":"Questo sito utilizza i cookie per migliorare la tua esperienza. Continuando a navigare accetti la nostra <a href=\"/it/privacy.html\">Informativa sulla Privacy</a> e l'<a href=\"/it/kvkk.html\">Informativa KVKK</a>.",
 "cookie_accept":"Accetta","cookie_decline":"Rifiuta",
 # faq
 "faq_label":"DOMANDE FREQUENTI",
 "faq_title":"Risposte alle Tue <span class=\"text-accent\">Domande</span>",
 "faq_desc":"Abbiamo risposto alle domande più comuni sul trapianto di capelli.",
 "faq_q1":"Il trapianto di capelli è doloroso?",
 "faq_a1":"L'intervento viene eseguito in anestesia locale, quindi non sentirai dolore durante l'operazione. L'eventuale lieve fastidio successivo si gestisce facilmente con gli antidolorifici prescritti.",
 "faq_q2":"Quanto dura e quanti innesti servono?",
 "faq_a2":"L'operazione dura solitamente 6-8 ore e si completa in un'unica seduta. Il numero di innesti dipende dal grado di calvizie e dalla densità desiderata; durante la consulenza gratuita creiamo un piano preciso sulla base delle tue foto.",
 "faq_q3":"Qual è la differenza tra FUE, DHI e FUE Zaffiro?",
 "faq_a3":"Sono tutte e tre tecniche moderne e senza punti di sutura. Nella FUE gli innesti vengono prelevati uno a uno; la FUE Zaffiro usa lame in zaffiro per una guarigione più rapida; la DHI impianta gli innesti direttamente con una penna speciale, per un'attaccatura densa e naturale. Il nostro specialista sceglie il metodo più adatto a te.",
 "faq_q4":"I capelli trapiantati sono permanenti?",
 "faq_a4":"Sì. I capelli trapiantati vengono prelevati da un'area geneticamente resistente alla caduta, quindi sono permanenti e crescono per tutta la vita. Lo «shock loss» delle prime settimane è normale: questi capelli ricrescono in modo permanente entro 3-4 mesi.",
 "faq_q5":"Com'è il recupero e quando posso tornare al lavoro?",
 "faq_a5":"La maggior parte dei pazienti torna alla vita quotidiana in 2-3 giorni. Nei primi 10 giorni è importante proteggere l'area trapiantata. Le crosticine scompaiono in circa 10 giorni e il risultato definitivo e naturale si manifesta pienamente entro 12 mesi.",
 "faq_q6":"Come funziona il percorso per i pazienti internazionali?",
 "faq_a6":"Per i nostri ospiti internazionali pianifichiamo tutto dall'inizio alla fine: transfer dall'aeroporto, alloggio e operazione. Inviaci le tue foto su WhatsApp e costruiremo insieme un piano di trattamento e di viaggio personalizzato.",
}

HERE = os.path.dirname(os.path.abspath(__file__))
path = os.path.join(HERE, "translations.json")
with io.open(path, encoding="utf-8") as f:
    t = json.load(f)

ref = set(t["en"].keys())
missing, extra = ref - set(IT), set(IT) - ref
if missing: print("EKSIK anahtar:", sorted(missing))
if extra:   print("FAZLA anahtar:", sorted(extra))

t["it"] = {k: IT[k] for k in t["en"]}   # anahtar sirasi en ile ayni
with io.open(path, "w", encoding="utf-8") as f:
    json.dump(t, f, ensure_ascii=False, indent=2)
print("OK ->", path, "| diller:", ", ".join(t.keys()), "| anahtar:", len(t["it"]))
