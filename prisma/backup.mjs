export async function createUsers(prisma) {
  await prisma.user.createMany({
    data: [
      {
        email: "admin@uandresbello.edu",
        pass: "admin",
        rut: "99999999-5",
        name: "Admin",
        role: "ADMIN",
      },
      {
        email: "jefe@uandresbello.edu",
        pass: "jefe",
        rut: "99999999-2",
        name: "jefe de laboratorio",
        role: "JEFE",
      },
      {
        email: "estudiante@uandresbello.edu",
        pass: "admin",
        rut: "99999999-9",
        name: "Estudiante",
        role: "ESTUDIANTE",
      },
      {
        email: "encargado@uandresbello.edu",
        pass: "encargado",
        rut: "99999999-3",
        name: "Encargado",
        role: "ENCARGADO",
      },
    ],
  });
}

export async function createLaboratories(prisma) {
  await prisma.laboratory.createMany({
    data: [{ number: 1 }, { number: 2 }, { number: 3 }],
  });

  const laboratorio1 = await prisma.laboratory.findUnique({
    where: { number: 1 },
  });
  const laboratorio2 = await prisma.laboratory.findUnique({
    where: { number: 2 },
  });
  const laboratorio3 = await prisma.laboratory.findUnique({
    where: { number: 3 },
  });

  await prisma.pc.createMany({
    data: [
      {
        name: "Laptop principal",
        model: "an-515",
        brand: "Acer",
        status: true,
        laboratory_id: laboratorio1.id,
      },
      {
        name: "Laptop de trabajo",
        model: "ThinkPad X1 Carbon",
        brand: "Lenovo",
        status: true,
        laboratory_id: laboratorio2.id,
      },
      {
        name: "Laptop personal",
        model: "MacBook Air",
        brand: "Apple",
        status: true,
        laboratory_id: laboratorio3.id,
      },
      {
        name: "Laptop gaming",
        model: "ROG Zephyrus",
        brand: "ASUS",
        status: true,
        laboratory_id: laboratorio1.id,
      },
    ],
  });
}
