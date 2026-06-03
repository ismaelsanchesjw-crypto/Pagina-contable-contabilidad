import React from 'react';
import { JournalEntry } from '../types/accounting';
import { useAccountingStore } from '../store/useAccountingStore';
import {
  calculateLedger,
  calculateIncomeStatement,
  calculateBalanceSheet,
  getChartOfAccounts
} from '../utils/accountingMath';
import { Printer, ArrowLeft } from 'lucide-react';

interface PrintPackageProps {
  entries: JournalEntry[];
  onBack: () => void;
}

export const PrintPackage: React.FC<PrintPackageProps> = ({ entries, onBack }) => {
  const { satInfo } = useAccountingStore();
  const accounts = getChartOfAccounts(entries);

  const ledger = calculateLedger(entries, false);
  const ledgerAccounts = Object.values(ledger).sort((a, b) => a.code.localeCompare(b.code));
  const report = calculateIncomeStatement(entries);
  const bs = calculateBalanceSheet(entries);

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(val);
  };

  const currentLocalTime = new Date().toLocaleString('es-MX', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Back & Print Action Bar in UI (Not visible when printing!) */}
      <div className="bg-slate-900 text-white p-4 rounded-none flex items-center justify-between gap-4 shadow-md print:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-800 rounded-none cursor-pointer transition-colors text-slate-300 hover:text-white"
            title="Volver al panel"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide">Paquete Ejecutivo de Impresión</h2>
            <p className="text-[10px] text-slate-400">Estructurado secuencialmente y optimizado para imprimir o guardar como archivo contable PDF.</p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 bg-cyan-650 rounded-none text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
        >
          <Printer className="h-3.5 w-3.5 text-cyan-200" />
          <span>Imprimir / Guardar PDF</span>
        </button>
      </div>

      {/* COMPILATION STARTS */}
      {/* Outer bounds optimized for print page-break */}
      <div className="bg-white border text-slate-900 border-gray-300 shadow-sm rounded-xl p-8 max-w-5xl mx-auto space-y-16 print:border-0 print:shadow-none print:p-0 font-sans leading-relaxed print-full-width">
        
        {/* ======================================= */}
        {/* a) PORTADA EJECUTIVA (COVER PAGE) */}
        {/* ======================================= */}
        <div className="min-h-[75vh] flex flex-col justify-between items-center text-center py-12 border-b-2 border-double border-slate-900 print:min-h-screen print:py-16 page-break-after">
          
          {/* Top Building / Logo */}
          <div className="flex flex-col items-center mt-6">
            <div className="w-16 h-16 relative flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg p-2.5 shadow-xs mb-3">
              <svg viewBox="0 0 64 64" className="w-full h-full text-slate-750 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M56 52h-2V28H10v24H8a2 2 0 000 4h48a2 2 0 000-4zM24 52h-8v-8h8v8zm14 0h-8V40h8v12zm14 0h-8v-8h8v8zM12 24h40l-2.5-8.3A2 2 0 0047.6 14H16.4a2 2 0 00-1.9 1.7L12 24zm4.5-6h31l1.5 5H15l1.5-5zM32 4a6 6 0 106 6 6 6 0 00-6-6zm0 8a2 2 0 112-2 2 2 0 01-2 2z" />
              </svg>
            </div>

            <h1 className="text-3xl font-black uppercase text-slate-950 tracking-tight leading-tight mt-1">
              {satInfo.razonSocial || 'ZITÁCUARO IMPORT'}
            </h1>
          </div>

          {/* Tax Official Details */}
          <div className="mt-4 space-y-4 max-w-md text-xs">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                REGISTRO DE CONTRIBUYENTE
              </span>
              <span className="text-sm font-mono font-bold text-slate-800 block">
                {satInfo.rfc || 'ZIM-980415G34'}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                DOMICILIO FISCAL OFICIAL
              </span>
              <span className="text-xs text-slate-700 leading-relaxed block px-4">
                {satInfo.domicilioFiscal || 'Av. Revolución Sur #142, Col. C'}
              </span>
            </div>
          </div>

          {/* Segment border line */}
          <div className="w-full max-w-sm border-t border-slate-300 my-4" />

          {/* Core Section Cover labels */}
          <div className="space-y-4 my-2">
            <div>
              <div className="text-[10.5px] font-extrabold text-slate-600 uppercase tracking-widest">
                ESTUDIO CONTABLE COADYUVANTE
              </div>
            </div>
            
            {/* Portada titles */}
            <div className="space-y-2 py-1 font-sans">
              <div className="text-3xl font-extrabold text-slate-950 uppercase tracking-widest leading-none">
                PORTADA
              </div>
              <div className="text-base font-normal text-slate-600 uppercase tracking-widest leading-none">
                DE
              </div>
              <div className="text-2xl font-black text-slate-955 uppercase tracking-widest leading-none my-1">
                INFORMACIÓN
              </div>
              <div className="text-2xl font-bold text-slate-950 uppercase tracking-widest leading-none">
                FINANCIERA
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic px-8 max-w-xs leading-relaxed mx-auto">
              Expedientes integrados bajo el método normativo de registros mercantiles.
            </p>
          </div>

          {/* Bottom Segment border line */}
          <div className="w-full max-w-sm border-t border-slate-300 my-4" />

          {/* Detailed Accounting Technical Specification Frame Box */}
          <div className="w-full max-w-sm border border-slate-400 rounded-2xl p-6 text-left text-xs bg-slate-50 space-y-4">
            
            {/* Method row */}
            <div className="border-b border-slate-200 pb-2">
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                MÉTODO DE INVENTARIOS
              </div>
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wide mt-0.5">
                {satInfo.metodoInventarios || 'INVENTARIOS PERPETUOS SIN IVA'}
              </div>
            </div>

            {/* Valuation row */}
            <div className="border-b border-slate-200 pb-2">
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                EVALUACIÓN VALORATIVA
              </div>
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wide mt-0.5">
                {satInfo.evaluacionValorativa || 'COSTO ADQUISITIVO DEL PERIODO'}
              </div>
            </div>

            {/* Period Row */}
            <div className="border-b border-slate-200 pb-2 flex justify-between items-end">
              <div>
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  PERIODO ANALIZADO
                </div>
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wide mt-0.5">
                  Del {satInfo.periodoAnalizado || '01/01/2020'}
                </div>
              </div>
            </div>

            {/* Responsibility Row */}
            <div className="pb-1">
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                RESPONSABILIDAD
              </div>
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wide mt-0.5">
                {satInfo.responsabilidad || 'Dirección de Finanzas'}
              </div>
            </div>

          </div>

          {/* Outer bottom footers */}
          <div className="mt-6 mb-2 space-y-1.5 text-center">
            <p className="text-[9px] font-mono text-slate-400 tracking-wider">
              CIFRAS EXPRESADAS EN PESOS MEXICANOS (MXN)
            </p>
            <p className="text-xs font-extrabold text-slate-800 tracking-widest uppercase">
              {satInfo.ciudadEstado || 'ZITÁCUARO, MICHOACÁN, MÉXICO'}
            </p>
          </div>

        </div>


        {/* ======================================= */}
        {/* b) CATÁLOGO DE CUENTAS ACTIVO */}
        {/* ======================================= */}
        <div className="space-y-6 pt-8 page-break-before">
          <div className="border-b border-slate-900 pb-2">
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
              b) Catálogo de Cuentas Activo del Ejercicio
            </h2>
            <p className="text-xs text-slate-500 mt-1">Exclusivamente cuentas con transacciones durante el periodo.</p>
          </div>

          <table className="w-full text-left border-collapse text-sm border border-gray-200">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-300 font-bold text-slate-800">
                <th className="px-4 py-3 border-r border-gray-200">Código</th>
                <th className="px-4 py-3 border-r border-gray-200">Nombre Oficial</th>
                <th className="px-4 py-3">Clasificación Básica</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {accounts.map((acc) => (
                <tr key={acc.code} className="hover:bg-slate-50/50">
                  <td className="px-4 py-2.5 font-mono text-xs border-r border-gray-200">{acc.code}</td>
                  <td className="px-4 py-2.5 font-semibold text-slate-900 uppercase border-r border-gray-200">{acc.name}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-600">{acc.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        {/* ======================================= */}
        {/* c) LIBRO DIARIO GENERAL COMPLETO */}
        {/* ======================================= */}
        <div className="space-y-6 pt-8 page-break-before">
          <div className="border-b border-slate-900 pb-2">
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
              c) Libro Diario General (Pólizas Detalladas)
            </h2>
            <p className="text-xs text-slate-500 mt-1">Sucesión cronológica del registro de transacciones operativas y ajustes de cierre.</p>
          </div>

          <div className="space-y-8">
            {entries.map((entry) => {
              const debits = entry.items.reduce((sum, item) => sum + item.debit, 0);
              const credits = entry.items.reduce((sum, item) => sum + item.credit, 0);

              return (
                <div key={entry.id} className="border border-slate-300 rounded-lg overflow-hidden page-break-inside-avoid">
                  <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex justify-between text-xs font-semibold">
                    <span>POLIZA DE {entry.type.toUpperCase()} #{entry.number}</span>
                    <span>📅 {entry.date}</span>
                    <span className="font-mono">ID: {entry.id}</span>
                  </div>

                  <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs font-medium">
                    <strong className="text-slate-700">CONCEPTO:</strong> {entry.concept}
                  </div>

                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-slate-200 font-bold text-slate-500 uppercase tracking-wider">
                        <th className="px-4 py-2 w-28">Código</th>
                        <th className="px-4 py-2">Cuenta</th>
                        <th className="px-4 py-2 text-right w-32">Debe</th>
                        <th className="px-4 py-2 text-right w-32">Haber</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {entry.items.map((item, idx) => {
                        const isCredit = item.credit > 0;
                        return (
                          <tr key={idx}>
                            <td className="px-4 py-2 font-mono text-gray-500">{item.accountCode}</td>
                            <td className={`px-4 py-2 uppercase font-medium ${isCredit ? 'pl-8 text-gray-600' : 'text-gray-900'}`}>{item.accountName}</td>
                            <td className="px-4 py-2 text-right font-mono">{item.debit > 0 ? formatCurrency(item.debit) : '–'}</td>
                            <td className="px-4 py-2 text-right font-mono">{item.credit > 0 ? formatCurrency(item.credit) : '–'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50 border-t border-slate-200 font-bold text-slate-800">
                        <td colSpan={2} className="px-4 py-2 text-right uppercase">Sumas Iguales:</td>
                        <td className="px-4 py-2 text-right font-mono">{formatCurrency(debits)}</td>
                        <td className="px-4 py-2 text-right font-mono">{formatCurrency(credits)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              );
            })}
          </div>
        </div>


        {/* ======================================= */}
        {/* d) ESQUEMAS DE MAYOR (T) */}
        {/* ======================================= */}
        <div className="space-y-6 pt-8 page-break-before">
          <div className="border-b border-slate-900 pb-2">
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
              d) Libro Mayor (Esquemas de Mayor en T)
            </h2>
            <p className="text-xs text-slate-500 mt-1">Concentración de movimientos por cada cuenta contable del catálogo.</p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-12">
            {ledgerAccounts.map((account) => {
              const maxRows = Math.max(account.debits.length, account.credits.length);

              return (
                <div key={account.code} className="border border-slate-300 p-4 rounded-xl bg-white page-break-inside-avoid">
                  {/* Ledger Header */}
                  <div className="border-b border-slate-200 pb-2 mb-2 flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900 uppercase text-sm">{account.name}</span>
                    <span className="font-mono bg-slate-100 rounded px-1.5 py-0.5 text-gray-600">{account.code}</span>
                  </div>

                  {/* T-Ledger Layout */}
                  <div className="relative min-h-[50px]">
                    {/* Vertical Divider Line */}
                    <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-900 -translate-x-1/2"></div>

                    {/* Headers */}
                    <div className="grid grid-cols-2 text-center text-[10px] font-bold text-gray-400 border-b border-slate-900 pb-1 mb-2">
                      <div>DEBE</div>
                      <div>HABER</div>
                    </div>

                    <table className="w-full text-[10px] border-collapse direct-print-t-rows">
                      <tbody>
                        {Array.from({ length: maxRows }).map((_, i) => {
                          const db = account.debits[i];
                          const cr = account.credits[i];

                          return (
                            <tr key={i} className="align-top">
                              {/* Left / Debit */}
                              <td className="w-1/2 pr-2 py-0.5 text-right font-mono">
                                {db && (
                                  <div className="flex justify-between">
                                    <span className="text-[8px] text-gray-400 uppercase font-bold">{db.entryId}</span>
                                    <span className="text-slate-900">{formatCurrency(db.amount)}</span>
                                  </div>
                                )}
                              </td>

                              {/* Right / Credit */}
                              <td className="w-1/2 pl-2 py-0.5 text-left font-mono">
                                {cr && (
                                  <div className="flex justify-between">
                                    <span className="text-slate-900">{formatCurrency(cr.amount)}</span>
                                    <span className="text-[8px] text-gray-400 uppercase font-bold">{cr.entryId}</span>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Total Movements Line */}
                  <div className="border-t-2 border-slate-950 grid grid-cols-2 text-[10px] font-bold mt-3 pt-1">
                    <div className="pr-2 text-right font-mono text-slate-800">{formatCurrency(account.totalDebit)}</div>
                    <div className="pl-2 text-left font-mono text-slate-800">{formatCurrency(account.totalCredit)}</div>
                  </div>

                  {/* Ultimate Balances */}
                  <div className="grid grid-cols-2 text-[10px] font-bold mt-1">
                    <div className="pr-2 text-right font-mono text-emerald-800 bg-emerald-50/20">
                      {account.debitBalance > 0 && formatCurrency(account.debitBalance)}
                    </div>
                    <div className="pl-2 text-left font-mono text-red-800 bg-red-50/20">
                      {account.creditBalance > 0 && formatCurrency(account.creditBalance)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>


        {/* ======================================= */}
        {/* e) ESTADO DE RESULTADOS INTEGRAL */}
        {/* ======================================= */}
        <div className="space-y-6 pt-8 page-break-before page-break-inside-avoid">
          <div className="border-b border-slate-900 pb-2">
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
              e) Estado de Resultados Integral
            </h2>
            <p className="text-xs text-slate-500 mt-1">Del 1° al 31 de Diciembre de {satInfo.ejercicio}. Expresado en pesos mexicanos.</p>
          </div>

          <div className="border border-slate-300 p-6 rounded-xl bg-white max-w-3xl mx-auto text-xs">
            <div className="divide-y divide-gray-200">
              <div className="flex justify-between py-2 font-semibold">
                <span>VENTAS BRUTAS:</span>
                <span className="font-mono">{formatCurrency(report.ventasBrutas)}</span>
              </div>
              
              {report.rebajasVentas > 0 && (
                <div className="flex justify-between py-2 pl-4 text-gray-600">
                  <span>(-) Rebajas y descuentos sobre Ventas:</span>
                  <span className="font-mono">({formatCurrency(report.rebajasVentas)})</span>
                </div>
              )}

              {report.devolucionesVentas > 0 && (
                <div className="flex justify-between py-2 pl-4 text-gray-600">
                  <span>(-) Devoluciones sobre Ventas:</span>
                  <span className="font-mono">({formatCurrency(report.devolucionesVentas)})</span>
                </div>
              )}

              <div className="flex justify-between py-2 bg-slate-50 font-bold px-2">
                <span>VENTAS NETAS:</span>
                <span className="font-mono">{formatCurrency(report.ventasNetas)}</span>
              </div>

              <div className="flex justify-between py-2">
                <span>(-) COSTO DE VENTAS:</span>
                <span className="font-mono">({formatCurrency(report.costoVentas)})</span>
              </div>

              <div className="flex justify-between py-2 bg-slate-50 font-bold px-2">
                <span>UTILIDAD BRUTA:</span>
                <span className="font-mono">{formatCurrency(report.utilidadBruto)}</span>
              </div>

              <div className="flex justify-between py-2 pl-4 text-gray-600">
                <span>(-) Gastos de Venta y Distribución:</span>
                <span className="font-mono">({formatCurrency(report.gastosVenta)})</span>
              </div>

              <div className="flex justify-between py-2 pl-4 text-gray-600">
                <span>(-) Gastos de Administración:</span>
                <span className="font-mono">({formatCurrency(report.gastosAdmin)})</span>
              </div>

              <div className="flex justify-between py-2 bg-slate-50 font-bold px-2">
                <span>UTILIDAD DE OPERACIÓN:</span>
                <span className="font-mono">{formatCurrency(report.utilidadOperacion)}</span>
              </div>

              <div className="flex justify-between py-2">
                <span>(+) PRODUCTOS FINANCIEROS:</span>
                <span className="font-mono">+{formatCurrency(report.productosFinancieros)}</span>
              </div>

              <div className="flex justify-between py-3 bg-slate-900 text-white font-bold px-4 rounded mt-4">
                <span className="text-sm">UTILIDAD DEL EJERCICIO INDISCUTIBLE:</span>
                <span className="font-mono text-sm">{formatCurrency(report.utilidadNeta)}</span>
              </div>
            </div>
          </div>
        </div>


        {/* ======================================= */}
        {/* f) BALANCE GENERAL perfectamente cuadrado */}
        {/* ======================================= */}
        <div className="space-y-6 pt-8 page-break-before page-break-inside-avoid">
          <div className="border-b border-slate-900 pb-2">
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
              f) Balance General de Cierre Cuadrado
            </h2>
            <p className="text-xs text-slate-500 mt-1">Al 31 de Diciembre de {satInfo.ejercicio}. Demostración técnica del equilibrio patrimonial.</p>
          </div>

          <div className="border border-slate-300 rounded-xl overflow-hidden text-xs bg-white">
            <div className="grid grid-cols-2 divide-x divide-slate-300">
              
              {/* Left Column: ACTIVO */}
              <div className="p-4 space-y-4">
                <h3 className="font-bold border-b border-slate-500 pb-1 text-slate-900 uppercase">Activo</h3>
                
                {/* Circulante */}
                <div className="space-y-1.5">
                  <h4 className="font-semibold text-slate-500 uppercase text-[10px]">Circulante</h4>
                  {bs.activoCirculante.accounts.map((acc) => (
                    <div key={acc.code} className="flex justify-between pr-2 text-slate-800">
                      <span>{acc.name} ({acc.code})</span>
                      <span className="font-mono">{formatCurrency(acc.balance)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pr-2 border-t border-dashed border-gray-300 pt-1 font-semibold text-slate-700">
                    <span>Suma Circulante:</span>
                    <span className="font-mono">{formatCurrency(bs.activoCirculante.total)}</span>
                  </div>
                </div>

                {/* No Circulante */}
                {bs.activoNoCirculante.accounts.length > 0 && (
                  <div className="space-y-1.5 pt-3">
                    <h4 className="font-semibold text-slate-500 uppercase text-[10px]">No Circulante (Fijo)</h4>
                    {bs.activoNoCirculante.accounts.map((acc) => (
                      <div key={acc.code} className="flex justify-between pr-2 text-slate-800">
                        <span>{acc.name} ({acc.code})</span>
                        <span className="font-mono">{formatCurrency(acc.balance)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pr-2 border-t border-dashed border-gray-300 pt-1 font-semibold text-slate-700">
                      <span>Suma Fijo:</span>
                      <span className="font-mono">{formatCurrency(bs.activoNoCirculante.total)}</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between bg-slate-900 text-white font-bold px-3 py-2 rounded -mx-1 mt-6">
                  <span>SUMA DEL ACTIVO</span>
                  <span className="font-mono">{formatCurrency(bs.totalActivo)}</span>
                </div>
              </div>

              {/* Right Column: PASIVO Y CAPITAL */}
              <div className="p-4 space-y-4">
                <h3 className="font-bold border-b border-slate-500 pb-1 text-slate-900 uppercase">Pasivo y Capital</h3>

                {/* Pasivo Corto Plazo */}
                <div className="space-y-1.5">
                  <h4 className="font-semibold text-slate-500 uppercase text-[10px]">Pasivo Corto Plazo</h4>
                  {bs.pasivoCortoPlazo.accounts.map((acc) => (
                    <div key={acc.code} className="flex justify-between pr-2 text-slate-800">
                      <span>{acc.name} ({acc.code})</span>
                      <span className="font-mono">{formatCurrency(acc.balance)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pr-2 border-t border-dashed border-gray-300 pt-1 font-semibold text-slate-700">
                    <span>Suma Pasivo CP:</span>
                    <span className="font-mono">{formatCurrency(bs.pasivoCortoPlazo.total)}</span>
                  </div>
                </div>

                {/* Pasivo Largo Plazo */}
                {bs.pasivoLargoPlazo.accounts.length > 0 && (
                  <div className="space-y-1.5 pt-3">
                    <h4 className="font-semibold text-slate-500 uppercase text-[10px]">Pasivo Largo Plazo</h4>
                    {bs.pasivoLargoPlazo.accounts.map((acc) => (
                      <div key={acc.code} className="flex justify-between pr-2 text-slate-800">
                        <span>{acc.name} ({acc.code})</span>
                        <span className="font-mono">{formatCurrency(acc.balance)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pr-2 border-t border-dashed border-gray-300 pt-1 font-semibold text-slate-700">
                      <span>Suma Pasivo LP:</span>
                      <span className="font-mono">{formatCurrency(bs.pasivoLargoPlazo.total)}</span>
                    </div>
                  </div>
                )}

                {/* Capital Contable */}
                <div className="space-y-1.5 pt-3">
                  <h4 className="font-semibold text-slate-500 uppercase text-[10px]">Capital Contable y Utilidad</h4>
                  {bs.capitalContable.accounts.map((acc) => (
                    <div key={acc.code} className="flex justify-between pr-2 text-slate-800">
                      <span>{acc.name} ({acc.code})</span>
                      <span className="font-mono">{formatCurrency(acc.balance)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pr-2 border-t border-dashed border-gray-300 pt-1 font-semibold text-slate-700">
                    <span>Suma del Capital:</span>
                    <span className="font-mono">{formatCurrency(bs.totalCapital)}</span>
                  </div>
                </div>

                <div className="flex justify-between bg-slate-900 text-white font-bold px-3 py-2 rounded -mx-1 mt-6">
                  <span>SUMA DEL PASIVO Y CAPITAL</span>
                  <span className="font-mono">{formatCurrency(bs.totalPasivoYCapital)}</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
