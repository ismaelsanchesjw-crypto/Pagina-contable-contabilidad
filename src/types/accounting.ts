export interface JournalItem {
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  type: 'Diario' | 'Ingreso' | 'Egreso';
  number: number;
  concept: string;
  items: JournalItem[];
}

export interface SatInfo {
  rfc: string;
  razonSocial: string;
  domicilioFiscal: string;
  regimenFiscal: string;
  ejercicio: string;
  metodoInventarios: string;
  evaluacionValorativa: string;
  periodoAnalizado: string;
  responsabilidad: string;
  ciudadEstado: string;
}

export type TabType = 'diario' | 'mayor' | 'resultados' | 'balance' | 'catalogo' | 'impresion';

