import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {

  await prisma.connection.deleteMany({});
  await prisma.connectionRequest.deleteMany({});
  await prisma.feed.deleteMany({});
  await prisma.chat.deleteMany({});
  await prisma.pushSubscription.deleteMany({});
  await prisma.user.deleteMany({});


  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      username: 'admin123',
      email: 'admin123@gmail.com',
      password_hash: hashedPassword,
      name: 'Admin123',
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

 
  for (const user of users) {
    const otherUsers = users.filter(u => u.id !== user.id);
    const connectUsers = faker.helpers.arrayElements(otherUsers, 20);
    
    for (const connectUser of connectUsers) {
      const existingConnection = await prisma.connection.findFirst({
        where: {
          OR: [
            { from_id: user.id, to_id: connectUser.id },
            { from_id: connectUser.id, to_id: user.id },
          ],
        },
      });

      if (!existingConnection) {
        await prisma.connection.create({
          data: {
            from_id: user.id,
            to_id: connectUser.id,
            created_at: faker.date.past(),
          },
        });
      }
    }
  }

 
  for (const user of users) {
    const otherUsers = users.filter(u => u.id !== user.id);
    const requestUsers = faker.helpers.arrayElements(
      otherUsers.filter(async (u) => {
        const existingConnection = await prisma.connection.findFirst({
          where: {
            OR: [
              { from_id: user.id, to_id: u.id },
              { from_id: u.id, to_id: user.id },
            ],
          },
        });
        return !existingConnection;
      }),
      15
    );

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


  for (const user of users) {
    await Promise.all(
      Array(10).fill(0).map(() =>
        prisma.feed.create({
          data: {
            content: faker.lorem.paragraph(),
            user_id: user.id,
            created_at: faker.date.past(),
          },
        })
      )
    );
  }

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });