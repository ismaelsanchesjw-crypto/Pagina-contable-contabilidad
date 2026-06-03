import React from 'react';
import { useAccountingStore } from '../store/useAccountingStore';
import { getChartOfAccounts } from '../utils/accountingMath';
import { BookOpen } from 'lucide-react';

export const ChartOfAccountsView: React.FC = () => {
  const { entries } = useAccountingStore();
  const accounts = getChartOfAccounts(entries);

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'Activo':
        return 'bg-emerald-50 text-emerald-800 border-emerald-100';
      case 'Pasivo':
        return 'bg-red-50 text-red-800 border-red-100';
      case 'Capital':
        return 'bg-purple-50 text-purple-800 border-purple-100';
      case 'Ventas / Ingresos':
        return 'bg-blue-50 text-blue-800 border-blue-100';
      case 'Costo de Ventas':
        return 'bg-amber-50 text-amber-800 border-amber-100';
      case 'Gastos de Operación':
        return 'bg-cyan-50 text-cyan-800 border-cyan-100';
      case 'Productos Financieros':
        return 'bg-pink-50 text-pink-800 border-pink-100';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border border-slate-200 shadow-sm rounded-xs select-none">
        <h2 className="text-base font-bold text-slate-850 uppercase tracking-tight">Catálogo de Cuentas Activo</h2>
        <p className="text-xs text-slate-500 mt-1">
          Lista automática de cuentas con movimientos o pólizas en el ejercicio actual. Sin renglones vacíos ni datos estáticos de relleno.
        </p>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm overflow-hidden max-w-4xl mx-auto rounded-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50 select-none">
              <th className="px-6 py-4 w-40">Código de Cuenta</th>
              <th className="px-6 py-4">Nombre de la Cuenta</th>
              <th className="px-6 py-4">Naturaleza / Clasificación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-mono text-slate-800">
            {accounts.map((acc) => (
              <tr key={acc.code} className="hover:bg-slate-50/50">
                <td className="px-6 py-3.5 font-semibold text-slate-900">
                  {acc.code}
                </td>
                <td className="px-6 py-3.5 font-sans font-semibold text-slate-800 uppercase">
                  {acc.name}
                </td>
                <td className="px-6 py-3.5">
                  <span className="inline-flex items-center px-2.5 py-0.5 border border-slate-200 bg-slate-50 text-slate-700 text-[9px] font-bold uppercase tracking-wider font-sans">
                    {acc.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {accounts.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-xs">
            No hay cuentas activas registradas.
          </div>
        )}
      </div>
    </div>
  );
};
