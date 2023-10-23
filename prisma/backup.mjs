export async function createUsers(prisma) {
  // Borra todos los registros de la tabla User
  await prisma.user.deleteMany({});

  await prisma.user.create({
    data: {
      id: "f2276de7-c8a9-4c40-91c1-acfd3a5ab138",
      email: "admin@uandresbello.edu",
      pass: "admin",
      rut: "99999999-9",
      name: "Admin",
      role: "ADMIN",
    },
  });
}

export async function createLaboratories(prisma) {
  // Borra todos los registros de la tabla Laboratory
  await prisma.pc.deleteMany({});
  await prisma.laboratory.deleteMany({});

  await prisma.laboratory.createMany({
    data: [
      { id: "277334f5-e626-4363-bc41-96d9a5d590b5", number: 1 },
      { id: "7b044f35-3b6b-4ec4-9ca3-10f7b917a209", number: 2 },
      { id: "d0b18687-0626-4f6b-88cb-7a28d1470ffa", number: 3 },
    ],
  });

  await prisma.pc.createMany({
    data: [
      {
        name: "Laptop principal",
        model: "an-515",
        brand: "Acer",
        status: true,
        laboratory_id: "277334f5-e626-4363-bc41-96d9a5d590b5",
      },
      {
        name: "Laptop de trabajo",
        model: "ThinkPad X1 Carbon",
        brand: "Lenovo",
        status: true,
        laboratory_id: "7b044f35-3b6b-4ec4-9ca3-10f7b917a209",
      },
      {
        name: "Laptop personal",
        model: "MacBook Air",
        brand: "Apple",
        status: true,
        laboratory_id: "d0b18687-0626-4f6b-88cb-7a28d1470ffa",
      },
      {
        name: "Laptop gaming",
        model: "ROG Zephyrus",
        brand: "ASUS",
        status: true,
        laboratory_id: "277334f5-e626-4363-bc41-96d9a5d590b5",
      },
    ],
  });
}
