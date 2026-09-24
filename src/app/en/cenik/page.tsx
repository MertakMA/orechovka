import CenikPage from "@/components/pages/CenikPage";
import { metadataStranky } from "@/lib/metadata";

export const metadata = metadataStranky("cenik", "en", "/cenik");

export default function Page() {
  return <CenikPage locale="en" />;
}
