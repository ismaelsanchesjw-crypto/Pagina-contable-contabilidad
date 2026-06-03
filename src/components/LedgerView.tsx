import React, { useState } from 'react';
import { useAccountingStore } from '../store/useAccountingStore';
import { calculateLedger, LedgerAccount } from '../utils/accountingMath';
import { Grid, List, CheckSquare, Layers } from 'lucide-react';

export const LedgerView: React.FC = () => {
  const { entries } = useAccountingStore();
  const [includeAdjustments, setIncludeAdjustments] = useState(true);

  // Dynamic ledger map
  const ledger = calculateLedger(entries, !includeAdjustments);
  const ledgerAccounts = Object.values(ledger).sort((a, b) => a.code.localeCompare(b.code));

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(val);
  };

  const getAccountClassDescription = (code: string) => {
    if (code.startsWith('1')) return 'Activo';
    if (code.startsWith('2')) return 'Pasivo';
    if (code.startsWith('3')) return 'Capital Contable';
    if (code.startsWith('4')) return 'Resultados Acreedora (Ventas)';
    if (code.startsWith('5')) return 'Resultados Deudora (Costos)';
    if (code.startsWith('6')) return 'Resultados Deudora (Gastos)';
    if (code.startsWith('7')) return 'Resultados Acreedora (Inversión)';
    if (code.startsWith('9')) return 'Cuenta Liquidadora (Cierre)';
    return 'Resultados';
  };

  const getClassTheme = (code: string) => {
    if (code.startsWith('1')) return 'border-t-emerald-600 bg-emerald-50/20 text-emerald-800';
    if (code.startsWith('2')) return 'border-t-red-600 bg-red-50/20 text-red-800';
    if (code.startsWith('3')) return 'border-t-purple-600 bg-purple-50/20 text-purple-800';
    return 'border-t-blue-600 bg-blue-50/20 text-blue-800';
  };

  return (
    <div className="space-y-6">
      {/* T-account options - geometrically styled */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 border border-slate-200 shadow-sm rounded-xs">
        <div>
          <h2 className="text-base font-bold text-slate-850 uppercase tracking-tight">Libro Mayor / Esquemas de Mayor (T)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Procesado en tiempo real agrupando por código único de cuenta de mayor.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-slate-700 font-bold uppercase cursor-pointer select-none">
            <input
              type="checkbox"
              className="rounded-xs border-slate-300 text-cyan-600 focus:ring-cyan-500 w-4 h-4 cursor-pointer"
              checked={includeAdjustments}
              onChange={(e) => setIncludeAdjustments(e.target.checked)}
            />
            <span>Incluir asientos de ajuste (aj1 a aj4)</span>
          </label>
        </div>
      </div>

      {/* Grid of T-accounts */}
      {ledgerAccounts.length === 0 ? (
        <div className="text-center py-12 bg-white border border-slate-200 rounded-xs">
          <p className="text-slate-400 text-xs">No hay movimientos registrados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {ledgerAccounts.map((account) => {
            const maxRows = Math.max(account.debits.length, account.credits.length);
            const isDeudor = account.debitBalance >= account.creditBalance;
            const absoluteBalance = Math.abs(account.totalDebit - account.totalCredit);

            return (
              <div
                key={account.code}
                id={`ledger-card-${account.code}`}
                className="bg-white border border-slate-200 shadow-sm rounded-xs overflow-hidden flex flex-col justify-between hover:border-slate-400 transition-colors duration-150"
              >
                {/* Account info header - Elegant dark block */}
                <div className="p-4 bg-slate-900 text-white flex items-start justify-between gap-2 border-b border-slate-800 select-none">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-cyan-400 bg-slate-800 px-2 py-0.5 border border-slate-700">
                      {account.code}
                    </span>
                    <h3 className="text-xs font-bold text-white mt-1.5 uppercase tracking-wide">
                      {account.name}
                    </h3>
                  </div>
                  <span className="text-[9px] uppercase font-bold px-2 py-0.5 bg-slate-805 border border-slate-750 text-slate-300">
                    {getAccountClassDescription(account.code)}
                  </span>
                </div>

                {/* T-Ledger Layout */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Central line and headers */}
                    <div className="grid grid-cols-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-2 border-b-2 border-slate-900 select-none">
                      <div className="pr-2 text-left">Debe (Cargo)</div>
                      <div className="pl-2 text-right">Haber (Abono)</div>
                    </div>

                    {/* Movements */}
                    <div className="relative min-h-[80px] mt-2">
                      {/* Vertical line divider of the 'T' */}
                      <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-900 -translate-x-1/2"></div>

                      {/* Table of side-by-side movements */}
                      <table className="w-full text-xs font-mono">
                        <tbody>
                          {Array.from({ length: maxRows }).map((_, i) => {
                            const debitMov = account.debits[i];
                            const creditMov = account.credits[i];

                            return (
                              <tr key={i} className="align-top border-b border-slate-50">
                                {/* Left / Debit */}
                                <td className="w-1/2 pr-3 py-1 text-left relative">
                                  {debitMov && (
                                    <div className="flex justify-between gap-1 items-baseline">
                                      <span className="text-[8px] text-slate-400" title={debitMov.concept}>
                                        {debitMov.entryId}
                                      </span>
                                      <span className="font-medium text-slate-800">
                                        {formatCurrency(debitMov.amount)}
                                      </span>
                                    </div>
                                  )}
                                </td>

                                {/* Right / Credit */}
                                <td className="w-1/2 pl-3 py-1 text-right relative">
                                  {creditMov && (
                                    <div className="flex justify-between gap-1 items-baseline">
                                      <span className="font-medium text-slate-800">
                                        {formatCurrency(creditMov.amount)}
                                      </span>
                                      <span className="text-[8px] text-slate-400" title={creditMov.concept}>
                                        {creditMov.entryId}
                                      </span>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    {/* Bottom double ledger line */}
                    <div className="border-t-2 border-slate-900 mt-4 pt-1.5 grid grid-cols-2 text-xs font-bold">
                      {/* Sum of Debits */}
                      <div className="pr-3 text-right font-mono text-slate-900">
                        {formatCurrency(account.totalDebit)}
                      </div>
                      {/* Sum of Credits */}
                      <div className="pl-3 text-left font-mono text-slate-900">
                        {formatCurrency(account.totalCredit)}
                      </div>
                    </div>

                    {/* Account double ledger balance calculation */}
                    <div className="grid grid-cols-2 text-xs font-bold mt-2 pt-2 border-t border-dashed border-slate-200">
                      {/* Debit Balance */}
                      <div className="pr-3 text-right">
                        {account.debitBalance > 0 && (
                          <div className="space-y-0.5">
                            <span className="text-[9px] uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-1 inline-block">
                              S. Deudor
                            </span>
                            <span className="font-mono text-sm text-emerald-800 block">
                              {formatCurrency(account.debitBalance)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Credit Balance */}
                      <div className="pl-3 text-left">
                        {account.creditBalance > 0 && (
                          <div className="space-y-0.5">
                            <span className="text-[9px] uppercase tracking-wider text-red-800 bg-red-50 border border-red-200 px-1 inline-block">
                              S. Acreedor
                            </span>
                            <span className="font-mono text-sm text-red-800 block">
                              {formatCurrency(account.creditBalance)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
