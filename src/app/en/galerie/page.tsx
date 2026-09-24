import GaleriePage from "@/components/pages/GaleriePage";
import { metadataStranky } from "@/lib/metadata";

export const metadata = metadataStranky("galerie", "en", "/galerie");

export default function Page() {
  return <GaleriePage locale="en" />;
}
