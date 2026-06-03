import { create } from 'zustand';
import { JournalEntry, SatInfo } from '../types/accounting';

interface AccountingState {
  entries: JournalEntry[];
  satInfo: SatInfo;
  showCoverPage: boolean;
  addEntry: (entry: JournalEntry) => void;
  updateEntry: (id: string, entry: JournalEntry) => void;
  deleteEntry: (id: string) => void;
  resetToInitial: () => void;
  updateSatInfo: (info: SatInfo) => void;
  setShowCoverPage: (show: boolean) => void;
}

export const initialEntries: JournalEntry[] = [
  {
    id: 'a1',
    date: '2020-12-01',
    type: 'Diario',
    number: 1,
    concept: 'REG. SALDOS INICIALES',
    items: [
      { accountCode: '101.00', accountName: 'CAJA', debit: 25000.00, credit: 0 },
      { accountCode: '102.00', accountName: 'BANCOS', debit: 38500.00, credit: 0 },
      { accountCode: '120.00', accountName: 'ALMACÉN', debit: 710750.00, credit: 0 },
      { accountCode: '104.00', accountName: 'CLIENTES', debit: 12400.00, credit: 0 },
      { accountCode: '106.00', accountName: 'DOCUMENTOS POR COBRAR', debit: 92640.00, credit: 0 },
      { accountCode: '160.00', accountName: 'EQUIPO DE REPARTO', debit: 115000.00, credit: 0 },
      { accountCode: '151.00', accountName: 'TERRENOS', debit: 500000.00, credit: 0 },
      { accountCode: '201.00', accountName: 'PROVEEDORES', debit: 0, credit: 15680.00 },
      { accountCode: '203.00', accountName: 'DOCUMENTOS POR PAGAR', debit: 0, credit: 142000.00 },
      { accountCode: '301.00', accountName: 'CAPITAL SOCIAL', debit: 0, credit: 1336610.00 }
    ]
  },
  {
    id: 'a2',
    date: '2020-12-03',
    type: 'Ingreso',
    number: 1,
    concept: 'REG. VENTAS DE MERCANCÍAS EFECTUADAS',
    items: [
      { accountCode: '102.00', accountName: 'BANCOS', debit: 205000.00, credit: 0 },
      { accountCode: '501.00', accountName: 'COSTO DE VENTAS', debit: 123000.00, credit: 0 },
      { accountCode: '401.00', accountName: 'VENTAS', debit: 0, credit: 205000.00 },
      { accountCode: '120.00', accountName: 'ALMACÉN', debit: 0, credit: 123000.00 }
    ]
  },
  {
    id: 'a3',
    date: '2020-12-05',
    type: 'Egreso',
    number: 1,
    concept: 'REG. REBAJAS Y DESCUENTOS S/VENTAS',
    items: [
      { accountCode: '401.00', accountName: 'VENTAS', debit: 10250.00, credit: 0 },
      { accountCode: '102.00', accountName: 'BANCOS', debit: 0, credit: 10250.00 }
    ]
  },
  {
    id: 'a4',
    date: '2020-12-08',
    type: 'Egreso',
    number: 1,
    concept: 'REG. COMPRAS MERCANCÍAS EFECTUADAS',
    items: [
      { accountCode: '120.00', accountName: 'ALMACÉN', debit: 155000.00, credit: 0 },
      { accountCode: '102.00', accountName: 'BANCOS', debit: 0, credit: 155000.00 }
    ]
  },
  {
    id: 'a5',
    date: '2020-12-10',
    type: 'Ingreso',
    number: 2,
    concept: 'REG. REBAJAS Y DESCUENTOS S/COMPRAS',
    items: [
      { accountCode: '102.00', accountName: 'BANCOS', debit: 6200.00, credit: 0 },
      { accountCode: '120.00', accountName: 'ALMACÉN', debit: 0, credit: 6200.00 }
    ]
  },
  {
    id: 'a6',
    date: '2020-12-12',
    type: 'Egreso',
    number: 2,
    concept: 'REG. GASTOS DE FÁBRICA EFECTUADOS',
    items: [
      { accountCode: '120.00', accountName: 'ALMACÉN', debit: 7000.00, credit: 0 },
      { accountCode: '102.00', accountName: 'BANCOS', debit: 0, credit: 7000.00 }
    ]
  },
  {
    id: 'a7',
    date: '2020-12-15',
    type: 'Diario',
    number: 2,
    concept: 'REG. INTERESES DEVENGADOS A FAVOR',
    items: [
      { accountCode: '101.00', accountName: 'CAJA', debit: 2000.00, credit: 0 },
      { accountCode: '760.00', accountName: 'PRODUCTOS FINANCIEROS', debit: 0, credit: 2000.00 }
    ]
  },
  {
    id: 'a8',
    date: '2020-12-20',
    type: 'Egreso',
    number: 2,
    concept: 'REG. DEVOLUCIONES SOBRE VENTAS',
    items: [
      { accountCode: '401.00', accountName: 'VENTAS', debit: 20000.00, credit: 0 },
      { accountCode: '120.00', accountName: 'ALMACÉN', debit: 12000.00, credit: 0 },
      { accountCode: '102.00', accountName: 'BANCOS', debit: 0, credit: 20000.00 },
      { accountCode: '501.00', accountName: 'COSTO DE VENTAS', debit: 0, credit: 12000.00 }
    ]
  },
  {
    id: 'a9',
    date: '2020-12-28',
    type: 'Diario',
    number: 3,
    concept: 'REG. GASTOS DE OPERACIÓN EFECTUADOS',
    items: [
      { accountCode: '601.00', accountName: 'GASTOS DE VENTA Y DISTRIBUCIÓN', debit: 1925.00, credit: 0 },
      { accountCode: '602.00', accountName: 'GASTOS DE ADMINISTRACIÓN', debit: 1575.00, credit: 0 },
      { accountCode: '203.00', accountName: 'DOCUMENTOS POR PAGAR', debit: 0, credit: 3500.00 }
    ]
  },
  {
    id: 'a10',
    date: '2020-12-28',
    type: 'Ingreso',
    number: 3,
    concept: 'REG. DEVOLUCIONES SOBRE COMPRAS',
    items: [
      { accountCode: '102.00', accountName: 'BANCOS', debit: 11000.00, credit: 0 },
      { accountCode: '120.00', accountName: 'ALMACÉN', debit: 0, credit: 11000.00 }
    ]
  },
  {
    id: 'a11',
    date: '2020-12-28',
    type: 'Egreso',
    number: 3,
    concept: 'REG. GASTOS DE OPERACIÓN EFECTUADOS',
    items: [
      { accountCode: '203.00', accountName: 'DOCUMENTOS POR PAGAR', debit: 3500.00, credit: 0 },
      { accountCode: '102.00', accountName: 'BANCOS', debit: 0, credit: 3500.00 }
    ]
  },
  {
    id: 'aj1',
    date: '2020-12-30',
    type: 'Diario',
    number: 4,
    concept: 'REG. AJUSTE PARA EL RESULTADO EN VENTAS',
    items: [
      { accountCode: '401.00', accountName: 'VENTAS', debit: 111000.00, credit: 0 },
      { accountCode: '501.00', accountName: 'COSTO DE VENTAS', debit: 0, credit: 111000.00 }
    ]
  },
  {
    id: 'aj2',
    date: '2020-12-30',
    type: 'Diario',
    number: 5,
    concept: 'REG. AJUSTE CTAS. RESULTADO ACREEDORAS',
    items: [
      { accountCode: '401.00', accountName: 'VENTAS', debit: 63750.00, credit: 0 },
      { accountCode: '760.00', accountName: 'PRODUCTOS FINANCIEROS', debit: 2000.00, credit: 0 },
      { accountCode: '900.00', accountName: 'PÉRDIDA Y GANANCIAS', debit: 0, credit: 65750.00 }
    ]
  },
  {
    id: 'aj3',
    date: '2020-12-30',
    type: 'Diario',
    number: 6,
    concept: 'REG. AJUSTE CTAS. RESULTADO DEUDORAS',
    items: [
      { accountCode: '900.00', accountName: 'PÉRDIDA Y GANANCIAS', debit: 3500.00, credit: 0 },
      { accountCode: '601.00', accountName: 'GASTOS DE VENTA Y DISTRIBUCIÓN', debit: 0, credit: 1925.00 },
      { accountCode: '602.00', accountName: 'GASTOS DE ADMINISTRACIÓN', debit: 0, credit: 1575.00 }
    ]
  },
  {
    id: 'aj4',
    date: '2020-12-30',
    type: 'Diario',
    number: 7,
    concept: 'REG. AJUSTE P/UTILIDAD ANTES DE IMPTO.',
    items: [
      { accountCode: '900.00', accountName: 'PÉRDIDA Y GANANCIAS', debit: 62250.00, credit: 0 },
      { accountCode: '354.00', accountName: 'UTILIDAD DEL EJERCICIO', debit: 0, credit: 62250.00 }
    ]
  }
];

