"use client";

import { motion } from "framer-motion";
import {
  Baby,
  BedDouble,
  BedSingle,
  Bike,
  Coffee,
  CookingPot,
  Fan,
  Flame,
  Footprints,
  Layers,
  Microwave,
  Refrigerator,
  Sandwich,
  Shirt,
  ShowerHead,
  Soup,
  SquareParking,
  Toilet,
  Utensils,
  WashingMachine,
  Wifi,
  Wind,
} from "lucide-react";

type Locale = "cs" | "en";
type Icon = typeof BedDouble;

type Room = { Icon: Icon; name: string; detail: string; beds?: number };
type Floor = { label: string; rooms: Room[] };
type Group = { title: string; Icon: Icon; items: { Icon: Icon; label: string }[] };

// Čeština má tři tvary množného čísla (1 / 2–4 / 5 a víc), angličtina dva.
type Forms = readonly [one: string, few: string, many: string];

function plural(locale: Locale, n: number, forms: Forms) {
  const [one, few, many] = forms;
  if (n === 1) return one;
  if (locale === "en") return many;
  return n < 5 ? few : many;
}

const TEXT = {
  cs: {
    eyebrow: "O ROUBENCE",
    heading: "Co roubenka nabízí",
    intro: [
      "Ořechovka je nově postavená tradiční roubenka s veškerým komfortem dnešní doby — ideální pro rodinnou dovolenou i pobyt s přáteli až pro 10 osob.",
      "V přízemí vás čeká prostorná světnice s velkým dřevěným stolem a kachlovou pecí, srdcem celé chalupy. Zahrada s terasou pak zve k posezení pod vzrostlým ořechem i večernímu opékání na ohništi.",
    ],
    roomsTitle: "Pokoje a koupelny",
    roomsNote: "Připraveny včetně ložního prádla a osušek.",
    equipmentTitle: "Vybavení",
    equipmentNote: "Kompletně vybavená kuchyň i domácnost.",
    floors: { ground: "Přízemí", upper: "Patro" },
    rooms: {
      double: "Dvoulůžkový pokoj",
      doubleDetail: "manželská postel",
      quad: "Čtyřlůžkový pokoj",
      quadDetail: "manželská postel + 2 lůžka, hambálka pro 2",
      bathGround: "Koupelna",
      bathGroundDetail: "sprchový kout a WC",
      bathUpper: "Koupelna",
      bathUpperDetail: "sprchový kout, samostatné WC",
    },
    summary: { beds: ["lůžko", "lůžka", "lůžek"], baths: ["koupelna", "koupelny", "koupelen"], floors: ["podlaží", "podlaží", "podlaží"] },
    bedsPill: ["lůžko", "lůžka", "lůžek"],
    groups: { kitchen: "Kuchyň", kids: "Pro děti", other: "Ostatní vybavení" },
    items: {
      dishwasher: "Myčka na nádobí",
      coffee: "Kávovar",
      microwave: "Mikrovlnná trouba",
      toaster: "Topinkovač",
      kettle: "Varná konvice",
      fridge: "Lednice s mrazákem",
      oven: "Horkovzdušná trouba",
      hob: "Indukční deska",
      highChair: "Jídelní židlička",
      crib: "Dětská postýlka",
      potty: "Nočník a WC prkénko",
      washer: "Pračka",
      dryer: "Sušička",
      hairdryer: "Fén",
      iron: "Žehlička",
      bootDryer: "Sušák na lyžařské boty",
    },
    extras: {
      storage: "Uzamykatelná kolárna a lyžárna",
      wifi: "Wifi připojení a smart TV",
      parking: "Parkování zdarma",
    },
  },
  en: {
    eyebrow: "ABOUT THE CABIN",
    heading: "What the cabin offers",
    intro: [
      "Ořechovka is a newly built traditional log cabin with all the comforts of today — ideal for a family holiday or a stay with friends, sleeping up to 10.",
      "On the ground floor you'll find a spacious living room with a large wooden dining table and a tiled stove, the heart of the whole cabin. The garden with a terrace invites you to sit outside under the old walnut tree or grill in the evening at the outdoor fire pit.",
    ],
    roomsTitle: "Rooms and bathrooms",
    roomsNote: "Ready with bed linen and towels included.",
    equipmentTitle: "Amenities",
    equipmentNote: "A fully equipped kitchen and household.",
    floors: { ground: "Ground floor", upper: "Upper floor" },
    rooms: {
      double: "Double room",
      doubleDetail: "one double bed",
      quad: "Four-bed room",
      quadDetail: "double bed + 2 singles, loft sleeping 2",
      bathGround: "Bathroom",
      bathGroundDetail: "shower and WC",
      bathUpper: "Bathroom",
      bathUpperDetail: "shower, separate WC",
    },
    summary: { beds: ["bed", "beds", "beds"], baths: ["bathroom", "bathrooms", "bathrooms"], floors: ["floor", "floors", "floors"] },
    bedsPill: ["bed", "beds", "beds"],
    groups: { kitchen: "Kitchen", kids: "For kids", other: "Other equipment" },
    items: {
      dishwasher: "Dishwasher",
      coffee: "Coffee maker",
      microwave: "Microwave",
      toaster: "Toaster",
      kettle: "Kettle",
      fridge: "Fridge-freezer",
      oven: "Convection oven",
      hob: "Induction hob",
      highChair: "High chair",
      crib: "Crib",
      potty: "Potty and toilet seat",
      washer: "Washing machine",
      dryer: "Dryer",
      hairdryer: "Hairdryer",
      iron: "Iron",
      bootDryer: "Ski-boot dryer",
    },
    extras: {
      storage: "Lockable bike and ski storage",
      wifi: "Wifi and a smart TV",
      parking: "Free parking",
    },
  },
} as const;

