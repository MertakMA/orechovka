// Dočasné ilustrační fotky přes Wikimedia Commons (Special:FilePath je stabilní
// přímý odkaz na soubor), dokud klient nedodá vlastní fotky míst z TIPS/SEASON
// dat. Commons obsah je pod CC licencemi vyžadujícími atribuci autora – před
// ostrým nasazením nahradit reálnými fotkami nebo doplnit atribuci.
export function commonsFile(fileName: string, width = 700): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=${width}`;
}
