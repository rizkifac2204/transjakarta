import { verifyAuth } from "@/libs/auth";
import { notFound } from "next/navigation";
import Card from "@/components/ui/Card";
import ContentWhatsappPage from "./_content";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Whatsapp Setting",
};

async function WhatsappPage() {
  const auth = await verifyAuth();
  if (auth?.level > 2) notFound();
  return (
    <Card title="PENGATURAN WHATSAPP">
      <ContentWhatsappPage />
    </Card>
  );
}

export default WhatsappPage;
