function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

const namaBulan = (bulan, singkat = false) => {
  switch (bulan) {
    case 0:
      bulan = singkat ? "Jan" : "Januari";
      break;
    case 1:
      bulan = singkat ? "Feb" : "Februari";
      break;
    case 2:
      bulan = singkat ? "Mar" : "Maret";
      break;
    case 3:
      bulan = singkat ? "Apr" : "April";
      break;
    case 4:
      bulan = singkat ? "Mei" : "Mei";
      break;
    case 5:
      bulan = singkat ? "Jun" : "Juni";
      break;
    case 6:
      bulan = singkat ? "Jul" : "Juli";
      break;
    case 7:
      bulan = singkat ? "Agu" : "Agustus";
      break;
    case 8:
      bulan = singkat ? "Sep" : "September";
      break;
    case 9:
      bulan = singkat ? "Okt" : "Oktober";
      break;
    case 10:
      bulan = singkat ? "Nov" : "November";
      break;
    case 11:
      bulan = singkat ? "Des" : "Desember";
      break;
  }
  return bulan;
};

const namaHari = (hari) => {
  switch (hari) {
    case 0:
      hari = "Minggu";
      break;
    case 1:
      hari = "Senin";
      break;
    case 2:
      hari = "Selasa";
      break;
    case 3:
      hari = "Rabu";
      break;
    case 4:
      hari = "Kamis";
      break;
    case 5:
      hari = "Jumat";
      break;
    case 6:
      hari = "Sabtu";
      break;
  }
  return hari;
};

function dateIsValid(date) {
  return date instanceof Date && !isNaN(date);
}

const formatedDate = (date, hari = false, showTime = false) => {
  if (!date) return "-";
  if (!dateIsValid(new Date(date))) return "-";

  date = new Date(date);
  const tahun = date.getFullYear();
  const bulan = namaBulan(date.getMonth());
  const tanggal = date.getDate();
  const jam = String(date.getHours()).padStart(2, "0");
  const menit = String(date.getMinutes()).padStart(2, "0");

  const showHari = hari ? `${namaHari(date.getDay())}, ` : "";
  const waktu = showTime ? ` Pukul ${jam}:${menit}` : "";

  return `${showHari}${tanggal} ${bulan} ${tahun}${waktu}`;
};

const formatedDateUntil = (start, end) => {
  if (!start || !end) return;
  const awal = new Date(start);
  const akhir = new Date(end);

  const mulai = {
    tahun: awal.getFullYear(),
    bulan: namaBulan(awal.getMonth()),
    tanggal: awal.getDate(),
  };
  const selesai = {
    tahun: akhir.getFullYear(),
    bulan: namaBulan(akhir.getMonth()),
    tanggal: akhir.getDate(),
  };

  const textMulai = `${mulai.tanggal} ${mulai.bulan} ${mulai.tahun}`;
  const textSelesai = `${selesai.tanggal} ${selesai.bulan} ${selesai.tahun}`;

  return `${textMulai} s/d ${textSelesai}`;
};

const getTime = (date) => {
  date = new Date(date);
  var hour = addZero(date.getHours());
  var minute = addZero(date.getMinutes());
  return hour + ":" + minute;
};

const parseDateInput = (val) => {
  if (!val || val === "null") return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
};

export {
  formatedDate,
  namaBulan,
  namaHari,
  formatedDateUntil,
  getTime,
  parseDateInput,
};
