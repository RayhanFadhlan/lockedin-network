import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  await prisma.connection.deleteMany({});
  await prisma.connectionRequest.deleteMany({});
  await prisma.feed.deleteMany({});
  await prisma.chat.deleteMany({});
  await prisma.pushSubscription.deleteMany({});
  await prisma.user.deleteMany({});

  const password = "admin123";
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      username: "admin123",
      email: "admin123@gmail.com",
      password_hash: hashedPassword,
      name: "Admin123",
      profile_photo: faker.image.avatar(),
      skills: faker.lorem.words(3),
      work_history: faker.lorem.sentence(),
    },
  });

  const users = [];
  for (let i = 0; i < 50; i++) {
    const user = await prisma.user.create({
      data: {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password_hash: hashedPassword,
        name: faker.person.fullName(),
        profile_photo: faker.image.avatar(),
        skills: faker.lorem.words(3),
        work_history: faker.lorem.sentence(),
      },
    });
    users.push(user);
  }

  const connectionPairs = new Set<string>();

  for (const user of users) {
    const otherUsers = users.filter((u) => u.id !== user.id);
    const connectUsers = faker.helpers.arrayElements(otherUsers, 20);

    for (const connectUser of connectUsers) {
      const pairKey1 = `${user.id}-${connectUser.id}`;
      const pairKey2 = `${connectUser.id}-${user.id}`;

      if (!connectionPairs.has(pairKey1) && !connectionPairs.has(pairKey2)) {
        const timestamp = faker.date.past();
        await prisma.$transaction([
          prisma.connection.create({
            data: {
              from_id: user.id,
              to_id: connectUser.id,
              created_at: timestamp,
            },
          }),
          prisma.connection.create({
            data: {
              from_id: connectUser.id,
              to_id: user.id,
              created_at: timestamp,
            },
          }),
        ]);

        connectionPairs.add(pairKey1);
        connectionPairs.add(pairKey2);
      }
    }
  }

  for (const user of users) {
    const otherUsers = users.filter((u) => u.id !== user.id);
    const availableUsers = otherUsers.filter(
      (u) =>
        !connectionPairs.has(`${user.id}-${u.id}`) &&
        !connectionPairs.has(`${u.id}-${user.id}`)
    );

    const requestUsers = faker.helpers.arrayElements(availableUsers, 15);

    for (const requestUser of requestUsers) {
      await prisma.connectionRequest.create({
        data: {
          from_id: requestUser.id,
          to_id: user.id,
          created_at: faker.date.past(),
        },
      });
    }
  }

  const allFeeds = [];
  const now = new Date();

  for (const [i, user] of users.entries()) {
    for (let index = 0; index < 10; index++) {
      const date = new Date(now.getTime() - (i*10 + index) * 24 * 60 * 60 * 1000);
      allFeeds.push({
        content: faker.lorem.paragraph(),
        user_id: user.id,
        created_at: date,
        updated_at: date,
      });
    }
  }

  
  allFeeds.sort((a, b) => a.created_at.getTime() - b.created_at.getTime());


  for (const feed of allFeeds) {
    await prisma.feed.create({
      data: feed,
    });
  }

  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
