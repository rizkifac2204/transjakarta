export const chartConfig = {
  permohonan: {
    label: "Permohonan Informasi",
    fields: [
      {
        label: "Tipe Pemohon",
        column: "tipe",
        chartType: "pie",
      },
      {
        label: "Platform Pengajuan",
        column: "platform",
        chartType: "pie",
      },
      {
        label: "Cara Mendapat Informasi",
        column: "cara_dapat",
        chartType: "pie",
      },
      {
        label: "Cara Menerima Informasi",
        column: "cara_terima",
        chartType: "pie",
      },
      {
        label: "Status Permohonan",
        column: "status",
        chartType: "bar",
      },
      {
        label: "Jumlah Jawaban",
        column: "jawaban",
        chartType: "number",
      },
    ],
  },
  keberatan: {
    label: "Keberatan",
    fields: [
      {
        label: "Kategori Pemohon",
        column: "kategori",
        chartType: "pie",
      },
    ],
  },
  penelitian: {
    label: "Permohonan Penelitian",
    fields: [
      {
        label: "Tipe Pemohon",
        column: "tipe",
        chartType: "pie",
      },
      {
        label: "Platform Pengajuan",
        column: "platform",
        chartType: "pie",
      },
      {
        label: "Status Permohonan",
        column: "status",
        chartType: "bar",
      },
      {
        label: "Jumlah Jawaban",
        column: "jawaban_penelitian",
        chartType: "number",
      },
    ],
  },
  pemohon: {
    label: "Data Pemohon",
    fields: [
      {
        label: "Jenis Kelamin",
        column: "jenis_kelamin",
        chartType: "pie",
      },
      {
        label: "Pekerjaan",
        column: "pekerjaan",
        chartType: "wordCloud",
      },
      {
        label: "Pendidikan",
        column: "pendidikan",
        chartType: "bar",
      },
      {
        label: "Universitas",
        column: "universitas",
        chartType: "wordCloud",
      },
      {
        label: "Jurusan/Prodi",
        column: "jurusan",
        chartType: "wordCloud",
      },
    ],
  },
};
