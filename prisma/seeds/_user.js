// prisma/seeds/_user.js

import bcrypt from "bcryptjs";

export async function main(prisma) {
  console.log(`Mulai seeding dev user...`);

  const hashedPassword = await bcrypt.hash("@Loremit123", 10);

  await prisma.user.upsert({
    where: { username: "developer" },
    update: {},
    create: {
      level_id: 1,
      nama: "Rizki Fahruroji",
      username: "developer",
      password: hashedPassword,
      mfa_enabled: false,
    },
  });

  console.log(
    `Seeding dev user selesai dengan username : developer dan password @Loremit123.`
  );

  console.log(`Mulai seeding admin user...`);

  const pass = await bcrypt.hash("transjakarta", 10);

  const datas = [
    {
      level_id: 2,
      nama: "Admin Utama",
      username: "adminuatama",
      password: pass,
      mfa_enabled: false,
    },
    {
      level_id: 3,
      nama: "Admin 1",
      username: "admin1",
      password: pass,
      mfa_enabled: false,
    },
    {
      level_id: 3,
      nama: "Admin 2",
      username: "admin2",
      password: pass,
      mfa_enabled: false,
    },
  ];

  for (const data of datas) {
    await prisma.user.upsert({
      where: { username: data.username },
      update: {},
      create: data,
    });
  }

  console.log(`Seeding admin user selesai dengan password transjakarta.`);
}
