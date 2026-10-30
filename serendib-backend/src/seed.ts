import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "./db.js";

const categories = [
  { name: "Beaches", slug: "beaches", description: "Coastal escapes and quiet beaches." },
  { name: "Mountains", slug: "mountains", description: "Misty highlands, trails and viewpoints." },
  { name: "Historical Sites", slug: "historical-sites", description: "Ancient cities, temples and cultural landmarks." },
  { name: "Wildlife", slug: "wildlife", description: "National parks and wildlife experiences." },
];

const destinations = [
  {
    name: "Sigiriya",
    slug: "sigiriya",
    location: "Cultural Triangle",
    shortDescription: "Climb the ancient rock fortress and explore the gardens below.",
    imageUrl: "https://images.unsplash.com/photo-1588598198321-9735fd524b7b?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "historical-sites",
  },
  {
    name: "Ella",
    slug: "ella",
    location: "Uva Province",
    shortDescription: "Walk through tea country, waterfalls and cloud-covered hills.",
    imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "mountains",
  },
  {
    name: "Mirissa",
    slug: "mirissa",
    location: "Southern Coast",
    shortDescription: "Relax by the ocean and watch the sunset from the palm-lined shore.",
    imageUrl: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "beaches",
  },
  {
    name: "Yala",
    slug: "yala",
    location: "Southern Province",
    shortDescription: "Discover Sri Lanka's wildlife on a responsible national park safari.",
    imageUrl: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=80",
    categorySlug: "wildlife",
  },
];

async function main() {
  const categoryIds = new Map<string, number>();
  for (const category of categories) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
    categoryIds.set(record.slug, record.id);
  }

  for (const destination of destinations) {
    const categoryId = categoryIds.get(destination.categorySlug);
    if (!categoryId) throw new Error(`Missing category: ${destination.categorySlug}`);
    await prisma.destination.upsert({
      where: { slug: destination.slug },
      update: {
        name: destination.name,
        location: destination.location,
        shortDescription: destination.shortDescription,
        imageUrl: destination.imageUrl,
        categoryId,
      },
      create: {
        name: destination.name,
        slug: destination.slug,
        location: destination.location,
        shortDescription: destination.shortDescription,
        imageUrl: destination.imageUrl,
        categoryId,
      },
    });
  }

  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    await prisma.adminUser.upsert({
      where: { email: process.env.ADMIN_EMAIL.toLowerCase() },
      update: { passwordHash },
      create: {
        email: process.env.ADMIN_EMAIL.toLowerCase(),
        passwordHash,
        role: "admin",
      },
    });
  }

  console.log(`Seeded ${categories.length} categories and ${destinations.length} destinations.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
