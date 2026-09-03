# TODO – další kolo doladění

- [x] **Stats lišta pod Hero** – text zvětšen (12→14px hodnoty, 9→11px popisky), odlehčeny paddingy/mezery, ať výška lišty zůstává prakticky stejná
- [x] **Carousel v sekci O nás** – fotky teď jedou ve 3 kopiích za sebou (polštář na obě strany), takže smyčka funguje plynule i doleva, ne jen doprava
- [x] **CTA tlačítko "Rezervovat pobyt" na mobilu** – menší text/padding na mobilu, šipka spojená s předchozím slovem nedělitelnou mezerou, takže nikdy nespadne sama na druhý řádek
- [x] **Footer** – věta "Útulná roubenka pro vaši dovolenou v krásné přírodě." odstraněna
- [x] **Mobilní menu (hamburger)** – při otevření se zamkne scroll na `body`, po zavření/kliknutí na odkaz se zase odemkne
- [x] **Navbar na mobilu** – lišta i logo mírně zmenšené pod `sm` (h-24→h-20, logo h-28→h-20), od `sm` výš beze změny
- [x] **Navbar/Footer odkazy na kotvy ("Tipy na výlety", "Počasí", "O nás")** – oprava: next/link hash-only navigaci na stejné stránce potichu ignoruje, takže se teď doscrolluje ručně (src/lib/hashNav.ts) kdykoliv je uživatel už na cílové stránce
