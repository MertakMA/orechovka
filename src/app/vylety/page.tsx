import VyletyPage from "@/components/pages/VyletyPage";
import { metadataStranky } from "@/lib/metadata";

export const metadata = metadataStranky("vylety", "cs", "/vylety");

export default function Page() {
  return <VyletyPage locale="cs" />;
}
