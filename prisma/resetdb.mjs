import util from "util";
import { exec } from "child_process";

const executeCommand = util.promisify(exec);


export async function resetDB(directory) {
  try {
    // Cambiar al directorio especificado
    process.chdir(directory);

    // Ejecutar los comandos de Prisma
    await executeCommand("npx prisma migrate reset --force");
    await executeCommand("npx prisma generate");
    await executeCommand("npx prisma db push");
  } catch (error) {
    console.error("Error al resetear la base de datos:", error);
  }
}
const directory = "C:\\github\\webdev\\unab\\agendamiento-equipos-webapp";
resetDB(directory);
