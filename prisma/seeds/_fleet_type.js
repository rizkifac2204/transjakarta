// prisma/seeds/_fleet_type.js

export async function main(prisma) {
  console.log(`Mulai seeding fleet_type...`);

  const datas = [
    { id: 1, name: "Single Bus" },
    { id: 2, name: "Maxi" },
    { id: 3, name: "Low Entry" },
    { id: 4, name: "Articulated" },
    { id: 5, name: "Bus Sedang" },
    { id: 6, name: "Bus Kecil" },
  ];

  for (const data of datas) {
    await prisma.fleet_type.upsert({
      where: { id: data.id },
      update: {},
      create: data,
    });
  }
  console.log(`Seeding fleet_type selesai.`);
}
