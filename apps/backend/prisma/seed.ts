import { PrismaClient, MenuCategory, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Ensure a single Festival exists with id=1 so Store.festivalId default(1) is valid
  // Use raw SQL upsert to avoid depending on generated client types
  await prisma.$executeRaw`
    INSERT INTO "festival" ("id", "name", "description", "start_time", "end_time", "location", "latitude", "longitude")
    VALUES (
      1,
      '성균관대학교',
      '성균관대학교 대동제',
      TIMESTAMPTZ '2025-09-11 00:00:00+09',
      TIMESTAMPTZ '2025-09-12 23:59:59+09',
      '대운동장',
      37.295226,
      126.970964
    )
    ON CONFLICT ("id") DO UPDATE SET
      "name" = EXCLUDED."name",
      "description" = EXCLUDED."description",
      "start_time" = EXCLUDED."start_time",
      "end_time" = EXCLUDED."end_time",
      "location" = EXCLUDED."location",
      "latitude" = EXCLUDED."latitude",
      "longitude" = EXCLUDED."longitude";
  `

  const user1 = await prisma.user.create({
    data: {
      kakaoId: 'kakao_2020123456',
      studentId: '2020123456',
      college: '성균관대학교',
      major: '소프트웨어학과',
      name: '성민규',
      role: Role.OWNER,
    },
  })

  const user2 = await prisma.user.create({
    data: {
      kakaoId: 'kakao_2020456789',
      studentId: '2020456789',
      college: '성균관대학교',
      major: '문헌정보학과',
      name: '방승현',
    },
  })

  const user3 = await prisma.user.create({
    data: {
      kakaoId: 'kakao_2022789012',
      studentId: '2022789012',
      college: '성균관대학교',
      major: '기계공학과',
      name: '신보민',
    },
  })

  const user4 = await prisma.user.create({
    data: {
      kakaoId: 'kakao_2020987654',
      studentId: '2020987654',
      college: '성균관대학교',
      major: '연기예술학과',
      name: '김우주',
    },
  })

  const user5 = await prisma.user.create({
    data: {
      kakaoId: 'kakao_2020777777',
      studentId: '2020777777',
      college: '성균관대학교',
      major: '글로벌경제학과',
      name: '송준혁',
    },
  })

  const store1 = await prisma.store.create({
    data: {
      name: '소주당',
      description: '소주와 안주',
      organizer: '스꾸딩',
      bankCode: '088',
      accountNumber: '1101234567890',
      accountHolder: user1.name,
      ownerId: user1.id,
      imageUrl:
        'https://storage.joodang.com/joodang-assets/public/store/1/main_image.jpg',
      icon: 1,
      contactInfo: '@skkuding',
      startTime: new Date('2026-01-01T18:00:00.000Z'),
      endTime: new Date('2026-01-04T23:00:00.000Z'),
      reservationFee: 10000,
      college: '성균관대학교',
      staffs: {
        create: {
          userId: user1.id,
          role: Role.OWNER,
        },
      },
    } as any,
  })

  const store2 = await prisma.store.create({
    data: {
      name: '맥주당',
      description: '시원한 맥주',
      organizer: '소프트웨어학과',
      bankCode: '088',
      accountNumber: '1101234567891',
      accountHolder: user1.name,
      ownerId: user1.id,
      imageUrl:
        'https://storage.joodang.com/joodang-assets/public/store/2/main_image.jpg',
      latitude: 37.2930059,
      longitude: 126.9748929,
      icon: 2,
      contactInfo: '@skku_software',
      startTime: new Date('2026-01-02T18:00:00.000Z'),
      endTime: new Date('2026-01-03T23:00:00.000Z'),
      reservationFee: 20000,
      college: '성균관대학교',
      staffs: {
        create: {
          userId: user1.id,
          role: Role.OWNER,
        },
      },
    } as any,
  })

  const store3 = await prisma.store.create({
    data: {
      name: '와인당',
      description: '분위기 있는 와인바',
      organizer: '신소재공학부',
      bankCode: '088',
      accountNumber: '1101234567892',
      accountHolder: user1.name,
      ownerId: user1.id,
      latitude: 37.2928959,
      longitude: 126.9745929,
      icon: 3,
      contactInfo: '@skku_amse',
      startTime: new Date('2026-01-03T17:00:00.000Z'),
      endTime: new Date('2026-01-03T22:00:00.000Z'),
      reservationFee: 15000,
      college: '성균관대학교',
      staffs: {
        create: {
          userId: user1.id,
          role: Role.OWNER,
        },
      },
    } as any,
  })

  const store4 = await prisma.store.create({
    data: {
      name: '치킨이당',
      description: '바삭한 치킨과 맥주',
      organizer: '전자전기공학부',
      bankCode: '088',
      accountNumber: '1101234567893',
      accountHolder: user1.name,
      ownerId: user1.id,
      imageUrl:
        'https://storage.joodang.com/joodang-assets/public/store/4/main_image.jpg',
      latitude: 37.295226,
      longitude: 126.970964,
      icon: 4,
      contactInfo: '@skku_electrical',
      startTime: new Date('2026-01-04T18:00:00.000Z'),
      endTime: new Date('2026-01-04T23:00:00.000Z'),
      reservationFee: 12000,
      college: '성균관대학교',
      staffs: {
        create: {
          userId: user1.id,
          role: Role.OWNER,
        },
      },
    } as any,
  })

  const store5 = await prisma.store.create({
    data: {
      name: 'SnackBar',
      description: '과자와 음료가 가득한 스낵바',
      organizer: '화학과',
      bankCode: '088',
      accountNumber: '1101234567894',
      accountHolder: user1.name,
      ownerId: user1.id,
      icon: 5,
      contactInfo: '010-1234-5678',
      startTime: new Date('2026-01-05T18:00:00.000Z'),
      endTime: new Date('2026-01-05T23:00:00.000Z'),
      reservationFee: 5000,
      college: '성균관대학교',
      staffs: {
        create: {
          userId: user1.id,
          role: Role.OWNER,
        },
      },
    } as any,
  })

  await prisma.menu.createMany({
    data: [
      {
        name: '젤리',
        price: 3000,
        storeId: store1.id,
        category: MenuCategory.Fruit,
      },
      {
        name: '과자',
        price: 3000,
        storeId: store1.id,
        category: MenuCategory.Maroon5,
      },
    ],
  })

  const store1Slots = await prisma.$transaction([
    prisma.timeSlot.create({
      data: {
        startTime: new Date('2026-01-01T18:00:00.000Z'),
        endTime: new Date('2026-01-01T20:00:00.000Z'),
        totalCapacity: 30,
        availableSeats: 30,
        storeId: store1.id,
      },
    }),
    prisma.timeSlot.create({
      data: {
        startTime: new Date('2026-01-02T18:00:00.000Z'),
        endTime: new Date('2026-01-02T20:00:00.000Z'),
        totalCapacity: 30,
        availableSeats: 30,
        storeId: store1.id,
      },
    }),
    prisma.timeSlot.create({
      data: {
        startTime: new Date('2026-01-03T20:00:00.000Z'),
        endTime: new Date('2026-01-03T22:00:00.000Z'),
        totalCapacity: 30,
        availableSeats: 30,
        storeId: store1.id,
      },
    }),
    prisma.timeSlot.create({
      data: {
        startTime: new Date('2026-01-04T20:00:00.000Z'),
        endTime: new Date('2026-01-04T22:00:00.000Z'),
        totalCapacity: 30,
        availableSeats: 30,
        storeId: store1.id,
      },
    }),
  ])

  const store2Slots = await prisma.$transaction([
    prisma.timeSlot.create({
      data: {
        startTime: new Date('2026-01-02T18:00:00.000Z'),
        endTime: new Date('2026-01-02T20:00:00.000Z'),
        totalCapacity: 30,
        availableSeats: 30,
        storeId: store2.id,
      },
    }),
    prisma.timeSlot.create({
      data: {
        startTime: new Date('2026-01-02T20:00:00.000Z'),
        endTime: new Date('2026-01-02T22:00:00.000Z'),
        totalCapacity: 30,
        availableSeats: 30,
        storeId: store2.id,
      },
    }),
    prisma.timeSlot.create({
      data: {
        startTime: new Date('2026-01-03T18:00:00.000Z'),
        endTime: new Date('2026-01-03T20:00:00.000Z'),
        totalCapacity: 30,
        availableSeats: 30,
        storeId: store2.id,
      },
    }),
    prisma.timeSlot.create({
      data: {
        startTime: new Date('2026-01-03T20:00:00.000Z'),
        endTime: new Date('2026-01-03T22:00:00.000Z'),
        totalCapacity: 30,
        availableSeats: 30,
        storeId: store2.id,
      },
    }),
  ])

  await prisma.$transaction([
    prisma.reservation.create({
      data: {
        reservationNum: 1,
        headcount: 2,
        phone: '12345678',
        userId: user2.id,
        storeId: store1.id,
        timeSlotId: store1Slots[0].id,
      } as any,
    }),
    prisma.timeSlot.update({
      where: { id: store1Slots[0].id },
      data: { availableSeats: { decrement: 2 } },
    }),

    prisma.reservation.create({
      data: {
        reservationNum: 2,
        headcount: 3,
        phone: '12345678',
        userId: user3.id,
        storeId: store1.id,
        timeSlotId: store1Slots[0].id,
      } as any,
    }),
    prisma.timeSlot.update({
      where: { id: store1Slots[0].id },
      data: { availableSeats: { decrement: 3 } },
    }),

    prisma.reservation.create({
      data: {
        reservationNum: 3,
        headcount: 2,
        phone: '12345678',
        userId: user4.id,
        storeId: store1.id,
        timeSlotId: store1Slots[0].id,
      } as any,
    }),
    prisma.timeSlot.update({
      where: { id: store1Slots[0].id },
      data: { availableSeats: { decrement: 2 } },
    }),

    prisma.reservation.create({
      data: {
        reservationNum: 4,
        headcount: 3,
        phone: '12345678',
        userId: user5.id,
        storeId: store1.id,
        timeSlotId: store1Slots[0].id,
      } as any,
    }),
    prisma.timeSlot.update({
      where: { id: store1Slots[0].id },
      data: { availableSeats: { decrement: 3 } },
    }),
  ])

  await prisma.$transaction([
    prisma.reservation.create({
      data: {
        reservationNum: 1,
        headcount: 2,
        phone: '12345678',
        userId: user2.id,
        storeId: store2.id,
        timeSlotId: store2Slots[0].id,
      } as any,
    }),
    prisma.timeSlot.update({
      where: { id: store2Slots[0].id },
      data: { availableSeats: { decrement: 2 } },
    }),

    prisma.reservation.create({
      data: {
        reservationNum: 2,
        headcount: 4,
        phone: '12345678',
        userId: user3.id,
        storeId: store2.id,
        timeSlotId: store2Slots[0].id,
      } as any,
    }),
    prisma.timeSlot.update({
      where: { id: store2Slots[0].id },
      data: { availableSeats: { decrement: 4 } },
    }),

    prisma.reservation.create({
      data: {
        reservationNum: 3,
        headcount: 2,
        phone: '12345678',
        userId: user4.id,
        storeId: store2.id,
        timeSlotId: store2Slots[0].id,
      } as any,
    }),
    prisma.timeSlot.update({
      where: { id: store2Slots[0].id },
      data: { availableSeats: { decrement: 2 } },
    }),

    prisma.reservation.create({
      data: {
        reservationNum: 4,
        headcount: 4,
        phone: '12345678',
        userId: user5.id,
        storeId: store2.id,
        timeSlotId: store2Slots[0].id,
      } as any,
    }),
    prisma.timeSlot.update({
      where: { id: store2Slots[0].id },
      data: { availableSeats: { decrement: 4 } },
    }),
  ])
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
