# TODO – další kolo doladění



### texty v Notionu – dokončit napojení
Texty jsou v Notion databázi Texty (viz TEXTY.md), web je zatím čte z commitnutých JSONů.
Zbývá: v Notionu připojit integraci „Orechovka“ ke stránce „Obsah webu – texty“ (⋯ → Connections)
a do GitHub Secrets přidat `NOTION_TEXTS_DATA_SOURCE_ID` = `c6eaa721-9d1b-4478-9098-a856ec55e043`.
Pak stránku „Obsah webu – texty“ přesunout tam, kde ji klient najde (teď je soukromá).

### logo - zatím nedělat

### zprovoznit formulář
Řešení: formulářová služba třetí strany (Web3Forms nebo Formspree) — formulář pošle POST
požadavek přímo na jejich endpoint, oni doručí e-mail na info@roubenkaorechovka.cz. Žádná
změna hostingu (zůstává statický export na GitHub Pages), žádný vlastní server. Nahradí
současné mailto: řešení, které na spoustě mobilů nefunguje (nemají nastavený e-mailový klient).
Čeká se na založení účtu/klíče u zvolené služby od klienta — bez toho nejde dodělat.
Až se to zapojí, potřeba i drobná úprava stránky Zpracování osobních údajů (přibude zmínka
o té službě jako příjemci údajů).
