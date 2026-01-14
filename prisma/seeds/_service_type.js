// prisma/seeds/_service_type.js

export async function main(prisma) {
  console.log(`Mulai seeding service_type...`);

  const datas = [
    { id: 1, name: "BRT" },
    { id: 2, name: "Feeder Bus Besar" },
    { id: 3, name: "Feeder Bus Sedang" },
    { id: 4, name: "Feeder Bus Kecil" },
    { id: 5, name: "Trans Care" },
  ];

  for (const data of datas) {
    await prisma.service_type.upsert({
      where: { id: data.id },
      update: {},
      create: data,
    });
  }
  console.log(`Seeding service_type selesai.`);
}
