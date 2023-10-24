import { PrismaClient } from "@prisma/client";
import { createLaboratories, createUsers } from "./backup.mjs";

const prisma = new PrismaClient();

// node prisma/resetdb.mjs
// npx ts-node prisma/script.mjs
async function main() {
  // Resetea la base de datos
  createUsers(prisma);
  createLaboratories(prisma);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
