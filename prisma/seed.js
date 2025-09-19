const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.article.createMany({
    data: [
      { title: "Understanding Next.js Routing", content: "Content for Routing..." },
      { title: "React vs Next.js: Key Differences", content: "Content for React vs Next.js..." },
      { title: "Getting Started with Tailwind CSS", content: "Content for Tailwind CSS..." },
      { title: "Server-Side Rendering Explained", content: "Content for SSR..." },
      { title: "Static Site Generation in Depth", content: "Content for SSG..." },
    ],
  });

  console.log("✅ Seed data inserted");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
