import GaleriePage from "@/components/pages/GaleriePage";
import { metadataStranky } from "@/lib/metadata";

export const metadata = metadataStranky("galerie", "cs", "/galerie");

export default function Page() {
  return <GaleriePage locale="cs" />;
}
