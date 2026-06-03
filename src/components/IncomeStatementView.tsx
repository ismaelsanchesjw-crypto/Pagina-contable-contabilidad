import React from 'react';
import { useAccountingStore } from '../store/useAccountingStore';
import { calculateIncomeStatement } from '../utils/accountingMath';
import { TrendingUp, Percent, DollarSign, Calculator } from 'lucide-react';

export const IncomeStatementView: React.FC = () => {
  const { entries } = useAccountingStore();
  const report = calculateIncomeStatement(entries);

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(val);
  };

  // Percent calculating helper
  const getPercentage = (val: number, base: number) => {
    if (base === 0) return '0.00%';
    return `${((val / base) * 100).toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Overview header - geometrically styled */}
      <div className="bg-white p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-xs select-none">
        <div>
          <h2 className="text-lg font-bold text-slate-850 uppercase tracking-tight">Estado de Resultados Integral</h2>
          <p className="text-xs text-slate-500 mt-1">
            Periodo de Ejercicio: Del 1° al 31 de Diciembre de 2020. Expresado en Pesos Mexicanos ($).
          </p>
        </div>

        {/* Dynamic visual health summary cards */}
        <div className="flex gap-4">
          <div className="bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xs text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Utilidad Neta</span>
            <span className="font-mono text-base font-bold text-slate-900">{formatCurrency(report.utilidadNeta)}</span>
          </div>

          <div className="bg-cyan-950 border border-cyan-800 px-4 py-2.5 rounded-xs text-right">
            <span className="text-[10px] font-bold text-cyan-400 uppercase block">Margen Neto</span>
            <span className="font-mono text-base font-bold text-cyan-200">
              {getPercentage(report.utilidadNeta, report.ventasNetas)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Income Statement Report */}
      <div className="bg-white border border-slate-200 shadow-sm overflow-hidden max-w-4xl mx-auto rounded-xs">
        {/* Banner header resembling a corporate report */}
        <div className="px-8 py-6 border-b border-slate-100 text-center bg-slate-50 select-none">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Reporte Integral de Pérdidas y Ganancias</h3>
          <p className="text-xs text-slate-500 mt-1">Determinación dinámica de ingresos ordinarios y utilidades operativas</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="divide-y divide-slate-100 text-sm">
            {/* Ventas Brutas */}
            <div className="flex justify-between py-3.5 items-center">
              <div>
                <span className="font-semibold text-slate-900">Ingresos por Ventas Brutas</span>
                <span className="text-xs text-slate-400 font-mono block">Cta: 401.00</span>
              </div>
              <span className="font-mono text-slate-800">{formatCurrency(report.ventasBrutas)}</span>
            </div>

            {/* Rebajas y devoluciones sobre ventas */}
            {(report.rebajasVentas > 0 || report.devolucionesVentas > 0) && (
              <>
                {report.rebajasVentas > 0 && (
                  <div className="flex justify-between py-3 items-center pl-6 text-slate-600 text-xs">
                    <div>
                      <span>(-) Rebajas y Descuentos sobre Ventas</span>
                      <span className="text-[10px] text-slate-400 font-mono block">Movimientos de rebajas de cuenta 401.00</span>
                    </div>
                    <span className="font-mono font-medium">({formatCurrency(report.rebajasVentas)})</span>
                  </div>
                )}

                {report.devolucionesVentas > 0 && (
                  <div className="flex justify-between py-3 items-center pl-6 text-slate-600 text-xs">
                    <div>
                      <span>(-) Devoluciones sobre Ventas</span>
                      <span className="text-[10px] text-slate-400 font-mono block">Movimientos de devoluciones de cuenta 401.00</span>
                    </div>
                    <span className="font-mono font-medium">({formatCurrency(report.devolucionesVentas)})</span>
                  </div>
                )}
              </>
            )}

            {/* Ventas Netas */}
            <div className="flex justify-between py-3.5 items-center bg-slate-50/50 font-bold px-3 border-l-4 border-slate-900">
              <span className="text-slate-900 uppercase text-[11px] tracking-wide">Ventas Netas</span>
              <span className="font-mono text-slate-900">{formatCurrency(report.ventasNetas)}</span>
            </div>

            {/* Costo de Ventas */}
            <div className="flex justify-between py-3.5 items-center">
              <div>
                <span className="font-semibold text-slate-900">(-) Costo de Ventas</span>
                <span className="text-xs text-slate-400 font-mono block">Cta: 501.00</span>
              </div>
              <span className="font-mono text-slate-800">({formatCurrency(report.costoVentas)})</span>
            </div>

            {/* Utilidad Bruta */}
            <div className="flex justify-between py-3.5 items-center bg-slate-50/50 font-bold px-3 border-l-4 border-slate-900">
              <span className="text-slate-900 uppercase text-[11px] tracking-wide">Utilidad Bruta</span>
              <span className="font-mono text-slate-950">{formatCurrency(report.utilidadBruto)}</span>
            </div>

            {/* Gastos de Operación Header */}
            <div className="py-2 bg-slate-900 text-white font-bold text-[10px] uppercase tracking-widest px-3 mt-4 select-none">
              Gastos Operativos de Administración y Distribución
            </div>

            {/* Gastos de Venta */}
            <div className="flex justify-between py-3.5 items-center pl-6 text-slate-700">
              <div>
                <span>Gastos de Venta y Distribución</span>
                <span className="text-xs text-slate-400 font-mono block">Cta: 601.00</span>
              </div>
              <span className="font-mono">({formatCurrency(report.gastosVenta)})</span>
            </div>

            {/* Gastos de Administracion */}
            <div className="flex justify-between py-3.5 items-center pl-6 text-slate-700">
              <div>
                <span>Gastos de Administración</span>
                <span className="text-xs text-slate-400 font-mono block">Cta: 602.00</span>
              </div>
              <span className="font-mono">({formatCurrency(report.gastosAdmin)})</span>
            </div>

            {/* Total de Gastos de Operacion */}
            <div className="flex justify-between py-3.5 items-center text-xs text-slate-500 pl-6 border-b-2 border-slate-200">
              <span>Suma de Gastos de Operación</span>
              <span className="font-mono">({formatCurrency(report.gastosVenta + report.gastosAdmin)})</span>
            </div>

            {/* Utilidad de Operacion */}
            <div className="flex justify-between py-3.5 items-center bg-slate-50/50 font-bold px-3 text-slate-900 border-l-4 border-slate-900">
              <span className="uppercase text-[11px] tracking-wide">Utilidad de Operación</span>
              <span className="font-mono text-slate-900">{formatCurrency(report.utilidadOperacion)}</span>
            </div>

            {/* Productos Financieros */}
            <div className="flex justify-between py-3.5 items-center pl-2">
              <div>
                <span className="font-semibold text-slate-900">(+) Productos Financieros</span>
                <span className="text-xs text-slate-400 font-mono block">Cta: 760.00</span>
              </div>
              <span className="font-mono text-emerald-700">+{formatCurrency(report.productosFinancieros)}</span>
            </div>

            {/* Utilidad Neta final - Cyan High Contrast box */}
            <div className="flex justify-between py-4 items-center bg-cyan-900 font-extrabold px-4 text-white rounded-none mt-6 border-l-4 border-slate-900 select-none">
              <span className="text-white text-sm font-bold uppercase tracking-wide">Utilidad Neta del Ejercicio</span>
              <span className="font-mono text-lg text-white font-bold">{formatCurrency(report.utilidadNeta)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
