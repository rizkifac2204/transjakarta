import { getAllHalaman } from "@/libs/halaman";
import { verifyAuth } from "@/libs/auth";
import { notFound } from "next/navigation";
import Card from "@/components/ui/Card";
import FormHalaman from "../_FormHalaman";
import {
  SEPUTAR_PPID,
  MEDIA_LAYANAN,
  UKPBJ,
} from "@/components/front/data/data";

export const dynamic = "force-dynamic";

const SLUG_UKPBJ = UKPBJ.filter((item) => !item.static).map((item) => ({
  label: "UKPBJ - " + item.label,
  link: item.link,
}));

const SLUG_OPTIONS = [...SEPUTAR_PPID, ...MEDIA_LAYANAN, ...SLUG_UKPBJ]
  .filter((item) => !item.static)
  .map((item) => ({
    label: item.label,
    value: item.link,
  }));

export const metadata = {
  title: "Tambah Halaman",
};

async function HalamanAddPage() {
  const auth = await verifyAuth();
  if (auth?.level > 2) notFound();
  const data = await getAllHalaman();

  // Slug dari database sudah berawalan '/'
  const usedSlugs = new Set(data.map((item) => item.slug));

  // Filter slug yang belum dipakai
  const NEW_SLUG = SLUG_OPTIONS.filter((item) => !usedSlugs.has(item.value));

  return (
    <Card title="FORMULIR TAMBAH HALAMAN" noborder={false}>
      <FormHalaman
        data={data}
        slugOptions={NEW_SLUG}
        defaultValues={{ slug: "", judul: "", isi: "" }}
      />
    </Card>
  );
}

export default HalamanAddPage;
