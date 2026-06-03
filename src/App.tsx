import { useState } from 'react';
import { useAccountingStore } from './store/useAccountingStore';
import { JournalEntry, TabType } from './types/accounting';
import { JournalView } from './components/JournalView';
import { LedgerView } from './components/LedgerView';
import { IncomeStatementView } from './components/IncomeStatementView';
import { BalanceSheetView } from './components/BalanceSheetView';
import { ChartOfAccountsView } from './components/ChartOfAccountsView';
import { PrintPackage } from './components/PrintPackage';
import { EntryForm } from './components/EntryForm';
import { FinancialCoverPortal } from './components/FinancialCoverPortal';
import { calculateBalanceSheet, calculateIncomeStatement } from './utils/accountingMath';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Layers, 
  TrendingUp, 
  Scale, 
  FileText, 
  Printer, 
  Plus, 
  Calculator, 
  BookmarkCheck,
  RefreshCw,
  Wallet,
  Home
} from 'lucide-react';

export default function App() {
  const { entries, addEntry, updateEntry, satInfo, showCoverPage, setShowCoverPage } = useAccountingStore();
  const [activeTab, setActiveTab] = useState<TabType>('diario');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  const bs = calculateBalanceSheet(entries);
  const report = calculateIncomeStatement(entries);

  if (showCoverPage) {
    return <FinancialCoverPortal />;
  }

  // Stats for the status bar
  const totalDebits = entries.reduce((sum, entry) => 
    sum + entry.items.reduce((s, item) => s + item.debit, 0)
  , 0);

  const totalCredits = entries.reduce((sum, entry) => 
    sum + entry.items.reduce((s, item) => s + item.credit, 0)
  , 0);

  const differenceValue = Math.abs(totalDebits - totalCredits);

  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
  };

  const handleNewEntry = () => {
    setEditingEntry(null);
    setIsFormOpen(true);
  };

  const handleSaveEntry = (entry: JournalEntry) => {
    if (editingEntry) {
      updateEntry(editingEntry.id, entry);
    } else {
      addEntry(entry);
    }
    setIsFormOpen(false);
    setEditingEntry(null);
  };

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(val);
  };

  // Render the current view based on selected tab
  const renderView = () => {
    switch (activeTab) {
      case 'diario':
        return (
          <JournalView 
            onEditEntry={handleEditEntry} 
            onNewEntry={handleNewEntry} 
          />
        );
      case 'mayor':
        return <LedgerView />;
      case 'resultados':
        return <IncomeStatementView />;
      case 'balance':
        return <BalanceSheetView />;
      case 'catalogo':
        return <ChartOfAccountsView />;
      default:
        return <JournalView onEditEntry={handleEditEntry} onNewEntry={handleNewEntry} />;
    }
  };

  if (activeTab === 'impresion') {
    return (
      <div className="min-h-screen bg-[#f1f5f9] py-8 px-4 sm:px-6">
        <PrintPackage 
          entries={entries} 
          onBack={() => setActiveTab('diario')} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* Upper Navigation Header bar - Brand and Quick totals in dark Slate */}
      <header className="h-16 flex-none bg-slate-900 text-white flex items-center justify-between px-8 border-b border-slate-700 shadow-lg z-20 print:hidden select-none">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-cyan-500 rounded-xs flex items-center justify-center font-bold text-slate-900">Σ</div>
          <div className="flex flex-col text-left">
            <span className="text-sm sm:text-base font-bold tracking-tight uppercase leading-none">ArchiLedger <span className="text-cyan-400 font-light">Pro</span></span>
            <span className="text-[9px] text-slate-400 mt-0.5 tracking-wider font-mono uppercase truncate max-w-[200px] sm:max-w-xs" title={`${satInfo.razonSocial} (${satInfo.rfc})`}>
              {satInfo.razonSocial} • {satInfo.rfc}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest">Estado del Ejercicio</span>
            <span className={`text-xs font-mono font-bold ${bs.isBalanced ? 'text-emerald-400' : 'text-amber-400'}`}>
              {bs.isBalanced ? 'CUADRADO / PARTIDA DOBLE' : 'DESCUADRADO'}
            </span>
          </div>
          <button 
            onClick={() => setActiveTab('impresion')}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 text-xs font-bold rounded-xs flex items-center transition-all border-0 cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4 mr-2" />
            EXPORTAR PDF COMPLETO
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="w-full flex-1 flex flex-col md:flex-row min-h-0">
        
        {/* Navigation Left Sidebar Panel (Tabs Toggler) */}
        <nav className="w-full md:w-64 flex-none bg-white border-r border-slate-200 flex flex-col p-4 space-y-2 select-none print:hidden">
          <div className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest px-2.5">Módulos Principales</div>
          
          <button
            onClick={() => setActiveTab('diario')}
            className={`flex items-center space-x-3 px-4 py-3 text-sm transition-all cursor-pointer border-y-0 border-r-0 text-left rounded-xs ${
              activeTab === 'diario'
                ? 'bg-slate-50 border-l-4 border-cyan-600 text-cyan-700 font-semibold'
                : 'text-slate-500 border-l-4 border-transparent hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <FileText className="h-4 w-4 text-slate-400" />
            <span>Libro Diario</span>
          </button>

          <button
            onClick={() => setActiveTab('mayor')}
            className={`flex items-center space-x-3 px-4 py-3 text-sm transition-all cursor-pointer border-y-0 border-r-0 text-left rounded-xs ${
              activeTab === 'mayor'
                ? 'bg-slate-50 border-l-4 border-cyan-600 text-cyan-700 font-semibold'
                : 'text-slate-500 border-l-4 border-transparent hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Layers className="h-4 w-4 text-slate-400" />
            <span>Esquemas de Mayor</span>
          </button>

          <div className="text-[10px] font-bold text-slate-400 uppercase mt-4 mb-2 tracking-widest px-2.5">Reportería de Cierre</div>

          <button
            onClick={() => setActiveTab('resultados')}
            className={`flex items-center space-x-3 px-4 py-3 text-sm transition-all cursor-pointer border-y-0 border-r-0 text-left rounded-xs ${
              activeTab === 'resultados'
                ? 'bg-slate-50 border-l-4 border-cyan-600 text-cyan-700 font-semibold'
                : 'text-slate-500 border-l-4 border-transparent hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="h-4 w-4 text-slate-400" />
            <span>Estado de Resultados</span>
          </button>

          <button
            onClick={() => setActiveTab('balance')}
            className={`flex items-center space-x-3 px-4 py-3 text-sm transition-all cursor-pointer border-y-0 border-r-0 text-left rounded-xs ${
              activeTab === 'balance'
                ? 'bg-slate-50 border-l-4 border-cyan-600 text-cyan-700 font-semibold'
                : 'text-slate-500 border-l-4 border-transparent hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Scale className="h-4 w-4 text-slate-400" />
            <span>Balance General</span>
          </button>

          <button
            onClick={() => setActiveTab('catalogo')}
            className={`flex items-center space-x-3 px-4 py-3 text-sm transition-all cursor-pointer border-y-0 border-r-0 text-left rounded-xs ${
              activeTab === 'catalogo'
                ? 'bg-slate-50 border-l-4 border-cyan-600 text-cyan-700 font-semibold'
                : 'text-slate-500 border-l-4 border-transparent hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <BookOpen className="h-4 w-4 text-slate-400" />
            <span>Catálogo de Cuentas</span>
          </button>

          <div className="text-[10px] font-bold text-slate-400 uppercase mt-4 mb-2 tracking-widest px-2.5">Configuración</div>

          <button
            onClick={() => setShowCoverPage(true)}
            className="flex items-center space-x-3 px-4 py-3 text-sm text-slate-500 border-l-4 border-transparent hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer border-y-0 border-r-0 text-left rounded-xs w-full"
          >
            <Home className="h-4 w-4 text-slate-400" />
            <span>Portada / Registro SAT</span>
          </button>


          {/* Sidebar decorative box widget on utility metrics */}
          <div className="mt-auto p-4 bg-slate-900 rounded-xs text-white">
            <div className="text-[10px] text-cyan-400 mb-1 uppercase font-bold">Cálculo de Utilidad</div>
            <div className="text-2xl font-mono">{formatCurrency(report.utilidadNeta)}</div>
            <div className="text-[9px] text-slate-400 mt-2">Basado en {entries.length} pólizas operativas</div>
          </div>
        </nav>

        {/* Content View Panel with geometric container and margins */}
        <main className="flex-1 p-6 md:p-8 min-w-0 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="h-full focus:outline-hidden"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Bottom Status Bar matching mockup exactly */}
      <footer className="h-8 flex-none bg-white border-t border-slate-200 px-8 flex items-center justify-between text-[10px] text-slate-400 font-mono tracking-wider print:hidden select-none">
        <div>SYS_ID: 2020-ACC-{entries.length}-POL</div>
        <div className="flex space-x-6">
          <span>ASIENTOS: {entries.length}</span>
          <span>DEBE: {formatCurrency(totalDebits)}</span>
          <span>HABER: {formatCurrency(totalCredits)}</span>
          <span className={differenceValue < 0.01 ? "text-emerald-500 font-bold" : "text-amber-500 font-bold"}>
            DIF: {formatCurrency(differenceValue)}
          </span>
        </div>
        <div>V-1.0.4 - ZUSTAND ENGINE</div>
      </footer>

      {/* EntryForm Modal dialogue */}
      {isFormOpen && (
        <EntryForm
          entry={editingEntry}
          onSave={handleSaveEntry}
          onClose={() => {
            setIsFormOpen(false);
            setEditingEntry(null);
          }}
        />
      )}
    </div>
  );
}
