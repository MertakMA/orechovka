"use client";

import { useEffect, useState } from "react";

// Exportovaný poslední klip z webkamery (holidayinfo.cz). Server soubor pravidelně
// přepisuje novým záznamem, takže sem periodicky přidáváme cache-busting parametr.
const WEBCAM_VIDEO_URL =
  "https://exports.holidayinfo.cz/loc_cams_expvideo_lastvideofile.php?dc=492c16309390f152&camid=2084&size=full&ext=mp4";
const REFRESH_MS = 5 * 60 * 1000; // 5 minut

export default function WebcamPlayer() {
  // null až do prvního mountu na klientovi — vyhne se hydration mismatchi z Date.now().
  const [refreshedAt, setRefreshedAt] = useState<number | null>(null);

  useEffect(() => {
    setRefreshedAt(Date.now());
    const id = setInterval(() => setRefreshedAt(Date.now()), REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  if (refreshedAt === null) {
    return <div className="size-full animate-pulse bg-border" />;
  }

  return (
    <video key={refreshedAt} className="size-full object-cover" autoPlay loop muted playsInline controls>
      <source src={`${WEBCAM_VIDEO_URL}&t=${refreshedAt}`} type="video/mp4" />
    </video>
  );
}
