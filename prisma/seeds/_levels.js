// prisma/seeds/_levels.js

export async function main(prisma) {
  console.log(`Mulai seeding levels...`);

  const levelData = [
    { id: 1, level: "DEVELOPER" },
    { id: 2, level: "SUPER_ADMIN" },
    { id: 3, level: "ADMIN" },
    { id: 4, level: "SURVEYOR" },
  ];

  for (const data of levelData) {
    await prisma.level.upsert({
      where: { id: data.id },
      update: {},
      create: data,
    });
  }
  console.log(`Seeding levels selesai.`);
}
