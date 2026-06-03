import React, { useState } from 'react';
import { useAccountingStore } from '../store/useAccountingStore';
import { calculateBalanceSheet } from '../utils/accountingMath';
import { ShieldCheck, ShieldAlert, Layers } from 'lucide-react';

export const BalanceSheetView: React.FC = () => {
  const { entries } = useAccountingStore();
  const bs = calculateBalanceSheet(entries);
  const [layoutMode, setLayoutMode] = useState<'cuenta' | 'reporte'>('cuenta');

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Balance General de Cierre</h2>
          <p className="text-xs text-gray-500 mt-1">
            Al 31 de Diciembre de 2020. Cuadrado dinámicamente según la ecuación básica: Activo = Pasivo + Capital.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Layout switches */}
          <div className="inline-flex rounded-lg border border-gray-100 p-1 bg-gray-50 text-sm">
            <button
              onClick={() => setLayoutMode('cuenta')}
              className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition-all ${
                layoutMode === 'cuenta'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-gray-500 hover:text-slate-900'
              }`}
            >
              Vista de Cuenta (Dos columnas)
            </button>
            <button
              onClick={() => setLayoutMode('reporte')}
              className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition-all ${
                layoutMode === 'reporte'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-gray-500 hover:text-slate-900'
              }`}
            >
              Vista de Reporte (Continuo)
            </button>
          </div>

          {/* Balance status alert */}
          {bs.isBalanced ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200">
              <ShieldCheck className="h-4 w-4" />
              <span>Ecuación Cuadrada</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-semibold bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg border border-amber-200">
              <ShieldAlert className="h-4 w-4" />
              <span>Desbalance de {formatCurrency(bs.discrepancy)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Balance Sheet Report */}
      <div className="bg-white border border-slate-200 shadow-sm max-w-6xl mx-auto overflow-hidden">
        {layoutMode === 'cuenta' ? (
          /* VISTA DE CUENTA (DOS COLUMNAS) - Premium Geometric Symmetry */
          <div className="p-8 flex flex-col">
            <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-850 uppercase tracking-tight">Balance General de Cierre</h1>
                <p className="text-sm text-slate-500 italic font-serif">Ejercicio Fiscal: Diciembre 2020</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cuenta de Utilidad Activa</p>
                <p className="text-sm font-mono text-slate-700">354.00 - UTILIDAD DEL EJERCICIO</p>
              </div>
            </div>

            {/* The Financial Grid: Geometric Symmetry */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
              {/* Column 1: ACTIVO */}
              <div className="pr-4 space-y-6">
                <div className="flex justify-between items-baseline border-b-2 border-slate-900 mb-4 pb-1">
                  <span className="text-lg font-bold uppercase tracking-wider">Activo</span>
                  <span className="text-xs font-semibold text-slate-400 italic">Corriente / No Corriente</span>
                </div>

                {/* Activo Circulante */}
                <div>
                  <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                    {bs.activoCirculante.title}
                  </h5>
                  <div className="space-y-1 font-mono text-xs text-slate-800">
                    {bs.activoCirculante.accounts.map((acc) => (
                      <div key={acc.code} className="flex justify-between py-1 border-b border-slate-50">
                        <span>{acc.code} {acc.name}</span>
                        <span>{formatCurrency(acc.balance)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activo No Circulante */}
                {bs.activoNoCirculante.accounts.length > 0 && (
                  <div>
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 mt-4">
                      {bs.activoNoCirculante.title}
                    </h5>
                    <div className="space-y-1 font-mono text-xs text-slate-800">
                      {bs.activoNoCirculante.accounts.map((acc) => (
                        <div key={acc.code} className="flex justify-between py-1 border-b border-slate-50">
                          <span>{acc.code} {acc.name}</span>
                          <span>{formatCurrency(acc.balance)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 flex justify-between items-center bg-slate-50 p-3 border-l-4 border-slate-900">
                  <span className="text-sm font-bold uppercase">Suma del Activo</span>
                  <span className="text-lg font-mono font-bold">{formatCurrency(bs.totalActivo)}</span>
                </div>
              </div>

              {/* Column 2: PASIVO Y CAPITAL */}
              <div className="pl-0 lg:pl-8 space-y-6 flex flex-col justify-between pt-6 lg:pt-0">
                <div>
                  <div className="flex justify-between items-baseline border-b-2 border-slate-900 mb-4 pb-1">
                    <span className="text-lg font-bold uppercase tracking-wider">Pasivo</span>
                    <span className="text-xs font-semibold text-slate-400">Obligaciones</span>
                  </div>

                  {/* Pasivo Corto Plazo */}
                  <div className="mb-6">
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                      {bs.pasivoCortoPlazo.title}
                    </h5>
                    <div className="space-y-1 font-mono text-xs text-slate-800">
                      {bs.pasivoCortoPlazo.accounts.map((acc) => (
                        <div key={acc.code} className="flex justify-between py-1 border-b border-slate-50">
                          <span>{acc.code} {acc.name}</span>
                          <span>{formatCurrency(acc.balance)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pasivo Largo Plazo */}
                  {bs.pasivoLargoPlazo.accounts.length > 0 && (
                    <div className="mb-6">
                      <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                        {bs.pasivoLargoPlazo.title}
                      </h5>
                      <div className="space-y-1 font-mono text-xs text-slate-800">
                        {bs.pasivoLargoPlazo.accounts.map((acc) => (
                          <div key={acc.code} className="flex justify-between py-1 border-b border-slate-50">
                            <span>{acc.code} {acc.name}</span>
                            <span>{formatCurrency(acc.balance)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-baseline border-b-2 border-slate-900 mb-4 pb-1">
                    <span className="text-lg font-bold uppercase tracking-wider">Capital Contable</span>
                    <span className="text-xs font-semibold text-slate-400">Patrimonio</span>
                  </div>

                  {/* Capital Contable */}
                  <div className="space-y-1 font-mono text-xs text-slate-800">
                    {bs.capitalContable.accounts.map((acc) => (
                      <div key={acc.code} className={`flex justify-between py-1 border-b border-slate-50 ${acc.code === '354.00' ? 'bg-emerald-50 font-bold text-emerald-700 p-1 px-2' : ''}`}>
                        <span>{acc.code} {acc.name}</span>
                        <span>{formatCurrency(acc.balance)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-6">
                  <div className="flex justify-between items-center bg-cyan-900 text-white p-3">
                    <span className="text-sm font-bold uppercase text-white">Suma Pasivo + Capital</span>
                    <span className="text-lg font-mono font-bold text-white">{formatCurrency(bs.totalPasivoYCapital)}</span>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <div className="flex items-center text-[10px] text-emerald-600 font-bold uppercase tracking-widest font-mono">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                      Ecuación Patrimonial Equilibrada
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer: Certification Area */}
            <div className="mt-12 flex justify-around border-t pt-8 border-slate-100 select-none">
              <div className="w-48 text-center">
                <div className="h-px w-full bg-slate-300 mb-2"></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Contador General</p>
              </div>
              <div className="w-48 text-center">
                <div className="h-px w-full bg-slate-300 mb-2 flex-grow"></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Auditoría Interna</p>
              </div>
              <div className="w-48 text-center">
                <div className="h-px w-full bg-slate-300 mb-2"></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Director de Finanzas</p>
              </div>
            </div>
          </div>
        ) : (
          /* VISTA DE REPORTE (CONTINUO) */
          <div className="p-8 space-y-8 max-w-4xl mx-auto">
            {/* Activo Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-baseline border-b-2 border-slate-900 mb-4 pb-1">
                <span className="text-lg font-bold uppercase tracking-wider">1. Activo</span>
                <span className="text-xs font-semibold text-slate-400">Corriente y Fijo</span>
              </div>

              <div className="pl-4 space-y-4">
                {/* Circulante */}
                <div>
                  <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{bs.activoCirculante.title}</h5>
                  <div className="pl-4 space-y-1 font-mono text-xs">
                    {bs.activoCirculante.accounts.map((acc) => (
                      <div key={acc.code} className="flex justify-between py-1 border-b border-slate-50 text-slate-800">
                        <span>{acc.code} {acc.name}</span>
                        <span>{formatCurrency(acc.balance)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between py-1 bg-slate-50/50 px-2 font-semibold text-slate-700">
                      <span>Total de {bs.activoCirculante.title}</span>
                      <span>{formatCurrency(bs.activoCirculante.total)}</span>
                    </div>
                  </div>
                </div>

                {/* No Circulante */}
                {bs.activoNoCirculante.accounts.length > 0 && (
                  <div>
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{bs.activoNoCirculante.title}</h5>
                    <div className="pl-4 space-y-1 font-mono text-xs">
                      {bs.activoNoCirculante.accounts.map((acc) => (
                        <div key={acc.code} className="flex justify-between py-1 border-b border-slate-50 text-slate-800">
                          <span>{acc.code} {acc.name}</span>
                          <span>{formatCurrency(acc.balance)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between py-1 bg-slate-50/50 px-2 font-semibold text-slate-700">
                        <span>Total de {bs.activoNoCirculante.title}</span>
                        <span>{formatCurrency(bs.activoNoCirculante.total)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between p-3 mt-4 bg-slate-50 border-l-4 border-slate-900 font-bold text-slate-900 text-sm">
                <span>SUMA TOTAL DEL ACTIVO</span>
                <span className="font-mono">{formatCurrency(bs.totalActivo)}</span>
              </div>
            </div>

            {/* Pasivo Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-baseline border-b-2 border-slate-900 mb-4 pb-1">
                <span className="text-lg font-bold uppercase tracking-wider">2. Pasivo</span>
                <span className="text-xs font-semibold text-slate-400">Obligaciones</span>
              </div>

              <div className="pl-4 space-y-4">
                {/* Corto Plazo */}
                <div>
                  <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{bs.pasivoCortoPlazo.title}</h5>
                  <div className="pl-4 space-y-1 font-mono text-xs">
                    {bs.pasivoCortoPlazo.accounts.map((acc) => (
                      <div key={acc.code} className="flex justify-between py-1 border-b border-slate-50 text-slate-800">
                        <span>{acc.code} {acc.name}</span>
                        <span>{formatCurrency(acc.balance)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between py-1 bg-slate-50/50 px-2 font-semibold text-slate-700">
                      <span>Total de {bs.pasivoCortoPlazo.title}</span>
                      <span>{formatCurrency(bs.pasivoCortoPlazo.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Largo Plazo */}
                {bs.pasivoLargoPlazo.accounts.length > 0 && (
                  <div>
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{bs.pasivoLargoPlazo.title}</h5>
                    <div className="pl-4 space-y-1 font-mono text-xs">
                      {bs.pasivoLargoPlazo.accounts.map((acc) => (
                        <div key={acc.code} className="flex justify-between py-1 border-b border-slate-50 text-slate-800">
                          <span>{acc.code} {acc.name}</span>
                          <span>{formatCurrency(acc.balance)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between py-1 bg-slate-50/50 px-2 font-semibold text-slate-700">
                        <span>Total de {bs.pasivoLargoPlazo.title}</span>
                        <span>{formatCurrency(bs.pasivoLargoPlazo.total)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between p-3 mt-4 bg-slate-50 border-l-4 border-slate-500 font-bold text-slate-800 text-sm">
                <span>SUMA DEL PASIVO</span>
                <span className="font-mono">{formatCurrency(bs.totalPasivo)}</span>
              </div>
            </div>

            {/* Capital Contable Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-baseline border-b-2 border-slate-900 mb-4 pb-1">
                <span className="text-lg font-bold uppercase tracking-wider">3. Capital Contable</span>
                <span className="text-xs font-semibold text-slate-400">Patrimonio Neto</span>
              </div>

              <div className="pl-4 space-y-1 font-mono text-xs">
                {bs.capitalContable.accounts.map((acc) => (
                  <div key={acc.code} className={`flex justify-between py-1 border-b border-slate-50 text-slate-800 ${acc.code === '354.00' ? 'bg-emerald-50 font-bold text-emerald-700 p-1 px-2' : ''}`}>
                    <span>{acc.code} {acc.name}</span>
                    <span>{formatCurrency(acc.balance)}</span>
                  </div>
                ))}
                <div className="flex justify-between py-1 bg-slate-50/50 px-2 font-semibold text-slate-700">
                  <span>Suma de {bs.capitalContable.title}</span>
                  <span>{formatCurrency(bs.totalCapital)}</span>
                </div>
              </div>

              <div className="flex justify-between p-3 mt-4 bg-slate-50 border-l-4 border-slate-500 font-bold text-slate-800 text-sm">
                <span>SUMA DEL CAPITAL CONTABLE</span>
                <span className="font-mono">{formatCurrency(bs.totalCapital)}</span>
              </div>
            </div>

            {/* TOTAL PASIVO + CAPITAL */}
            <div className="flex justify-between items-center bg-cyan-900 text-white p-4 font-bold text-sm mt-8">
              <span>SUMA TOTAL DE PASIVO Y CAPITAL CONTABLE</span>
              <span className="font-mono text-base">{formatCurrency(bs.totalPasivoYCapital)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
