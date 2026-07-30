import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.log("Uso: npx ts-node scripts/create-admin.ts <correo> <nombre> <contraseña>");
    process.exit(1);
  }

  const [email, nombre, contrasena] = args;
  const cleanEmail = email.trim().toLowerCase();

  console.log(`Intentando crear el usuario administrador: ${nombre} (${cleanEmail})...`);

  // Verificar si ya existe
  const existingUser = await prisma.user.findUnique({
    where: { email: cleanEmail }
  });

  if (existingUser) {
    console.log(`El usuario con correo ${cleanEmail} ya existe.`);
    console.log("Actualizando contraseña y asegurando rol de administrador...");
    const hashedPassword = bcrypt.hashSync(contrasena, 10);
    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        rol: "ADMIN",
        contrasena: hashedPassword,
        nombre: nombre
      }
    });
    console.log("¡Usuario actualizado a ADMIN y contraseña modificada con éxito!");
    return;
  }

  const hashedPassword = bcrypt.hashSync(contrasena, 10);

  const newUser = await prisma.user.create({
    data: {
      email: cleanEmail,
      nombre: nombre,
      contrasena: hashedPassword,
      rol: "ADMIN",
      estadoInscripcion: "Aceptado",
      empresa: "IHDECA"
    }
  });

  console.log(`¡Usuario administrador creado con éxito! ID: ${newUser.id}`);
}

main()
  .catch((e) => {
    console.error("Error al crear el administrador:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
