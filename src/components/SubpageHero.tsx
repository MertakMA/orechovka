import Image from "next/image";
import type { Fotka } from "@/lib/fotky";

export default function SubpageHero({
  title,
  subtitle,
  photo,
  overlayClassName = "bg-[#2a1c12]/55",
}: {
  title: string | null;
  subtitle: string | null;
  photo: Fotka;
  overlayClassName?: string;
}) {
  return (
    <section className="relative flex h-[260px] items-center justify-center overflow-hidden text-center">
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[60%_50%] [filter:sepia(0.12)_saturate(1.04)]"
        style={{ objectPosition: photo.pozice }}
      />
      <div className={`absolute inset-0 ${overlayClassName}`} />
      <div className="relative z-10 flex flex-col items-center gap-3 px-6">
        {title && <h1 className="font-serif text-[36px] font-bold text-white sm:text-[48px]">{title}</h1>}
        {subtitle && <p className="max-w-xl text-[16px] font-medium text-cream sm:text-[18px]">{subtitle}</p>}
      </div>
    </section>
  );
}
