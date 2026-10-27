import "dotenv/config";
import bcrypt from "bcryptjs";

import { prisma } from "./db.js";

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be defined in .env",
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.adminUser.upsert({
    where: {
      email: email.toLowerCase(),
    },
    update: {
      passwordHash,
    },
    create: {
      email: email.toLowerCase(),
      passwordHash,
      role: "admin",
    },
  });

  console.log(`Admin account created: ${admin.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });