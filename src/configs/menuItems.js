const menuItems = [
  {
    isHeader: true,
    title: "menu",
  },

  {
    title: "Dashboard",
    isHide: true,
    icon: "solar:home-broken",
    link: "/admin",
    badge: null,
  },
  {
    title: "Profile",
    isHide: false,
    icon: "solar:user-broken",
    link: "/admin/profile",
  },
  {
    title: "Pengguna",
    icon: "solar:shield-user-broken",
    link: "#",
    isHide: false,
    child: [
      {
        childtitle: "Data Pengguna",
        childlink: "/admin/pengguna",
      },
      {
        childtitle: "Tambah Pengguna",
        childlink: "/admin/pengguna/add",
        access_level: [1, 2],
      },
    ],
  },

  {
    isHeader: true,
    title: "main",
  },

  {
    title: "Informasi",
    icon: "solar:database-broken",
    link: "#",
    isHide: false,
    child: [
      {
        childtitle: "Data Permohonan Informasi",
        childlink: "/admin/permohonan",
      },
      {
        childtitle: "Tambah Permohonan Informasi",
        childlink: "/admin/permohonan/add",
      },
    ],
  },

  {
    title: "Keberatan",
    icon: "solar:palette-broken",
    link: "#",
    isHide: false,
    child: [
      {
        childtitle: "Data Keberatan",
        childlink: "/admin/keberatan",
      },
      {
        childtitle: "Tambah Keberatan",
        childlink: "/admin/keberatan/add",
      },
    ],
  },

  {
    title: "Penelitian",
    icon: "solar:square-academic-cap-2-broken",
    link: "#",
    isHide: false,
    child: [
      {
        childtitle: "Data Permohonan Penelitian",
        childlink: "/admin/penelitian",
      },
      {
        childtitle: "Tambah Permohonan Penelitian",
        childlink: "/admin/penelitian/add",
      },
    ],
  },

  {
    title: "Pemohon",
    isHide: false,
    icon: "solar:user-id-broken",
    link: "/admin/pemohon",
  },

  {
    title: "Peraturan",
    isHide: false,
    icon: "solar:book-bookmark-minimalistic-broken",
    link: "/admin/peraturan",
  },

  {
    title: "Daftar Informasi",
    icon: "solar:infinity-broken",
    link: "#",
    isHide: false,
    child: [
      {
        childtitle: "Berkala",
        childlink: "/admin/dip/berkala",
      },
      {
        childtitle: "Serta Merta",
        childlink: "/admin/dip/serta-merta",
      },
      {
        childtitle: "Tersedia Setiap Saat",
        childlink: "/admin/dip/tersedia-setiap-saat",
      },
    ],
  },

  {
    title: "Laporan",
    icon: "solar:bookmark-opened-broken",
    link: "#",
    isHide: false,
    child: [
      {
        childtitle: "Akses Informasi Publik",
        childlink: "/admin/laporan/akses-informasi-publik",
      },
      {
        childtitle: "Layanan Informasi Publik",
        childlink: "/admin/laporan/layanan-informasi-publik",
      },
      {
        childtitle: "Survei Informasi Publik",
        childlink: "/admin/laporan/survei-informasi-publik",
      },
    ],
  },

  {
    title: "UKPBJ",
    icon: "solar:branching-paths-down-broken",
    link: "#",
    isHide: false,
    child: [
      {
        childtitle: "Regulasi",
        childlink: "/admin/ukpbj/regulasi",
      },
      {
        childtitle: "Informasi",
        childlink: "/admin/ukpbj/informasi",
      },
    ],
  },

  {
    isHeader: true,
    title: "support",
  },

  {
    title: "Whatsapp",
    isHide: false,
    icon: "ic:baseline-whatsapp",
    link: "/admin/whatsapp",
    badge: true,
    access_level: [1, 2],
  },

  {
    title: "Testimoni",
    isHide: false,
    icon: "solar:stars-outline",
    link: "/admin/testimoni",
  },

  {
    title: "Trash",
    isHide: false,
    icon: "solar:trash-bin-minimalistic-2-broken",
    link: "/admin/trash",
  },

  {
    title: "Infografis",
    isHide: false,
    icon: "solar:chart-square-broken",
    link: "/admin/chart",
  },

  {
    title: "Identitas Instansi",
    isHide: false,
    icon: "solar:buildings-broken",
    link: "/admin/instansi",
    access_level: [1, 2],
  },

  {
    title: "Slider",
    isHide: false,
    icon: "solar:slider-vertical-minimalistic-outline",
    link: "/admin/slider",
    access_level: [1, 2],
  },

  {
    title: "Tampilan Website",
    isHide: false,
    icon: "solar:display-broken",
    link: "/admin/halaman",
    access_level: [1, 2],
  },

  // {
  //   title: "Multi Level",
  //   icon: "heroicons:share",
  //   link: "#",
  //   child: [
  //     {
  //       childtitle: "Level 1.1",
  //       childlink: "icons",
  //     },
  //     {
  //       childtitle: "Level 1.2",
  //       childlink: "Level-1",
  //       multi_menu: [
  //         {
  //           multiTitle: "Level 2.1",
  //           multiLink: "Level-2",
  //         },
  //         {
  //           multiTitle: "Level 2.2",
  //           multiLink: "Level-2.3",
  //         },
  //       ],
  //     },
  //   ],
  // },
];

export default menuItems;
