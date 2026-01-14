import {
  getPermohonanDetailByTiket,
  getPermohonanDetailByTiketAndEmail,
} from "@/libs/permohonan";
import {
  getPenelitianDetailByTiket,
  getPenelitianDetailByTiketAndEmail,
} from "@/libs/penelitian";
import { notFound } from "next/navigation";
import SuccessPage from "./_Success";
import DetailPage from "./_Detail";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Hasil Permohonan",
};

async function PermohonanResult({ searchParams }) {
  const tiket = searchParams?.tiket;
  const email = searchParams?.email;
  const success = searchParams?.success;

  if (!tiket) {
    notFound();
  }

  let dataInformasi;
  let dataPenelitian;
  if (email) {
    [dataInformasi, dataPenelitian] = await Promise.all([
      getPermohonanDetailByTiketAndEmail(String(tiket), String(email)),
      getPenelitianDetailByTiketAndEmail(String(tiket), String(email)),
    ]);
  } else {
    [dataInformasi, dataPenelitian] = await Promise.all([
      getPermohonanDetailByTiket(String(tiket)),
      getPenelitianDetailByTiket(String(tiket)),
    ]);
  }

  if (!dataInformasi && !dataPenelitian) {
    notFound();
  }

  const data = dataInformasi || dataPenelitian;
  const isPenelitian = dataInformasi ? false : true;

  if (email) {
    return <DetailPage data={data} isPenelitian={isPenelitian} />;
  } else {
    return <SuccessPage data={data} isPenelitian={isPenelitian} />;
  }
}

export default PermohonanResult;
