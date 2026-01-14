import prisma from "../prisma";
import { getConditionByAuth } from "../condition";

export async function getPermohonanPerbulan() {
  const where = await getConditionByAuth();
  const data = await prisma.permohonan.groupBy({
    where,
    by: ["created_at"],
    _count: true,
  });

  // 1. Olah hasil groupBy jadi map: { "2-2025": count }
  const mapData = new Map();

  data.forEach((item) => {
    const tanggal = new Date(item.created_at);
    const bulan = tanggal.getMonth(); // 0–11
    const tahun = tanggal.getFullYear();
    const key = `${bulan + 1}-${tahun}`;
    mapData.set(key, (mapData.get(key) || 0) + 1);
  });

  // 2. Dapatkan tahun berjalan
  const now = new Date();
  const currentYear = now.getFullYear();

  // 3. Bangun array lengkap Jan–Des
  const hasilArray = Array.from({ length: 12 }, (_, i) => {
    const key = `${i + 1}-${currentYear}`;
    const label = new Date(currentYear, i).toLocaleString("default", {
      month: "short",
    });

    return {
      bulan: `${label} ${currentYear}`,
      total: mapData.get(key) || 0,
    };
  });

  return hasilArray;
}

export async function getPermohonanDanKeberatanPerbulan() {
  const where = await getConditionByAuth();

  const permohonan = await prisma.permohonan.groupBy({
    where,
    by: ["created_at"],
    _count: true,
  });

  const keberatan = await prisma.keberatan.groupBy({
    where,
    by: ["created_at"],
    _count: true,
  });

  const penelitian = await prisma.penelitian.groupBy({
    where,
    by: ["created_at"],
    _count: true,
  });

  // 🔢 Buat list 12 bulan terakhir
  const bulanPenuh = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const bulan = date.toLocaleString("default", { month: "short" });
    const tahun = date.getFullYear();
    const key = `${bulan} ${tahun}`;
    bulanPenuh.push({ key, bulan, tahun });
  }

  // 🧩 Siapkan map bulan dengan default 0
  const hasil = {};
  bulanPenuh.forEach(({ key }) => {
    hasil[key] = { bulan: key, permohonan: 0, keberatan: 0, penelitian: 0 };
  });

  function prosesData(data, tipe) {
    data.forEach((item) => {
      const tanggal = new Date(item.created_at);
      const bulan = tanggal.toLocaleString("default", { month: "short" });
      const tahun = tanggal.getFullYear();
      const key = `${bulan} ${tahun}`;
      if (hasil[key]) {
        hasil[key][tipe] += 1;
      }
    });
  }

  prosesData(permohonan, "permohonan");
  prosesData(keberatan, "keberatan");
  prosesData(penelitian, "penelitian");

  // Urutkan berdasarkan urutan `bulanPenuh` agar selalu konsisten
  const hasilArray = bulanPenuh.map(({ key }) => hasil[key]);

  return hasilArray;
}