// Ikony a struktura jsou společné pro oba jazyky, mění se jen texty — díky
// tomu nemůže anglická a česká verze "ujet" jedna druhé.
function buildFloors(locale: Locale): Floor[] {
  const r = TEXT[locale].rooms;
  const f = TEXT[locale].floors;
  return [
    {
      label: f.upper,
      rooms: [
        { Icon: BedDouble, name: r.double, detail: r.doubleDetail, beds: 2 },
        { Icon: BedSingle, name: r.quad, detail: r.quadDetail, beds: 6 },
        { Icon: ShowerHead, name: r.bathUpper, detail: r.bathUpperDetail },
      ],
    },
    {
      label: f.ground,
      rooms: [
        { Icon: BedDouble, name: r.double, detail: r.doubleDetail, beds: 2 },
        { Icon: ShowerHead, name: r.bathGround, detail: r.bathGroundDetail },
      ],
    },
  ];
}

function buildGroups(locale: Locale): Group[] {
  const g = TEXT[locale].groups;
  const i = TEXT[locale].items;
  return [
    {
      title: g.kitchen,
      Icon: CookingPot,
      items: [
        { Icon: Utensils, label: i.dishwasher },
        { Icon: Refrigerator, label: i.fridge },
        { Icon: Flame, label: i.oven },
        { Icon: CookingPot, label: i.hob },
        { Icon: Microwave, label: i.microwave },
        { Icon: Coffee, label: i.coffee },
        { Icon: Soup, label: i.kettle },
        { Icon: Sandwich, label: i.toaster },
      ],
    },
    {
      title: g.kids,
      Icon: Baby,
      items: [
        { Icon: Baby, label: i.highChair },
        { Icon: BedSingle, label: i.crib },
        { Icon: Toilet, label: i.potty },
      ],
    },
    {
      title: g.other,
      Icon: WashingMachine,
      items: [
        { Icon: WashingMachine, label: i.washer },
        { Icon: Fan, label: i.dryer },
        { Icon: Wind, label: i.hairdryer },
        { Icon: Shirt, label: i.iron },
        { Icon: Footprints, label: i.bootDryer },
      ],
    },
  ];
}

function buildExtras(locale: Locale) {
  const e = TEXT[locale].extras;
  return [
    { Icon: Bike, label: e.storage },
    { Icon: Wifi, label: e.wifi },
    { Icon: SquareParking, label: e.parking },
  ];
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
        <p className="mt-0.5 text-[15px] font-medium leading-[1.4] text-clay">{room.detail}</p>
      </div>
    </div>
  );
}

// Výška střechy nad kartou s pokoji. Pravý sloupec o ni musí být odsazený,
// aby jeho karta začínala na stejné lince jako obdélník pod střechou —
// proto je to konstanta a ne dvě nezávislá čísla.
const ROOF_H = "h-9 sm:h-12 lg:h-14";

