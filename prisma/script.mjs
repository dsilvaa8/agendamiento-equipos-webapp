import { PrismaClient } from "@prisma/client";
import { createLaboratories, createUsers } from "./backup.mjs";

const prisma = new PrismaClient();

//npx ts-node prisma/script.mjs
async function main() {
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
