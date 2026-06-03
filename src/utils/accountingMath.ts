import { JournalEntry, JournalItem } from '../types/accounting';

export interface LedgerMovement {
  date: string;
  concept: string;
  entryType: 'Diario' | 'Ingreso' | 'Egreso';
  entryNumber: number;
  amount: number;
  entryId: string;
}

export interface LedgerAccount {
  code: string;
  name: string;
  debits: LedgerMovement[];
  credits: LedgerMovement[];
  totalDebit: number;
  totalCredit: number;
  debitBalance: number;
  creditBalance: number;
}

/**
 * Computes all T-accounts (Ledger / Esquemas de Mayor) dynamically.
 * Can filter to exclude adjustment entries to see operations, or include all.
 */
export function calculateLedger(
  entries: JournalEntry[],
  excludeAdjustments = false
): Record<string, LedgerAccount> {
  const ledger: Record<string, LedgerAccount> = {};

  // Sort entries chronologically to ensure transactions are in order
  const sortedEntries = [...entries].sort((a, b) => a.date.localeCompare(b.date));

  for (const entry of sortedEntries) {
    // If we exclude adjustment entries (e.g. for operating Income Statement etc.)
    if (excludeAdjustments && entry.id.startsWith('aj')) {
      continue;
    }

    for (const item of entry.items) {
      const code = item.accountCode;
      if (!ledger[code]) {
        ledger[code] = {
          code,
          name: item.accountName,
          debits: [],
          credits: [],
          totalDebit: 0,
          totalCredit: 0,
          debitBalance: 0,
          creditBalance: 0,
        };
      }

      const movement: LedgerMovement = {
        date: entry.date,
        concept: entry.concept,
        entryType: entry.type,
        entryNumber: entry.number,
        amount: item.debit > 0 ? item.debit : item.credit,
        entryId: entry.id,
      };

      if (item.debit > 0) {
        ledger[code].debits.push(movement);
        ledger[code].totalDebit += item.debit;
      } else if (item.credit > 0) {
        ledger[code].credits.push(movement);
        ledger[code].totalCredit += item.credit;
      }
    }
  }

  // Calculate balances for each account
  for (const code in ledger) {
    const acc = ledger[code];
    if (acc.totalDebit > acc.totalCredit) {
      acc.debitBalance = acc.totalDebit - acc.totalCredit;
      acc.creditBalance = 0;
    } else if (acc.totalCredit > acc.totalDebit) {
      acc.creditBalance = acc.totalCredit - acc.totalDebit;
      acc.debitBalance = 0;
    } else {
      acc.debitBalance = 0;
      acc.creditBalance = 0;
    }
  }

  return ledger;
}

export interface IncomeStatement {
  ventasBrutas: number;
  rebajasVentas: number;
  devolucionesVentas: number;
  ventasNetas: number;
  costoVentas: number;
  utilidadBruto: number;
  gastosVenta: number;
  gastosAdmin: number;
  utilidadOperacion: number;
  productosFinancieros: number;
  utilidadNeta: number;
}

/**
 * Calculates the Income Statement from entries.
 * Note: Since closing adjustments 'aj1' through 'aj4' formalize the transfer 
 * of result accounts to 0, typical financial reporting reflects balances PRE-closing.
 * We extract results dynamically from operating entries.
 */
