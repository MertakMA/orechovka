import KontaktPage from "@/components/pages/KontaktPage";
import { metadataStranky } from "@/lib/metadata";

export const metadata = metadataStranky("kontakt", "en", "/kontakt");

export default function Page() {
  return <KontaktPage locale="en" />;
}