// Oba bloky mají stejně vysokou hlavičku, takže si v dvousloupcovém
// rozvržení karty pod nimi sednou na stejnou linku.
function BlockHeading({ title, note }: { title: string; note: string }) {
  return (
    <div>
      <h3 className="font-subhead text-[19px] font-bold text-ink sm:text-[21px]">{title}</h3>
      <p className="mt-0.5 text-[12.5px] font-medium text-clay">{note}</p>
    </div>
  );
}

export default function AdvantagesSection({ locale = "cs" }: { locale?: Locale }) {
  const t = TEXT[locale];
  const floors = buildFloors(locale);
  const groups = buildGroups(locale);
  const extras = buildExtras(locale);

  const allRooms = floors.flatMap((f) => f.rooms);
  const bedCount = allRooms.reduce((n, r) => n + (r.beds ?? 0), 0);
  const bathCount = allRooms.filter((r) => r.beds === undefined).length;

  const summary = [
    { Icon: BedDouble, label: `${bedCount} ${plural(locale, bedCount, t.summary.beds)}` },
    { Icon: ShowerHead, label: `${bathCount} ${plural(locale, bathCount, t.summary.baths)}` },
    { Icon: Layers, label: `${floors.length} ${plural(locale, floors.length, t.summary.floors)}` },
  ];

  return (
    <section id="vyhody" className="bg-sand px-6 py-16 sm:px-10 sm:py-20 lg:px-[100px] lg:py-[112px]">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-[5px]">
          <p className="text-gradient text-[13px] font-semibold tracking-[2px]">{t.eyebrow}</p>
          <div className="h-[2px] w-7 bg-brand-gradient" />
        </div>
        <h2 className="mt-3 font-serif text-[28px] font-bold text-ink sm:text-[34px] lg:text-[40px]">{t.heading}</h2>

        <div className="mt-5 flex max-w-[720px] flex-col gap-3 text-[15px] font-medium leading-[1.65] text-clay sm:text-[16px]">
          {t.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
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
            <BlockHeading title={t.roomsTitle} note={t.roomsNote} />

            <div className="mt-4">
              {/* Přesah do stran dělá okap — bez něj střecha vypadala jen jako
                  tmavý klín položený na kartě. */}
              

              <div className="overflow-hidden rounded-b-xl border border-t-0 border-border bg-surface shadow-[0px_8px_24px_0px_rgba(34,25,16,0.07)]">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-b border-border bg-cream/70 px-4 py-2.5 sm:px-5">
                  {summary.map((s) => (
                    <span key={s.label} className="flex items-center gap-1.5 text-[12.5px] font-bold text-ink">
                      <s.Icon className="size-[15px] shrink-0 text-brand" strokeWidth={2} aria-hidden />
                      {s.label}
                    </span>
                  ))}
                </div>

                {floors.map((floor, i) => (
                  <div
                    key={floor.label}
                    className={`px-4 py-4 sm:px-5 ${i > 0 ? "border-t-[1.5px] border-dashed border-border" : ""}`}
                  >
                    <span className="inline-block rounded-full bg-tag/60 px-2.5 py-[3px] text-[10.5px] font-bold uppercase tracking-[1.2px] text-bark">
                      {floor.label}
                    </span>
                    <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
                      {floor.rooms.map((room) => (
                        <RoomCard
                          key={`${floor.label}-${room.name}-${room.detail}`}
                          room={room}
                          bedsPill={room.beds ? `${room.beds} ${plural(locale, room.beds, t.bedsPill)}` : null}
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
            <BlockHeading title={t.equipmentTitle} note={t.equipmentNote} />

            <div className="mt-4 flex flex-1 flex-col">
              {/* Zarovnání se sousedním sloupcem: nahoře odskok o výšku střechy,
                  dole se karta roztáhne, takže obě kolonky končí na stejné lince. */}
              <div aria-hidden className={`hidden lg:block ${ROOF_H}`} />
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

              <div className="mt-4 flex flex-col gap-2.5 rounded-xl border border-brand/20 bg-tag/40 px-4 py-3.5 sm:px-5">
                {extras.map((extra) => (
                  <div key={extra.label} className="flex items-center gap-2">
                    <extra.Icon className="size-[17px] shrink-0 text-brand" strokeWidth={1.9} aria-hidden />
                    <span className="text-[13px] font-semibold text-ink">{extra.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
