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


  const password = 'admin123'
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
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password_hash: hashedPassword,
        name: faker.name.fullName(),
        profile_photo: faker.image.avatar(),
        skills: faker.lorem.words(3),
        work_history: faker.lorem.sentence(),
      },
    });
    users.push(user);
  }


  for (let i = 0; i < 20; i++) {
    const fromUser = faker.helpers.arrayElement(users);
    const toUser = faker.helpers.arrayElement(users.filter(user => user.id !== fromUser.id));

    const existingConnection = await prisma.connection.findFirst({
      where: {
        OR: [
          { from_id: fromUser.id, to_id: toUser.id },
          { from_id: toUser.id, to_id: fromUser.id },
        ],
      },
    });

    
    const existingRequest = await prisma.connectionRequest.findFirst({
      where: {
        from_id: fromUser.id,
        to_id: toUser.id,
      },
    });

    if (!existingConnection && !existingRequest) {
      await prisma.connectionRequest.create({
        data: {
          from_id: fromUser.id,
          to_id: toUser.id,
          created_at: faker.date.past(),
        },
      });
    }
  }


  for (let i = 0; i < 5; i++) {
    const fromUser = faker.helpers.arrayElement(users);
    const toUser = faker.helpers.arrayElement(users.filter(user => user.id !== fromUser.id));

    const existingConnection = await prisma.connection.findFirst({
      where: {
        OR: [
          { from_id: fromUser.id, to_id: toUser.id },
          { from_id: toUser.id, to_id: fromUser.id },
        ],
      },
    });

    if (!existingConnection) {
      await prisma.connection.create({
        data: {
          from_id: fromUser.id,
          to_id: toUser.id,
          created_at: faker.date.past(),
        },
      });

    
      await prisma.connection.create({
        data: {
          from_id: toUser.id,
          to_id: fromUser.id,
          created_at: faker.date.past(),
        },
      });
    }
  }
  for (let i = 0; i < 20; i++) {
    const user = faker.helpers.arrayElement(users);
    await prisma.feed.create({
      data: {
        content: faker.lorem.paragraph(),
        user_id: user.id,
        created_at: faker.date.past(),
      },
    });
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