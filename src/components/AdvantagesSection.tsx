"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { withBasePath } from "@/lib/basePath";
import { Baby, BedDouble, BedSingle, CookingPot, Layers, ShowerHead, Sofa, WashingMachine, type LucideIcon } from "lucide-react";
import { texty, type Locale, type Texty } from "@/lib/texty";
import { ikona } from "@/lib/ikony";

type Room = { Icon: LucideIcon; name: string; detail: string; beds?: number };
type Floor = { label: string | null; rooms: Room[] };
type Group = { title: string; Icon: LucideIcon; items: { Icon: LucideIcon; label: string }[] };

// Tvary slova v Notionu: "lůžko | lůžka | lůžek" (1 / 2–4 / 5 a víc).
// Angličtina má jen dva tvary, třetí je tam stejný jako druhý.
function plural(n: number, forms: string) {
  const [one, few = one, many = few] = forms.split("|").map((f) => f.trim());
  if (n === 1) return one;
  return n >= 2 && n <= 4 ? few : many;
}

// Počty lůžek a ikony pokojů jsou v kódu (z nich se počítá souhrn), texty
// pokojů i vybavení žijí v Notionu na stránce Úvod.
const FLOORS: { labelId: string; rooms: { id: string; Icon: LucideIcon; beds?: number }[] }[] = [
  {
    labelId: "vyhody.prizemi",
    rooms: [
      { id: "vyhody.pokoj.prizemi-dvoulozkovy", Icon: BedDouble, beds: 2 },
      { id: "vyhody.pokoj.prizemi-koupelna", Icon: ShowerHead },
    ],
  },
  {
    labelId: "vyhody.patro",
    rooms: [
      { id: "vyhody.pokoj.patro-dvoulozkovy", Icon: BedDouble, beds: 2 },
      { id: "vyhody.pokoj.patro-ctyrlozkovy", Icon: BedDouble, beds: 4 },
      { id: "vyhody.pokoj.patro-sestilozkovy", Icon: BedSingle, beds: 6 },
      { id: "vyhody.pokoj.patro-koupelna", Icon: ShowerHead },
    ],
  },
];

const GROUPS: { id: string; Icon: LucideIcon }[] = [
  { id: "vyhody.svetnice", Icon: Sofa },
  { id: "vyhody.kuchyn", Icon: CookingPot },
  { id: "vyhody.deti", Icon: Baby },
  { id: "vyhody.ostatni", Icon: WashingMachine },
];

function buildFloors(u: Texty): Floor[] {
  return FLOORS.flatMap((floor) => {
    const rooms = floor.rooms.flatMap(({ id, Icon, beds }) => {
      const room = u.polozka(id);
      return room ? [{ Icon, beds, name: room.t, detail: room.p ?? "" }] : [];
    });
    return rooms.length > 0 ? [{ label: u.t(floor.labelId), rooms }] : [];
  });
}

function buildGroups(u: Texty): Group[] {
  return GROUPS.flatMap(({ id, Icon }) => {
    const title = u.t(`${id}.nazev`);
    const items = u.seznam(id).map((item) => ({ Icon: ikona(item.i), label: item.t }));
    return title && items.length > 0 ? [{ title, Icon, items }] : [];
  });
}

