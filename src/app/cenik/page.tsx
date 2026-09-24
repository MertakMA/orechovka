import CenikPage from "@/components/pages/CenikPage";
import { metadataStranky } from "@/lib/metadata";

export const metadata = metadataStranky("cenik", "cs", "/cenik");

export default function Page() {
  return <CenikPage locale="cs" />;
}
