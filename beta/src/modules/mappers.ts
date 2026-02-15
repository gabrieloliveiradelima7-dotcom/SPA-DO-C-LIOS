const paymentMethodMap: Record<string, string> = {
  Dinheiro: 'Dinheiro',
  'Cartão de Crédito': 'CartaoCredito',
  'Cartão de Débito': 'CartaoDebito',
  Pix: 'Pix',
  Outro: 'Outro',
};

const paymentMethodReverseMap: Record<string, string> = {
  Dinheiro: 'Dinheiro',
  CartaoCredito: 'Cartão de Crédito',
  CartaoDebito: 'Cartão de Débito',
  Pix: 'Pix',
  Outro: 'Outro',
};

export const toDbPaymentMethod = (value?: string) => (value ? paymentMethodMap[value] : undefined);
export const fromDbPaymentMethod = (value?: string | null) => (value ? paymentMethodReverseMap[value] : undefined);

export const mapClient = (client: any) => ({
  ...client,
  birthday: client.birthday ? client.birthday.toISOString().split('T')[0] : '',
  lastVisit: client.lastVisit ? client.lastVisit.toISOString().split('T')[0] : '',
});

export const mapService = (service: any) => service;

export const mapAppointment = (appointment: any) => ({
  ...appointment,
  dateTime: appointment.dateTime.toISOString(),
  paymentMethod: fromDbPaymentMethod(appointment.paymentMethod),
});

export const mapFinancialRecord = (record: any) => ({
  ...record,
  date: record.date.toISOString().split('T')[0],
});
