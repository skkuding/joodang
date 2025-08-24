import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const store1 = await prisma.store.create({
    data: {
      name: 'SoJoodang',
      description: '소주당',
      phone: '010-1234-5678',
      organizer: '스꾸딩',
      instagramId: 'skkuding',
      startTime: new Date('2026-01-01T00:00:00.000Z'),
      endTime: new Date('2026-01-01T12:00:00.000Z'),
      reservationFee: 10000,
      college: '성균관대학교',
    },
  })

  const store2 = await prisma.store.create({
    data: {
      name: 'MaekJoodang',
      description: '맥주당',
      phone: '010-1234-5678',
      organizer: '소프트웨어학과',
      instagramId: 'skku_software',
      startTime: new Date('2026-01-02T00:00:00.000Z'),
      endTime: new Date('2026-01-02T12:00:00.000Z'),
      reservationFee: 20000,
      college: '성균관대학교',
    },
  })

  await prisma.menu.createMany({
    data: [
      {
        name: '떡볶이',
        price: 8000,
        storeId: store1.id,
      },
      {
        name: '치킨',
        price: 12000,
        storeId: store1.id,
      },
    ],
  })

  await prisma.menu.createMany({
    data: [
      {
        name: '젤리',
        price: 3000,
        storeId: store2.id,
      },
      {
        name: '과자',
        price: 3000,
        storeId: store2.id,
      },
    ],
  })

  const user1 = await prisma.user.create({
    data: {
      studentId: '2020123456',
      college: '성균관대학교',
      major: '소프트웨어학과',
      name: '성민규',
    },
  })

  const timeSlot1 = await prisma.timeSlot.create({
    data: {
      startTime: new Date('2026-01-01T00:00:00.000Z'),
      endTime: new Date('2026-01-01T02:00:00.000Z'),
      totalCapacity: 30,
      availableSeats: 30,
      storeId: store1.id,
    },
  })

  const timeSlot2 = await prisma.timeSlot.create({
    data: {
      startTime: new Date('2026-01-01T00:00:00.000Z'),
      endTime: new Date('2026-01-01T02:00:00.000Z'),
      totalCapacity: 30,
      availableSeats: 30,
      storeId: store1.id,
    },
  })

  await prisma.reservation.create({
    data: {
      headcount: 2,
      userId: user1.id,
      storeId: store1.id,
      timeSlotId: timeSlot1.id,
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
