import { getInstansi } from "@/libs/instansi";
import { verifyAuth } from "@/libs/auth";
import { notFound } from "next/navigation";
import FormInstansi from "./_FormInstansi";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Identitas Instansi",
};

async function InstansiPage() {
  const auth = await verifyAuth();
  if (auth?.level > 2) notFound();
  const data = await getInstansi();

  const defaultValues = {
    nama: data?.nama || "",
    kode: data?.kode || "",
    telp_1: data?.telp_1 || "",
    telp_2: data?.telp_2 || "",
    email: data?.email || "",
    alamat: data?.alamat || "",
    website: data?.website || "",
    facebook: data?.facebook || "",
    twitter: data?.twitter || "",
    instagram: data?.instagram || "",
    youtube: data?.youtube || "",
    tiktok: data?.tiktok || "",
    notif_wa: data?.notif_wa || "",
    notif_email: data?.notif_email || "",
  };

  return (
    <FormInstansi key={data?.id || "baru"} defaultValues={defaultValues} />
  );
}

export default InstansiPage;
