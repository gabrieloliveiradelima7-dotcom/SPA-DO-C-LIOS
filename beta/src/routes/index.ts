import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { generateMarketingCampaign } from '../modules/ai.js';
import { fromDbPaymentMethod, mapAppointment, mapClient, mapFinancialRecord, mapService, toDbPaymentMethod } from '../modules/mappers.js';
import { AppointmentPayload, ClientPayload, FinancialRecordPayload, ServicePayload } from '../types/contracts.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

router.get('/professionals', async (_req, res) => {
  const professionals = await prisma.professional.findMany({ orderBy: { createdAt: 'asc' } });
  res.json(professionals);
});

router.get('/clients', async (_req, res) => {
  const clients = await prisma.client.findMany({ orderBy: { createdAt: 'asc' } });
  res.json(clients.map(mapClient));
});

router.post('/clients', async (req, res) => {
  const body = req.body as ClientPayload;
  const client = await prisma.client.create({
    data: {
      name: body.name,
      phone: body.phone,
      email: body.email,
      birthday: body.birthday ? new Date(body.birthday) : null,
      totalSpent: body.totalSpent ?? 0,
      lastVisit: body.lastVisit ? new Date(body.lastVisit) : null,
      loyaltyPoints: body.loyaltyPoints ?? 0,
      isVIP: body.isVIP ?? false,
      status: body.status ?? 'Active',
      preferences: body.preferences ?? [],
      avatar: body.avatar,
      visitCount: body.visitCount ?? 0,
    },
  });
  res.status(201).json(mapClient(client));
});

router.put('/clients/:id', async (req, res) => {
  const body = req.body as ClientPayload;
  const client = await prisma.client.update({
    where: { id: req.params.id },
    data: {
      name: body.name,
      phone: body.phone,
      email: body.email,
      birthday: body.birthday ? new Date(body.birthday) : null,
      totalSpent: body.totalSpent ?? 0,
      lastVisit: body.lastVisit ? new Date(body.lastVisit) : null,
      loyaltyPoints: body.loyaltyPoints ?? 0,
      isVIP: body.isVIP ?? false,
      status: body.status ?? 'Active',
      preferences: body.preferences ?? [],
      avatar: body.avatar,
      visitCount: body.visitCount ?? 0,
    },
  });
  res.json(mapClient(client));
});

router.delete('/clients/:id', async (req, res) => {
  await prisma.client.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

router.get('/services', async (_req, res) => {
  const services = await prisma.service.findMany({ orderBy: { createdAt: 'asc' } });
  res.json(services.map(mapService));
});

router.post('/services', async (req, res) => {
  const body = req.body as ServicePayload;
  const service = await prisma.service.create({ data: body });
  res.status(201).json(mapService(service));
});

router.put('/services/:id', async (req, res) => {
  const body = req.body as ServicePayload;
  const service = await prisma.service.update({ where: { id: req.params.id }, data: body });
  res.json(mapService(service));
});

router.delete('/services/:id', async (req, res) => {
  await prisma.service.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

router.get('/appointments', async (_req, res) => {
  const appointments = await prisma.appointment.findMany({ orderBy: { dateTime: 'asc' } });
  res.json(appointments.map(mapAppointment));
});

router.post('/appointments', async (req, res) => {
  const body = req.body as AppointmentPayload;
  const appointment = await prisma.appointment.create({
    data: {
      ...body,
      dateTime: new Date(body.dateTime),
      paymentMethod: toDbPaymentMethod(body.paymentMethod) as any,
    },
  });
  res.status(201).json(mapAppointment(appointment));
});

router.put('/appointments/:id', async (req, res) => {
  const body = req.body as AppointmentPayload;
  const appointment = await prisma.appointment.update({
    where: { id: req.params.id },
    data: {
      ...body,
      dateTime: new Date(body.dateTime),
      paymentMethod: toDbPaymentMethod(body.paymentMethod) as any,
    },
  });

  if (appointment.status === 'Completed') {
    const finalAmount = appointment.totalPrice - (appointment.discount ?? 0);
    await prisma.financialRecord.upsert({
      where: { id: `rev-${appointment.id}` },
      update: {
        date: new Date(),
        type: 'Income',
        category: 'Serviço',
        amount: finalAmount,
        description: `Checkout: ${appointment.id} (${fromDbPaymentMethod(appointment.paymentMethod)})`,
      },
      create: {
        id: `rev-${appointment.id}`,
        appointmentId: appointment.id,
        date: new Date(),
        type: 'Income',
        category: 'Serviço',
        amount: finalAmount,
        description: `Checkout: ${appointment.id} (${fromDbPaymentMethod(appointment.paymentMethod)})`,
      },
    });

    if (appointment.clientId) {
      await prisma.client.update({
        where: { id: appointment.clientId },
        data: {
          visitCount: { increment: 1 },
          totalSpent: { increment: finalAmount },
          loyaltyPoints: { increment: Math.floor(finalAmount / 10) },
          lastVisit: new Date(),
        },
      });
    }
  }

  res.json(mapAppointment(appointment));
});

router.get('/financial-records', async (_req, res) => {
  const records = await prisma.financialRecord.findMany({ orderBy: { date: 'desc' } });
  res.json(records.map(mapFinancialRecord));
});

router.post('/financial-records', async (req, res) => {
  const body = req.body as FinancialRecordPayload;
  const record = await prisma.financialRecord.create({
    data: {
      date: new Date(body.date),
      type: body.type,
      category: body.category,
      costType: body.costType,
      amount: body.amount,
      description: body.description,
      appointmentId: body.appointmentId,
    },
  });
  res.status(201).json(mapFinancialRecord(record));
});

router.put('/financial-records/:id', async (req, res) => {
  const body = req.body as FinancialRecordPayload;
  const record = await prisma.financialRecord.update({
    where: { id: req.params.id },
    data: {
      date: new Date(body.date),
      type: body.type,
      category: body.category,
      costType: body.costType,
      amount: body.amount,
      description: body.description,
      appointmentId: body.appointmentId,
    },
  });
  res.json(mapFinancialRecord(record));
});

router.delete('/financial-records/:id', async (req, res) => {
  await prisma.financialRecord.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

router.post('/ai/marketing-message', async (req, res) => {
  const { clientName, recentService, promoType } = req.body as { clientName: string; recentService: string; promoType: 'loyalty' | 're-engagement' | 'birthday' };
  const text = await generateMarketingCampaign(clientName, recentService, promoType);
  res.json({ text });
});

export default router;
