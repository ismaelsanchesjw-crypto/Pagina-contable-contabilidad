import React, { useState } from 'react';
import { JournalEntry, JournalItem } from '../types/accounting';
import { useAccountingStore } from '../store/useAccountingStore';
import { FileText, Plus, Edit, Trash2, Search, ArrowUpDown, Filter, RotateCcw } from 'lucide-react';

interface JournalViewProps {
  onEditEntry: (entry: JournalEntry) => void;
  onNewEntry: () => void;
}

export const JournalView: React.FC<JournalViewProps> = ({ onEditEntry, onNewEntry }) => {
  const { entries, deleteEntry, resetToInitial } = useAccountingStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'Todos' | 'Diario' | 'Ingreso' | 'Egreso'>('Todos');
  const [sortBy, setSortBy] = useState<'date' | 'number'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);


  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(val);
  };

  // Filter & Sort
  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.items.some(
        (item) =>
          item.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.accountCode.includes(searchTerm)
      );

    const matchesType = typeFilter === 'Todos' || entry.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (sortBy === 'date') {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) {
        return sortOrder === 'asc' ? dateCompare : -dateCompare;
      }
      // fallback to entry number if date is same
      return sortOrder === 'asc' ? a.number - b.number : b.number - a.number;
    } else {
      return sortOrder === 'asc' ? a.number - b.number : b.number - a.number;
    }
  });

  // Calculate entry debits / credits sum
  const getTotals = (items: JournalItem[]) => {
    const debits = items.reduce((sum, item) => sum + item.debit, 0);
    const credits = items.reduce((sum, item) => sum + item.credit, 0);
    return {
      debits,
      credits,
      isBalanced: Math.abs(debits - credits) < 0.01
    };
  };

  const getEntryBadgeColor = (type: string) => {
    switch (type) {
      case 'Diario':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Ingreso':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Egreso':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Control panel - styled geometrically */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 border border-slate-200 shadow-sm rounded-xs">
        <div className="flex-1 flex flex-col sm:flex-row gap-2">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por concepto o cuenta..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xs text-xs focus:outline-hidden focus:ring-1 focus:ring-cyan-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1">
            <Filter className="h-4 w-4 text-slate-400 mr-1 hidden sm:inline" />
            <select
              className="border border-slate-200 rounded-xs text-xs px-3 py-2 bg-white focus:outline-hidden focus:ring-1 focus:ring-cyan-500 cursor-pointer"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
            >
              <option value="Todos">Tipo: Todos</option>
              <option value="Diario">Diario</option>
              <option value="Ingreso">Ingreso</option>
              <option value="Egreso">Egreso</option>
            </select>
          </div>

          {/* Order toggler */}
          <button
            onClick={() => {
              if (sortBy === 'date') {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              } else {
                setSortBy('date');
                setSortOrder('asc');
              }
            }}
            className="flex items-center justify-center gap-1 px-3 py-2 border border-slate-200 rounded-xs text-xs hover:bg-slate-50 text-slate-700 font-bold uppercase transition-colors cursor-pointer"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span>Fecha ({sortOrder === 'asc' ? 'Asc' : 'Desc'})</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={resetToInitial}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-slate-300 text-slate-600 rounded-xs text-xs font-bold uppercase hover:bg-slate-50 cursor-pointer transition-colors"
            title="Restaurar el ejercicio de 15 pólizas iniciales"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restaurar Iniciales</span>
          </button>

          <button
            onClick={onNewEntry}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xs text-xs font-bold uppercase tracking-wide cursor-pointer transition-colors"
          >
            <Plus className="h-3.5 w-3.5 text-cyan-400" />
            <span>Nueva Póliza</span>
          </button>
        </div>
      </div>

      {/* Main Journal entries list */}
      <div className="space-y-6">
        {sortedEntries.length === 0 ? (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-xs">
            <p className="text-slate-400 text-xs">No se encontraron pólizas con las especificaciones.</p>
          </div>
        ) : (
          sortedEntries.map((entry) => {
            const { debits, credits, isBalanced } = getTotals(entry.items);
            return (
              <div
                key={entry.id}
                id={`entry-${entry.id}`}
                className="bg-white border border-slate-200 rounded-xs overflow-hidden shadow-sm"
              >
                {/* Entry Header - dark high-contrast header */}
                <div className="bg-slate-900 text-white border-b border-slate-800 px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 select-none">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 tracking-wider">
                      ID: {entry.id}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 bg-cyan-900 text-cyan-300 border border-cyan-800 tracking-wide uppercase">
                      Póliza de {entry.type} #{entry.number}
                    </span>
                    <span className="text-xs font-mono text-slate-300">
                      📅 {entry.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {isBalanced ? (
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 font-bold px-2 py-0.5 border border-emerald-800 uppercase tracking-wide">
                        ✓ Cuadrado
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-950 text-amber-400 font-bold px-2 py-0.5 border border-amber-800 uppercase tracking-wide animate-pulse">
                        ⚠️ No Cuadrado
                      </span>
                    )}

                    {confirmDeleteId === entry.id ? (
                      <div className="flex items-center gap-1.5 bg-red-950/80 px-2 py-1 border border-red-800 text-[10px] select-none">
                        <span className="text-red-300 font-bold uppercase tracking-widest mr-1">¿Eliminar póliza?</span>
                        <button
                          onClick={() => {
                            deleteEntry(entry.id);
                            setConfirmDeleteId(null);
                          }}
                          className="bg-red-600 hover:bg-red-500 text-white font-extrabold px-2 py-0.5 uppercase transition-all cursor-pointer"
                        >
                          Borrar
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold px-2 py-0.5 uppercase transition-all cursor-pointer"
                        >
                          Regresar
                        </button>
                      </div>
                    ) : (
                      <div className="inline-flex rounded-xs border border-slate-700 overflow-hidden bg-slate-800">
                        <button
                          onClick={() => onEditEntry(entry)}
                          className="p-1.5 hover:bg-slate-700 text-slate-300 border-r border-slate-700 cursor-pointer transition-colors"
                          title="Editar póliza"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(entry.id)}
                          className="p-1.5 hover:bg-red-950 hover:text-red-400 text-slate-300 cursor-pointer transition-colors"
                          title="Eliminar póliza"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Entry details / Concept */}
                <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Concepto General de Operación</p>
                  <p className="text-sm font-semibold text-slate-800">{entry.concept}</p>
                </div>

                {/* Journal Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-white">
                        <th className="px-5 py-2.5 w-32 font-mono">Código</th>
                        <th className="px-5 py-2.5">Cuenta Contable</th>
                        <th className="px-5 py-2.5 text-right w-40">Debe (Cargo)</th>
                        <th className="px-5 py-2.5 text-right w-40">Haber (Abono)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-xs text-slate-800">
                      {entry.items.map((item, idx) => {
                        const isCredit = item.credit > 0;
                        return (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="px-5 py-2 font-semibold text-slate-500">
                              {item.accountCode}
                            </td>
                            <td className={`px-5 py-2 font-medium font-sans uppercase ${isCredit ? 'pl-12 text-slate-600' : 'text-slate-900 border-l-2 border-slate-900'}`}>
                              {item.accountName}
                            </td>
                            <td className="px-5 py-2 text-right">
                              {item.debit > 0 ? formatCurrency(item.debit) : '–'}
                            </td>
                            <td className="px-5 py-2 text-right">
                              {item.credit > 0 ? formatCurrency(item.credit) : '–'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50/70 border-t border-slate-200">
                        <td colSpan={2} className="px-5 py-3 text-right uppercase tracking-widest text-[10px] font-bold text-slate-400">
                          Sumas Iguales:
                        </td>
                        <td className="px-5 py-3 text-right font-mono text-xs font-bold text-slate-900">
                          {formatCurrency(debits)}
                        </td>
                        <td className="px-5 py-3 text-right font-mono text-xs font-bold text-slate-900">
                          {formatCurrency(credits)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
