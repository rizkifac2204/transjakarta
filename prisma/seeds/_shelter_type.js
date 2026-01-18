// prisma/seeds/_fleet_type.js

export async function main(prisma) {
  console.log(`Mulai seeding shelter_type...`);

  const datas = [
    { id: 1, name: "Ujung" },
    { id: 2, name: "Transit" },
    { id: 3, name: "Integrasi" },
    { id: 4, name: "Antara" },
  ];

  for (const data of datas) {
    await prisma.shelter_type.upsert({
      where: { id: data.id },
      update: {},
      create: data,
    });
  }
  console.log(`Seeding shelter_type selesai.`);
}
