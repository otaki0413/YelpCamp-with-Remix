import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function seed() {
  const email = "test@test.com";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } });

  const username = "testUser";
  const hashedPassword = await bcrypt.hash("password", 10);

  // Create users
  const user = await prisma.user.create({
    data: {
      email,
      username,
      hash: hashedPassword,
    },
  });

  // Create hot springs
  const hotSpring1 = await prisma.hotSpring.create({
    data: {
      title: "Relaxing Springs",
      description: "A serene hot spring for ultimate relaxation.",
      price: 50,
      location: "Mountain Valley",
      authorId: user.id,
    },
  });

  const hotSpring2 = await prisma.hotSpring.create({
    data: {
      title: "Adventure Spa",
      description: "An adventurous hot spring for thrill-seekers.",
      price: 70,
      location: "Jungle Oasis",
      authorId: user.id,
    },
  });

  const hotSpring3 = await prisma.hotSpring.create({
    data: {
      title: "Tranquil Waters",
      description: "A peaceful hot spring with calming waters.",
      price: 60,
      location: "Lakeside Retreat",
      authorId: user.id,
    },
  });

  // Create reviews
  await prisma.review.createMany({
    data: [
      {
        body: "Amazing experience! Highly recommended.",
        rating: 5,
        hotSpringId: hotSpring1.id,
      },
      {
        body: "Great place for an adventure!",
        rating: 4,
        hotSpringId: hotSpring2.id,
      },
      {
        body: "Peaceful and relaxing atmosphere.",
        rating: 5,
        hotSpringId: hotSpring3.id,
      },
    ],
  });
  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
