import React, { useState } from 'react';
import { useAccountingStore } from '../store/useAccountingStore';
import { calculateBalanceSheet, calculateIncomeStatement } from '../utils/accountingMath';
import { 
  Building2, 
  ChevronRight, 
  Check, 
  MapPin, 
  Tag, 
  BookOpen, 
  Scale, 
  Calendar, 
  UserCheck, 
  FileText,
  BookmarkCheck
} from 'lucide-react';

export const FinancialCoverPortal: React.FC = () => {
  const { entries, satInfo, updateSatInfo, setShowCoverPage } = useAccountingStore();
  
  // SAT and Document states initialized from store
  const [razonSocial, setRazonSocial] = useState(satInfo.razonSocial);
  const [rfc, setRfc] = useState(satInfo.rfc);
  const [domicilioFiscal, setDomicilioFiscal] = useState(satInfo.domicilioFiscal);
  const [regimenFiscal, setRegimenFiscal] = useState(satInfo.regimenFiscal);
  const [ejercicio, setEjercicio] = useState(satInfo.ejercicio);
  const [metodoInventarios, setMetodoInventarios] = useState(satInfo.metodoInventarios);
  const [evaluacionValorativa, setEvaluacionValorativa] = useState(satInfo.evaluacionValorativa);
  const [periodoAnalizado, setPeriodoAnalizado] = useState(satInfo.periodoAnalizado);
  const [responsabilidad, setResponsabilidad] = useState(satInfo.responsabilidad);
  const [ciudadEstado, setCiudadEstado] = useState(satInfo.ciudadEstado);
  
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSatInfo({
      rfc: rfc.toUpperCase().trim(),
      razonSocial: razonSocial.toUpperCase().trim(),
      domicilioFiscal: domicilioFiscal.trim(),
      regimenFiscal: regimenFiscal.trim(),
      ejercicio: ejercicio.trim(),
      metodoInventarios: metodoInventarios.toUpperCase().trim(),
      evaluacionValorativa: evaluacionValorativa.toUpperCase().trim(),
      periodoAnalizado: periodoAnalizado.trim(),
      responsabilidad: responsabilidad.trim(),
      ciudadEstado: ciudadEstado.toUpperCase().trim()
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleEnter = () => {
    // Save current values to database state
    handleSave();
    setShowCoverPage(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-hidden">
      {/* Dynamic Background Layout */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation & Brand */}
      <div className="w-full max-w-7xl mx-auto px-6 py-6 border-b border-slate-800 flex items-center justify-between relative z-10 select-none">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-cyan-500 flex items-center justify-center font-black text-lg text-slate-950">
            Σ
          </div>
          <div>
            <span className="text-lg font-black tracking-widest uppercase block leading-none">
              ARCHILEDGER <span className="text-cyan-400 font-light">Pro</span>
            </span>
            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono block mt-0.5">
              Portal Tributario y Control Interno
            </span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-850 px-4 py-1.5 text-xs text-amber-400 select-none">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-mono text-[10px] tracking-widest uppercase text-slate-400">EJERCICIO DE DECLARACIÓN ACTIVO</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-7xl mx-auto px-6 py-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 items-stretch">
        
        {/* LEFT COLUMN: The Interactive Configurator Form (Span 5) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block font-mono">DETERMINACIÓN Y CONFIGURACIÓN</span>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight mt-1">Cédula del Contribuyente</h2>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">
                Configure los datos registrales ante el SAT y las especificaciones técnicas del inventario para la portada oficial de información financiera.
              </p>
            </div>

            <form className="space-y-4">
              {/* Razón Social */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Razón Social</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Escriba la Razón Social"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-none text-slate-200 focus:outline-hidden focus:border-cyan-500 uppercase font-semibold"
                    value={razonSocial}
                    onChange={(e) => setRazonSocial(e.target.value.toUpperCase())}
                  />
                </div>
              </div>

              {/* RFC (Registro Contribuyente) */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Registro de Contribuyente (RFC)</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    maxLength={14}
                    placeholder="Escriba el RFC"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-none text-slate-200 focus:outline-hidden focus:border-cyan-500 font-mono uppercase"
                    value={rfc}
                    onChange={(e) => setRfc(e.target.value.toUpperCase())}
                  />
                </div>
              </div>

              {/* Domicilio Fiscal */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Domicilio Fiscal Oficial</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                     type="text"
                     required
                     placeholder="Dirección Fiscal"
                     className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-none text-slate-200 focus:outline-hidden focus:border-cyan-500"
                     value={domicilioFiscal}
                     onChange={(e) => setDomicilioFiscal(e.target.value)}
                  />
                </div>
              </div>

              {/* Régimen Fiscal Selector */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Regimen Fiscal Ley SAT</label>
                <select
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-none text-slate-200 focus:outline-hidden focus:border-cyan-500 cursor-pointer"
                  value={regimenFiscal}
                  onChange={(e) => setRegimenFiscal(e.target.value)}
                >
                  <option value="601 - General de Ley Personas Morales">601 - General de Ley Personas Morales</option>
                  <option value="603 - Personas Morales con Fines no Lucrativos">603 - Personas Morales con Fines no Lucrativos</option>
                  <option value="605 - Sueldos y Salarios">605 - Sueldos y Salarios</option>
                  <option value="626 - Régimen Simplificado de Confianza (RESICO)">626 - RESICO</option>
                </select>
              </div>

              {/* 2x2 Grid for specific Technical accounting attributes */}
              <div className="grid grid-cols-2 gap-4">
                {/* Ejercicio */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ejercicio</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      maxLength={4}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-none text-slate-200 focus:outline-hidden focus:border-cyan-500 font-mono"
                      value={ejercicio}
                      onChange={(e) => setEjercicio(e.target.value.replace(/[^0-9]/g, ''))}
                    />
                  </div>
                </div>

                {/* Periodo Analizado */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Periodo Analizado</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-none text-slate-200 focus:outline-hidden focus:border-cyan-500 font-mono"
                      value={periodoAnalizado}
                      onChange={(e) => setPeriodoAnalizado(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Método de Inventario */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Método de Inventarios</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-none text-slate-200 focus:outline-hidden focus:border-cyan-500 font-mono uppercase"
                    value={metodoInventarios}
                    onChange={(e) => setMetodoInventarios(e.target.value)}
                  />
                </div>
              </div>

              {/* Evaluación Valorativa */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Evaluación Valorativa</label>
                <div className="relative">
                  <Scale className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-none text-slate-200 focus:outline-hidden focus:border-cyan-500 uppercase"
                    value={evaluacionValorativa}
                    onChange={(e) => setEvaluacionValorativa(e.target.value)}
                  />
                </div>
              </div>

              {/* Responsabilidad & Ciudad-Estado Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Responsabilidad</label>
                  <div className="relative">
                    <UserCheck className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-none text-slate-200 focus:outline-hidden focus:border-cyan-500"
                      value={responsabilidad}
                      onChange={(e) => setResponsabilidad(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ciudad, Estado</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-none text-slate-200 focus:outline-hidden focus:border-cyan-500"
                    value={ciudadEstado}
                    onChange={(e) => setCiudadEstado(e.target.value)}
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="space-y-3 pt-6 border-t border-slate-800">
            <button
              onClick={() => handleSave()}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 text-xs font-bold uppercase tracking-wider border border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {saveSuccess ? <Check className="w-4 h-4 text-cyan-400" /> : null}
              <span>{saveSuccess ? 'CONFIGURACIÓN GUARDADA' : 'SINCRO-RESPALDAR VARIABLES'}</span>
            </button>

            <button
              onClick={handleEnter}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 py-3 text-xs font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg group"
            >
              <span>INGRESAR AL LIBRO DIARIO PRO</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: The exact replication of the Cover image (Span 7) */}
        <div className="lg:col-span-12 xl:col-span-7 flex justify-center items-center p-2 sm:p-4 bg-slate-900 border border-slate-850 overflow-y-auto">
          
          {/* Replica Outer Sheet (Mimicking the image ratio and shadows) */}
          <div className="bg-white text-slate-900 w-full max-w-[460px] min-h-[640px] shadow-2xl p-8 flex flex-col justify-between items-center text-center font-sans border border-slate-200 select-none relative my-4">
            
            {/* Top Store/Building icon */}
            <div className="flex flex-col items-center mt-6">
              {/* Custom high-quality vector style storefront using pure inline CSS or a perfect vector render */}
              <div className="w-16 h-16 relative flex items-center justify-center bg-slate-50 border border-slate-100 rounded-lg p-2.5 shadow-xs mb-3">
                <svg viewBox="0 0 64 64" className="w-full h-full text-cyan-600 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M56 52h-2V28H10v24H8a2 2 0 000 4h48a2 2 0 000-4zM24 52h-8v-8h8v8zm14 0h-8V40h8v12zm14 0h-8v-8h8v8zM12 24h40l-2.5-8.3A2 2 0 0047.6 14H16.4a2 2 0 00-1.9 1.7L12 24zm4.5-6h31l1.5 5H15l1.5-5zM32 4a6 6 0 106 6 6 6 0 00-6-6zm0 8a2 2 0 112-2 2 2 0 01-2 2z" />
                </svg>
              </div>

              {/* Razón Social Title */}
              <h1 className="text-2xl font-black uppercase text-slate-900 tracking-tight leading-tight mt-1 font-sans">
                {razonSocial || 'ZITÁCUARO IMPORT'}
              </h1>
            </div>

            {/* Tax official details */}
            <div className="mt-4 space-y-4 max-w-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  REGISTRO DE CONTRIBUYENTE
                </span>
                <span className="text-sm font-mono font-bold text-slate-800 block">
                  {rfc || 'ZIM-980415G34'}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  DOMICILIO FISCAL OFICIAL
                </span>
                <span className="text-xs text-slate-700 leading-relaxed block px-2">
                  {domicilioFiscal || 'Av. Revolución Sur #142, Col. C'}
                </span>
              </div>
            </div>

            {/* Segment border line */}
            <div className="w-full max-w-sm border-t border-slate-200 my-6" />

            {/* Core Section Cover labels */}
            <div className="space-y-4 my-2">
              <div className="space-y-1">
                <div className="text-[10.5px] font-bold text-cyan-800 uppercase tracking-widest font-sans">
                  ESTUDIO CONTABLE COADYUVANTE
                </div>
              </div>
              
              {/* Portada titles */}
              <div className="space-y-2 py-2">
                <div className="text-3xl font-extrabold text-slate-950 uppercase tracking-widest leading-none">
                  PORTADA
                </div>
                <div className="text-lg font-normal text-slate-800 uppercase tracking-widest leading-none">
                  DE
                </div>
                <div className="text-2xl font-black text-slate-950 uppercase tracking-widest leading-none my-1">
                  INFORMACIÓN
                </div>
                <div className="text-2xl font-bold text-slate-950 uppercase tracking-widest leading-none">
                  FINANCIERA
                </div>
              </div>

              {/* Legal small description */}
              <p className="text-[11px] text-slate-500 italic font-medium px-6 max-w-xs leading-relaxed">
                Expedientes integrados bajo el método normativo de registros mercantiles.
              </p>
            </div>

            {/* Bottom Segment border line */}
            <div className="w-full max-w-sm border-t border-slate-200 my-6" />

            {/* Detailed Accounting Technical Specification Frame Box */}
            <div className="w-full max-w-sm border border-slate-400 rounded-2xl p-5 text-left text-xs bg-slate-50/50 space-y-4">
              
              {/* Method row */}
              <div className="border-b border-slate-100 pb-2">
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  MÉTODO DE INVENTARIOS
                </div>
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wide mt-0.5">
                  {metodoInventarios || 'INVENTARIOS PERPETUOS SIN IVA'}
                </div>
              </div>

              {/* Valuation row */}
              <div className="border-b border-slate-100 pb-2">
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  EVALUACIÓN VALORATIVA
                </div>
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wide mt-0.5">
                  {evaluacionValorativa || 'COSTO ADQUISITIVO DEL PERIODO'}
                </div>
              </div>

              {/* Period Row */}
              <div className="border-b border-slate-100 pb-2 flex justify-between items-end">
                <div>
                  <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                    PERIODO ANALIZADO
                  </div>
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wide mt-0.5">
                    Del {periodoAnalizado || '01/01/2020'}
                  </div>
                </div>
              </div>

              {/* Responsibility Row */}
              <div className="pb-1">
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                  RESPONSABILIDAD
                </div>
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wide mt-0.5">
                  {responsabilidad || 'Dirección de Finanzas'}
                </div>
              </div>

            </div>

            {/* Outer bottom footers */}
            <div className="mt-8 mb-4 space-y-2">
              <p className="text-[9px] font-mono text-slate-400 tracking-wider">
                CIFRAS EXPRESADAS EN PESOS MEXICANOS (MXN)
              </p>
              <p className="text-[10px] font-bold text-slate-700 tracking-widest uppercase">
                {ciudadEstado || 'ZITÁCUARO, MICHOACÁN, MÉXICO'}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Solid baseline design info footer */}
      <footer className="w-full bg-slate-900 border-t border-slate-800 py-4 px-8 relative z-10 select-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-[10px] text-slate-500 font-mono tracking-widest gap-4">
          <div>
            DESPACHO ID DE INTEGRACIÓN: {rfc || 'ZIM-980415G34'}-SYS2026
          </div>
          <div>
            PORTAL CERTIFICADO DE PARTIDA DOBLE CUADRADA - ARCHILEDGER PRO
          </div>
        </div>
      </footer>
    </div>
  );
};