export function calculateIncomeStatement(entries: JournalEntry[]): IncomeStatement {
  // We get ledger of operating entries (excluding adjustments)
  const ledger = calculateLedger(entries, true);

  // 1. Ventas (401.00)
  // Let's get credit balance of 401.00 as gross ventas
  const salesAcc = ledger['401.00'];
  // We want to distinguish standard sales credits from sales discounts/returns
  // Ventas (401.00) credits are Gross Sales
  const ventasBrutas = salesAcc ? salesAcc.totalCredit : 0;

  // Let's see the debits to 401.00:
  // Rebajas s/ventas from entry a3: debit of 401.00
  // Devoluciones s/ventas from entry a8: debit of 401.00
  let rebajasVentas = 0;
  let devolucionesVentas = 0;

  if (salesAcc) {
    for (const mov of salesAcc.debits) {
      if (mov.concept.includes('REBAJAS') || mov.concept.includes('DESCUENTOS')) {
        rebajasVentas += mov.amount;
      } else if (mov.concept.includes('DEVOLUCIONES')) {
        devolucionesVentas += mov.amount;
      } else {
        // Fallback split in case of additions
        rebajasVentas += mov.amount;
      }
    }
  }

  const ventasNetas = ventasBrutas - rebajasVentas - devolucionesVentas;

  // 2. Costo de ventas (501.00)
  const costAcc = ledger['501.00'];
  // It has debits (costs) and potentially credits (returns e.g. entry a8)
  const costoVentas = costAcc ? (accDebitNet(costAcc)) : 0;

  const utilidadBruto = ventasNetas - costoVentas;

  // 3. Gastos de venta (601.00)
  const expensesVentaAcc = ledger['601.00'];
  const gastosVenta = expensesVentaAcc ? accDebitNet(expensesVentaAcc) : 0;

  // 4. Gastos de administración (602.00)
  const expensesAdminAcc = ledger['602.00'];
  const gastosAdmin = expensesAdminAcc ? accDebitNet(expensesAdminAcc) : 0;

  const utilidadOperacion = utilidadBruto - (gastosVenta + gastosAdmin);

  // 5. Productos Financieros (760.00)
  const prodFinAcc = ledger['760.00'];
  const productosFinancieros = prodFinAcc ? accCreditNet(prodFinAcc) : 0;

  const utilidadNeta = utilidadOperacion + productosFinancieros;

  return {
    ventasBrutas,
    rebajasVentas,
    devolucionesVentas,
    ventasNetas,
    costoVentas,
    utilidadBruto,
    gastosVenta,
    gastosAdmin,
    utilidadOperacion,
    productosFinancieros,
    utilidadNeta
  };
}

// Helpers
function accDebitNet(acc: LedgerAccount): number {
  return acc.totalDebit - acc.totalCredit;
}

function accCreditNet(acc: LedgerAccount): number {
  return acc.totalCredit - acc.totalDebit;
}

export interface BalanceSheetCategory {
  title: string;
  accounts: { code: string; name: string; balance: number }[];
  total: number;
}

export interface BalanceSheet {
  activoCirculante: BalanceSheetCategory;
  activoNoCirculante: BalanceSheetCategory;
  totalActivo: number;
  pasivoCortoPlazo: BalanceSheetCategory;
  pasivoLargoPlazo: BalanceSheetCategory;
  totalPasivo: number;
  capitalContable: BalanceSheetCategory;
  totalCapital: number;
  totalPasivoYCapital: number;
  isBalanced: boolean;
  discrepancy: number;
}

/**
 * Calculates Balance Sheet based on final balances (post-closing adjustments).
 * Since closing adjustments wipe results accounts, we can calculate active ledger containing all entries.
 * Then we classify:
 * Activo: codes starting with 1.
 * Pasivo: codes starting with 2.
 * Capital: codes starting with 3.
 * We inject Utilidad del Ejercicio dynamically into Capital Contable if it's not present as a separate account
 * balance, or use account 354.00 which gets written during closing aj4.
 */
