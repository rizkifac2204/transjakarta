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
}