export const useAccountingStore = create<AccountingState>((set) => ({
  entries: initialEntries,
  satInfo: {
    rfc: 'ZIM-980415G34',
    razonSocial: 'ZITÁCUARO IMPORT',
    domicilioFiscal: 'Av. Revolución Sur #142, Col. C',
    regimenFiscal: '601 - General de Ley Personas Morales',
    ejercicio: '2020',
    metodoInventarios: 'INVENTARIOS PERPETUOS SIN IVA',
    evaluacionValorativa: 'COSTO ADQUISITIVO DEL PERIODO',
    periodoAnalizado: '01/01/2020',
    responsabilidad: 'Dirección de Finanzas',
    ciudadEstado: 'ZITÁCUARO, MICHOACÁN, MÉXICO'
  },
  showCoverPage: true,
  addEntry: (entry) => set((state) => ({ entries: [...state.entries, entry] })),
  updateEntry: (id, updatedEntry) => set((state) => ({
    entries: state.entries.map((entry) => entry.id === id ? updatedEntry : entry)
  })),
  deleteEntry: (id) => set((state) => ({
    entries: state.entries.filter((entry) => entry.id !== id)
  })),
  resetToInitial: () => set({ entries: initialEntries }),
  updateSatInfo: (info) => set({ satInfo: info }),
  setShowCoverPage: (show) => set({ showCoverPage: show }),
}));

