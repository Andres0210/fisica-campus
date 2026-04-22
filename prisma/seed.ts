import { PrismaClient } from "@prisma/client";
import { seedCourses, seedResources, seedTopics, seedUsers } from "./seed-data";

const prisma = new PrismaClient();

async function main() {
  await prisma.announcement.deleteMany();
  await prisma.simulation.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({ data: seedUsers });
  await prisma.course.createMany({ data: seedCourses });
  await prisma.topic.createMany({ data: seedTopics });
  await prisma.resource.createMany({ data: seedResources });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
