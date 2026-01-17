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
        access_level: [1, 2, 3],
      },
    ],
  },

  {
    isHeader: true,
    title: "main",
  },

  {
    title: "Armada",
    icon: "solar:bus-broken",
    link: "#",
    isHide: false,
    child: [
      {
        childtitle: "Data Survey Armada",
        childlink: "/admin/armada",
      },
      {
        childtitle: "Tambah Data",
        childlink: "/admin/armada/add",
      },
    ],
  },

  {
    title: "Halte",
    icon: "solar:streets-navigation-broken",
    link: "#",
    isHide: false,
    child: [
      {
        childtitle: "Data Survey Halte",
        childlink: "/admin/halte",
      },
      {
        childtitle: "Tambah Data",
        childlink: "/admin/halte/add",
      },
    ],
  },

  {
    title: "Headway",
    icon: "solar:flip-horizontal-broken",
    link: "#",
    isHide: false,
    child: [
      {
        childtitle: "Data Survey Headway",
        childlink: "/admin/headway",
      },
      {
        childtitle: "Tambah Data",
        childlink: "/admin/headway/add",
      },
    ],
  },

  {
    isHeader: true,
    title: "support",
    access_level: [1, 2, 3],
  },

  {
    title: "Pertanyaan Form Armada",
    isHide: true,
    icon: "solar:folder-path-connect-broken",
    link: "/admin/armada/question-set",
    badge: null,
    access_level: [1, 2, 3],
  },

  {
    title: "Infografis",
    isHide: false,
    icon: "solar:chart-square-broken",
    link: "/admin/chart",
    access_level: [1, 2, 3],
  },
];

export default menuItems;