export function calculateBalanceSheet(entries: JournalEntry[]): BalanceSheet {
  // Generate active ledger of ALL entries
  const ledger = calculateLedger(entries, false);

  const activeAccounts = Object.values(ledger).filter(
    (acc) => acc.debitBalance > 0 || acc.creditBalance > 0
  );

  const activoCirculanteAccounts: { code: string; name: string; balance: number }[] = [];
  const activoNoCirculanteAccounts: { code: string; name: string; balance: number }[] = [];

  const pasivoCortoPlazoAccounts: { code: string; name: string; balance: number }[] = [];
  const pasivoLargoPlazoAccounts: { code: string; name: string; balance: number }[] = [];

  const capitalAccounts: { code: string; name: string; balance: number }[] = [];

  // Grouping criteria
  // Circulante rules (Caja 101, Bancos 102, Almacén 120, Clientes 104, Documentos por Cobrar 106)
  // No Circulante (Equipo de reparto 160, Terrenos 151)
  // Pasivo Corto (Proveedores 201, Documentos por Pagar 203)
  // Capital (Capital Social 301, Utilidad del Ejercicio 354)
  for (const acc of activeAccounts) {
    const code = acc.code;
    const balance = acc.debitBalance > 0 ? acc.debitBalance : acc.creditBalance;

    if (code.startsWith('1')) {
      // Activos
      // Standard subcategories
      const circCodes = ['101.00', '102.00', '104.00', '120.00', '106.00'];
      if (circCodes.includes(code) || parseInt(code.substring(1, 3)) < 50) {
        activoCirculanteAccounts.push({ code, name: acc.name, balance });
      } else {
        activoNoCirculanteAccounts.push({ code, name: acc.name, balance });
      }
    } else if (code.startsWith('2')) {
      // Pasivo
      if (parseInt(code.substring(1, 3)) < 50) {
        pasivoCortoPlazoAccounts.push({ code, name: acc.name, balance });
      } else {
        pasivoLargoPlazoAccounts.push({ code, name: acc.name, balance });
      }
    } else if (code.startsWith('3')) {
      // Capital
      capitalAccounts.push({ code, name: acc.name, balance });
    }
  }

  // Double check if account 354.00 is in activeAccounts.
  // If the user deleted the closing entries, or they didn't run aj4,
  // we must INJECT the dynamic utility calculated from Income Statement into capital.
  const hasUtilidadAccount = capitalAccounts.some((acc) => acc.code === '354.00');
  let dynamicUtilidad = 0;
  if (!hasUtilidadAccount) {
    const incomeStatement = calculateIncomeStatement(entries);
    dynamicUtilidad = incomeStatement.utilidadNeta;
    if (dynamicUtilidad !== 0) {
      capitalAccounts.push({
        code: '354.00',
        name: 'UTILIDAD DEL EJERCICIO (DETERMINADA)',
        balance: Math.abs(dynamicUtilidad)
      });
    }
  }

  // Sort them for presentation
  const sortByCode = (a: any, b: any) => a.code.localeCompare(b.code);
  activoCirculanteAccounts.sort(sortByCode);
  activoNoCirculanteAccounts.sort(sortByCode);
  pasivoCortoPlazoAccounts.sort(sortByCode);
  pasivoLargoPlazoAccounts.sort(sortByCode);
  capitalAccounts.sort(sortByCode);

  const totalActivoCirculante = activoCirculanteAccounts.reduce((sum, item) => sum + item.balance, 0);
  const totalActivoNoCirculante = activoNoCirculanteAccounts.reduce((sum, item) => sum + item.balance, 0);
  const totalActivo = totalActivoCirculante + totalActivoNoCirculante;

  const totalPasivoCortoPlazo = pasivoCortoPlazoAccounts.reduce((sum, item) => sum + item.balance, 0);
  const totalPasivoLargoPlazo = pasivoLargoPlazoAccounts.reduce((sum, item) => sum + item.balance, 0);
  const totalPasivo = totalPasivoCortoPlazo + totalPasivoLargoPlazo;

  const totalCapital = capitalAccounts.reduce((sum, item) => sum + item.balance, 0);
  const totalPasivoYCapital = totalPasivo + totalCapital;

  const difference = Math.abs(totalActivo - totalPasivoYCapital);
  const isBalanced = difference < 0.01;

  return {
    activoCirculante: {
      title: 'Activo Circulante',
      accounts: activoCirculanteAccounts,
      total: totalActivoCirculante,
    },
    activoNoCirculante: {
      title: 'Activo No Circulante (Fijo)',
      accounts: activoNoCirculanteAccounts,
      total: totalActivoNoCirculante,
    },
    totalActivo,
    pasivoCortoPlazo: {
      title: 'Pasivo a Corto Plazo',
      accounts: pasivoCortoPlazoAccounts,
      total: totalPasivoCortoPlazo,
    },
    pasivoLargoPlazo: {
      title: 'Pasivo a Largo Plazo',
      accounts: pasivoLargoPlazoAccounts,
      total: totalPasivoLargoPlazo,
    },
    totalPasivo,
    capitalContable: {
      title: 'Capital Contable',
      accounts: capitalAccounts,
      total: totalCapital,
    },
    totalCapital,
    totalPasivoYCapital,
    isBalanced,
    discrepancy: difference,
  };
}

/**
 * Gets the list of active Accounts and codes used across all entries.
 * Returns sorted active catálogo.
 */
export function getChartOfAccounts(entries: JournalEntry[]): { code: string; name: string; type: string }[] {
  const map: Record<string, string> = {};
  for (const entry of entries) {
    for (const item of entry.items) {
      map[item.accountCode] = item.accountName;
    }
  }

  return Object.keys(map)
    .sort()
    .map((code) => {
      let type = 'Otros';
      if (code.startsWith('1')) type = 'Activo';
      else if (code.startsWith('2')) type = 'Pasivo';
      else if (code.startsWith('3')) type = 'Capital';
      else if (code.startsWith('4')) type = 'Ventas / Ingresos';
      else if (code.startsWith('5')) type = 'Costo de Ventas';
      else if (code.startsWith('6')) type = 'Gastos de Operación';
      else if (code.startsWith('7')) type = 'Productos Financieros';
      else if (code.startsWith('9')) type = 'Resultados / Cierre';

      return {
        code,
        name: map[code],
        type,
      };
    });
}