function RoomCard({ room, bedsPill }: { room: Room; bedsPill: string | null }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-border bg-cream p-3 transition-colors hover:border-brand/45">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-pec-light text-pec-dark">
        <room.Icon className="size-[17px]" strokeWidth={1.75} aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[13.5px] font-semibold leading-snug text-ink">{room.name}</p>
          {bedsPill && (
            <span className="shrink-0 whitespace-nowrap rounded-full bg-brand/12 px-1.5 py-[2px] text-[10.5px] font-bold text-brand">
              {bedsPill}
            </span>
          )}
        </div>
        <div className="mt-0.5 flex flex-col gap-0.5">
          {room.detail.split("\n").map((line) => (
            <p key={line} className="text-[15px] font-medium leading-[1.4] text-clay">
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

// Oba bloky mají stejně vysokou hlavičku, takže si v dvousloupcovém
// rozvržení karty pod nimi sednou na stejnou linku.
function BlockHeading({ title, note }: { title: string | null; note: string | null }) {
  return (
    <div>
      {title && <h3 className="font-subhead text-[19px] font-bold text-ink sm:text-[21px]">{title}</h3>}
      {note && <p className="mt-0.5 text-[12.5px] font-medium text-clay">{note}</p>}
    </div>
  );
}

export default function AdvantagesSection({ locale = "cs" }: { locale?: Locale }) {
  const u = texty("uvod", locale);
  if (!u.sekce("vyhody")) return null;

  const eyebrow = u.t("vyhody.nadtitulek");
  const heading = u.t("vyhody.nadpis");
  const intro = u.seznam("vyhody.uvod");
  const floors = buildFloors(u);
  const groups = buildGroups(u);
  const extras = u.seznam("vyhody.extra").map((item) => ({ Icon: ikona(item.i), label: item.t }));
  const bedsForms = u.vzdy("vyhody.tvary.luzka");

  const allRooms = floors.flatMap((f) => f.rooms);
  const bedCount = allRooms.reduce((n, r) => n + (r.beds ?? 0), 0);
  const bathCount = allRooms.filter((r) => r.beds === undefined).length;

  const summary = [
    { Icon: BedDouble, label: `${bedCount} ${plural(bedCount, bedsForms)}` },
    { Icon: ShowerHead, label: `${bathCount} ${plural(bathCount, u.vzdy("vyhody.tvary.koupelny"))}` },
    { Icon: Layers, label: `${floors.length} ${plural(floors.length, u.vzdy("vyhody.tvary.podlazi"))}` },
  ];

  return (
    <section id="vyhody" className="bg-sand px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px] lg:py-[112px]">
      <div className="mx-auto max-w-[1440px]">
        {/* Na desktopu vedle úvodního textu zbývalo prázdné místo — vyplňuje ho
            fotka kachlové pece, o které úvodní text mluví jako o srdci chalupy.
            Na mobilu by jen odsunula pokoje níž, proto je jen od lg. */}
        <div className="lg:flex lg:items-stretch lg:justify-between lg:gap-10 xl:gap-16">
          <div className="min-w-0">
            {eyebrow && (
              <div className="flex flex-col gap-[5px]">
                <p className="text-gradient text-[13px] font-semibold tracking-[2px]">{eyebrow}</p>
                <div className="h-[2px] w-7 bg-brand-gradient" />
              </div>
            )}
            {heading && <h2 className="mt-3 font-serif text-[28px] font-bold text-ink sm:text-[34px] lg:text-[40px]">{heading}</h2>}

            {intro.length > 0 && (
              <div className="mt-5 flex max-w-[720px] flex-col gap-3 text-[15px] font-medium leading-[1.65] text-clay sm:text-[16px]">
                {intro.map((p) => (
                  <p key={p.t}>{p.t}</p>
                ))}
              </div>
            )}
          </div>

          {u.sekce("vyhody.foto") && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              className="relative hidden min-h-[240px] w-[300px] shrink-0 overflow-hidden rounded-xl border border-border shadow-[0px_8px_24px_0px_rgba(34,25,16,0.07)] lg:block xl:w-[420px]"
            >
              <Image
                src={withBasePath("/images/adv-krb.jpg")}
                alt={texty("spolecne", locale).vzdy("foto.adv-krb")}
                fill
                sizes="(min-width: 1280px) 420px, 300px"
                className="object-cover object-[50%_42%]"
              />
            </motion.div>
          )}
        </div>

        {/* Pokoje a vybavení stojí vedle sebe — pod sebou by se každý blok
            roztáhl přes celou šířku stránky a sekce by byla dvakrát vyšší. */}
        <div className="mt-9 grid gap-5 lg:mt-12 lg:grid-cols-2 lg:gap-6">
          {/* Řez roubenkou: patra jdou shora dolů tak, jak ve skutečnosti leží,
              takže rozložení lůžek se dá přečíst jedním pohledem. */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <BlockHeading title={u.t("vyhody.pokoje.nadpis")} note={u.t("vyhody.pokoje.poznamka")} />

            <div className="mt-4">
              <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-[0px_8px_24px_0px_rgba(34,25,16,0.07)]">
                {u.sekce("vyhody.souhrn") && (
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-b border-border bg-cream/70 px-4 py-2.5 sm:px-5">
                    {summary.map((s) => (
                      <span key={s.label} className="flex items-center gap-1.5 text-[12.5px] font-bold text-ink">
                        <s.Icon className="size-[15px] shrink-0 text-brand" strokeWidth={2} aria-hidden />
                        {s.label}
                      </span>
                    ))}
                  </div>
                )}

                {floors.map((floor, i) => (
                  <div
                    key={i}
                    className={`px-4 py-4 sm:px-5 ${i > 0 ? "border-t-[1.5px] border-dashed border-border" : ""}`}
                  >
                    {floor.label && (
                      <span className="inline-block rounded-full bg-tag/60 px-2.5 py-[3px] text-[10.5px] font-bold uppercase tracking-[1.2px] text-bark">
                        {floor.label}
                      </span>
                    )}
                    <div className={`${floor.label ? "mt-2.5 " : ""}grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1`}>
                      {floor.rooms.map((room) => (
                        <RoomCard
                          key={`${room.name}-${room.detail}`}
                          room={room}
                          bedsPill={room.beds ? `${room.beds} ${plural(room.beds, bedsForms)}` : null}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Vybavení po štítcích — dřív to byly tři dlouhé věty oddělené
              čárkami, což se nedalo přelétnout očima. */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="flex flex-col"
          >
            <BlockHeading title={u.t("vyhody.vybaveni.nadpis")} note={u.t("vyhody.vybaveni.poznamka")} />

            <div className="mt-4 flex flex-1 flex-col">
              <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-[0px_8px_24px_0px_rgba(34,25,16,0.07)]">
                {groups.map((group, i) => (
                  <div
                    key={group.title}
                    className={`px-4 py-4 sm:px-5 ${i > 0 ? "border-t-[1.5px] border-dashed border-border" : ""}`}
                  >
                    <div className="flex items-center gap-1.5">
                      <group.Icon className="size-[15px] shrink-0 text-brand" strokeWidth={2} aria-hidden />
                      <p className="text-[11px] font-bold uppercase tracking-[1.1px] text-bark">{group.title}</p>
                    </div>
                    <ul className="mt-2.5 flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <li
                          key={item.label}
                          className="flex items-center gap-1.5 rounded-lg border border-border bg-cream px-2 py-1.5 text-[12px] font-semibold text-ink"
                        >
                          <item.Icon className="size-[14px] shrink-0 text-pec-dark" strokeWidth={1.9} aria-hidden />
                          {item.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {extras.length > 0 && (
                <div className="mt-4 flex flex-col gap-2.5 rounded-xl border border-brand/20 bg-tag/40 px-4 py-3.5 sm:px-5">
                  {extras.map((extra) => (
                    <div key={extra.label} className="flex items-center gap-2">
                      <extra.Icon className="size-[17px] shrink-0 text-brand" strokeWidth={1.9} aria-hidden />
                      <span className="text-[13px] font-semibold text-ink">{extra.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
