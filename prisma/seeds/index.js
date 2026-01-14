import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});

import { main as seedLevels } from "./_levels.js";
import { main as seedUsers } from "./_users.js";

const prisma = new PrismaClient({ adapter });

const seeders = {
  levels: seedLevels,
  users: seedUsers,
};

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Running default seeders: levels, users, tingkat");
    await seedLevels(prisma);
    await seedUsers(prisma);
  } else {
    for (const arg of args) {
      if (seeders[arg]) {
        console.log(`Running seeder: ${arg}`);
        await seeders[arg](prisma);
      } else {
        console.log(`No seeder found for '${arg}'`);
      }
    }
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
