export default function StatusTanggapan({ tanggal, no_regis, tiket }) {
  const isTanggapi = !!no_regis;

  if (isTanggapi) {
    return (
      <div>
        <div>{no_regis}</div>
        {tiket && (
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {tiket}
          </div>
        )}
      </div>
    );
  }

  // Belum ditanggapi
  const tgl = new Date(tanggal);
  const batas10 = new Date(tgl);
  batas10.setDate(batas10.getDate() + 10);
  const batas17 = new Date(tgl);
  batas17.setDate(batas17.getDate() + 17);
  const now = new Date();

  let color = "text-green-600";
  let label = "Masih Dalam Batas";
  let icon = "⏳";

  if (now > batas17) {
    color = "text-red-600";
    label = "Lewat Batas";
    icon = "⛔";
  } else if (now > batas10) {
    color = "text-yellow-600";
    label = "Mendekati Batas";
    icon = "⚠️";
  }

  return (
    <div>
      <span className={`text-sm font-medium ${color}`}>
        {icon} {label}
      </span>
      {tiket && (
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {tiket}
        </div>
      )}
    </div>
  );
}
