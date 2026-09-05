"use client";

import { useEffect, useState } from "react";
import { V } from "@/generated/variables";

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
      <source src={`${V.WEBKAMERA_VIDEO_URL}&t=${refreshedAt}`} type="video/mp4" />
    </video>
  );
}
