import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.financialRecord.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.client.deleteMany();
  await prisma.service.deleteMany();
  await prisma.professional.deleteMany();

  const [p1, p2, p3] = await Promise.all([
    prisma.professional.create({ data: { name: 'Luciana M.', role: 'Senior Hair Stylist', commission: 0.5, rating: 4.9, active: true } }),
    prisma.professional.create({ data: { name: 'Mariana G.', role: 'Manicure Master', commission: 0.6, rating: 4.8, active: true } }),
    prisma.professional.create({ data: { name: 'Juliana R.', role: 'Esthetics Expert', commission: 0.5, rating: 5.0, active: true } }),
  ]);

  const [s1, s2] = await Promise.all([
    prisma.service.create({ data: { name: 'Premium Haircut', price: 150, duration: 60, category: 'Hair' } }),
    prisma.service.create({ data: { name: 'Gel Nails Refill', price: 120, duration: 90, category: 'Nails' } }),
  ]);

  const [c1, c2] = await Promise.all([
    prisma.client.create({ data: { name: 'Adriana Silva', phone: '11999999999', email: 'adriana@email.com', birthday: new Date('1990-05-15'), totalSpent: 1250, loyaltyPoints: 450, isVIP: true, status: 'Active', preferences: ['Warm blond', 'Gel nails'], visitCount: 8 } }),
    prisma.client.create({ data: { name: 'Beatriz Costa', phone: '11888888888', email: 'beatriz@email.com', birthday: new Date('1985-10-02'), totalSpent: 340, loyaltyPoints: 120, isVIP: false, status: 'Active', preferences: ['Short cut'], visitCount: 3 } }),
  ]);

  await prisma.appointment.create({
    data: {
      clientId: c1.id,
      professionalId: p1.id,
      serviceId: s1.id,
      dateTime: new Date(),
      duration: 60,
      status: 'Scheduled',
      totalPrice: 150,
    },
  });

  await prisma.appointment.create({
    data: {
      clientId: c2.id,
      professionalId: p2.id,
      serviceId: s2.id,
      dateTime: new Date(Date.now() + 3600_000),
      duration: 90,
      status: 'Scheduled',
      totalPrice: 120,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
