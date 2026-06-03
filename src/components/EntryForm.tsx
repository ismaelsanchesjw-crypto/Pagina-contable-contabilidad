import React, { useState, useEffect } from 'react';
import { JournalEntry, JournalItem } from '../types/accounting';
import { Plus, Trash2, X, Info, AlertTriangle } from 'lucide-react';

interface EntryFormProps {
  entry?: JournalEntry | null; // if passed, we are editing
  onSave: (entry: JournalEntry) => void;
  onClose: () => void;
}

export const EntryForm: React.FC<EntryFormProps> = ({ entry, onSave, onClose }) => {
  const [date, setDate] = useState('2020-12-01');
  const [type, setType] = useState<'Diario' | 'Ingreso' | 'Egreso'>('Diario');
  const [number, setNumber] = useState(1);
  const [concept, setConcept] = useState('');
  const [items, setItems] = useState<JournalItem[]>([
    { accountCode: '', accountName: '', debit: 0, credit: 0 },
    { accountCode: '', accountName: '', debit: 0, credit: 0 },
  ]);

  // Load existing data if editing
  useEffect(() => {
    if (entry) {
      setDate(entry.date);
      setType(entry.type);
      setNumber(entry.number);
      setConcept(entry.concept);
      // deep copy items
      setItems(entry.items.map((it) => ({ ...it })));
    }
  }, [entry]);

  // Pre-loaded suggest accounts to helper user ease inputs
  const commonAccounts = [
    { code: '101.00', name: 'CAJA' },
    { code: '102.00', name: 'BANCOS' },
    { code: '120.00', name: 'ALMACÉN' },
    { code: '104.00', name: 'CLIENTES' },
    { code: '106.00', name: 'DOCUMENTOS POR COBRAR' },
    { code: '151.00', name: 'TERRENOS' },
    { code: '160.00', name: 'EQUIPO DE REPARTO' },
    { code: '201.00', name: 'PROVEEDORES' },
    { code: '203.00', name: 'DOCUMENTOS POR PAGAR' },
    { code: '301.00', name: 'CAPITAL SOCIAL' },
    { code: '354.00', name: 'UTILIDAD DEL EJERCICIO' },
    { code: '401.00', name: 'VENTAS' },
    { code: '501.00', name: 'COSTO DE VENTAS' },
    { code: '601.00', name: 'GASTOS DE VENTA Y DISTRIBUCIÓN' },
    { code: '602.00', name: 'GASTOS DE ADMINISTRACIÓN' },
    { code: '760.00', name: 'PRODUCTOS FINANCIEROS' },
    { code: '900.00', name: 'PÉRDIDA Y GANANCIAS' },
  ];

  const handleItemChange = (index: number, field: keyof JournalItem, value: any) => {
    const updated = [...items];
    
    if (field === 'accountCode') {
      // Auto-fill name if matching common accounts
      const matched = commonAccounts.find((a) => a.code === value);
      updated[index].accountCode = value;
      if (matched) {
        updated[index].accountName = matched.name;
      }
    } else if (field === 'debit') {
      // Clear credit if debit is set to positive
      const debitValue = parseFloat(value) || 0;
      updated[index].debit = debitValue;
      if (debitValue > 0) {
        updated[index].credit = 0;
      }
    } else if (field === 'credit') {
      // Clear debit if credit is set to positive
      const creditValue = parseFloat(value) || 0;
      updated[index].credit = creditValue;
      if (creditValue > 0) {
        updated[index].debit = 0;
      }
    } else {
      updated[index][field] = value as never;
    }
    
    setItems(updated);
  };

  const addItemRow = () => {
    setItems([...items, { accountCode: '', accountName: '', debit: 0, credit: 0 }]);
  };

  const removeItemRow = (index: number) => {
    if (items.length <= 2) {
      alert('Una póliza requiere al menos dos partidas contables.');
      return;
    }
    setItems(items.filter((_, idx) => idx !== index));
  };

  const totalDebits = items.reduce((sum, item) => sum + item.debit, 0);
  const totalCredits = items.reduce((sum, item) => sum + item.credit, 0);
  const discrepancy = Math.abs(totalDebits - totalCredits);
  const isBalanced = discrepancy < 0.01;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept.trim()) {
      alert('Favor de ingresar el concepto de la póliza.');
      return;
    }
    if (!isBalanced) {
      alert(`La póliza no está cuadrada. Existe un desbalance de $${discrepancy.toFixed(2)}.`);
      return;
    }
    // Check for empty rows
    const validItems = items.filter((it) => it.accountCode && it.accountName && (it.debit > 0 || it.credit > 0));
    if (validItems.length < 2) {
      alert('Favor de registrar al menos dos partidas contables válidas con código, nombre e importes.');
      return;
    }

    onSave({
      id: entry?.id || 'a' + Date.now().toString(36), // generate unique short string ID
      date,
      type,
      number,
      concept: concept.toUpperCase(),
      items: validItems
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-none w-full max-w-4xl shadow-xl border border-slate-300 flex flex-col my-8 max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-905 text-slate-800 border-b border-slate-200 flex items-center justify-between rounded-none">
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
            {entry ? `Editar Póliza: ID ${entry.id}` : 'Registrar Nueva Póliza de Diario'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 p-1.5 rounded-none hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 border border-slate-200 rounded-none">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Fecha</label>
              <input
                type="date"
                required
                className="w-full text-xs border border-slate-200 rounded-xs p-2 bg-white focus:outline-hidden focus:ring-1 focus:ring-cyan-500 font-mono"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tipo de Póliza</label>
              <select
                className="w-full text-xs border border-slate-200 rounded-xs p-2 bg-white focus:outline-hidden focus:ring-1 focus:ring-cyan-500 cursor-pointer"
                value={type}
                onChange={(e) => setType(e.target.value as any)}
              >
                <option value="Diario">Diario</option>
                <option value="Ingreso">Ingreso</option>
                <option value="Egreso">Egreso</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Número</label>
              <input
                type="number"
                min="1"
                required
                className="w-full text-xs border border-slate-200 rounded-xs p-2 bg-white focus:outline-hidden focus:ring-1 focus:ring-cyan-500 font-mono"
                value={number}
                onChange={(e) => setNumber(parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="sm:col-span-2 md:col-span-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Estatus Doble Partida</label>
              {isBalanced ? (
                <div className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 p-2 rounded-none font-bold uppercase tracking-wider flex items-center gap-1 select-none">
                  ✓ Balance Completo
                </div>
              ) : (
                <div className="text-[10px] bg-red-50 text-red-800 border border-red-200 p-2 rounded-none font-bold uppercase tracking-wider flex items-center gap-1 animate-pulse select-none">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
                  <span>Dif: ${discrepancy.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Concepto o Descripción General</label>
            <input
              type="text"
              required
              placeholder="Ej: REG. GASTOS DE OPERACIÓN EFECTUADOS..."
              className="w-full text-xs border border-slate-200 rounded-xs p-2 bg-white focus:outline-hidden focus:ring-1 focus:ring-cyan-500 uppercase"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
            />
          </div>

          {/* Items Partidas section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Partidas Contables</h4>
              <button
                type="button"
                onClick={addItemRow}
                className="flex items-center gap-1.5 text-xs text-slate-800 hover:text-slate-900 border border-slate-300 px-3 py-1.5 rounded-none hover:bg-slate-50 cursor-pointer transition-colors font-bold uppercase"
              >
                <Plus className="h-3.5 w-3.5 text-cyan-600" />
                <span>Agregar Partida</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-none overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 select-none">
                  <tr>
                    <th className="px-4 py-3 w-40">Código Cta</th>
                    <th className="px-4 py-3">Nombre Cuenta</th>
                    <th className="px-4 py-3 text-right w-40">Debe (Cargo)</th>
                    <th className="px-4 py-3 text-right w-40">Haber (Abono)</th>
                    <th className="px-3 py-3 w-12 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/20">
                      {/* Code Input */}
                      <td className="px-4 py-1.5">
                        <input
                          type="text"
                          required
                          placeholder="Ej: 101.00"
                          className="w-full text-xs font-mono border border-slate-200 rounded-xs p-1 bg-white focus:outline-hidden focus:ring-1 focus:ring-cyan-500"
                          value={item.accountCode}
                          onChange={(e) => handleItemChange(idx, 'accountCode', e.target.value)}
                          list="account-codes"
                        />
                      </td>

                      {/* Name Input */}
                      <td className="px-4 py-1.5 font-sans font-semibold text-slate-705">
                        <input
                          type="text"
                          required
                          placeholder="CAJA, BANCOS, etc."
                          className="w-full text-xs border border-slate-200 rounded-xs p-1 bg-white focus:outline-hidden focus:ring-1 focus:ring-cyan-500 uppercase"
                          value={item.accountName}
                          onChange={(e) => handleItemChange(idx, 'accountName', e.target.value)}
                        />
                      </td>

                      {/* Debit Input */}
                      <td className="px-4 py-1.5 text-right">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          className="w-full text-xs font-mono border border-slate-200 rounded-xs p-1 text-right bg-white focus:outline-hidden focus:ring-1 focus:ring-cyan-500"
                          value={item.debit || ''}
                          onChange={(e) => handleItemChange(idx, 'debit', e.target.value)}
                        />
                      </td>

                      {/* Credit Input */}
                      <td className="px-4 py-1.5 text-right">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          className="w-full text-xs font-mono border border-slate-200 rounded-xs p-1 text-right bg-white focus:outline-hidden focus:ring-1 focus:ring-cyan-500"
                          value={item.credit || ''}
                          onChange={(e) => handleItemChange(idx, 'credit', e.target.value)}
                        />
                      </td>

                      {/* Delete Action */}
                      <td className="px-3 py-1.5 text-center">
                        <button
                          type="button"
                          onClick={() => removeItemRow(idx)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded-xs hover:bg-slate-100 cursor-pointer transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 border-t border-slate-200 font-bold text-xs text-slate-800">
                  <tr>
                    <td colSpan={2} className="px-4 py-3 text-right text-slate-500 uppercase tracking-wider">Sumas partidas:</td>
                    <td className="px-4 py-3 text-right font-mono text-sm">
                      ${totalDebits.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm">
                      ${totalCredits.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Account Code Autocomplete datalist */}
            <datalist id="account-codes">
              {commonAccounts.map((acc) => (
                <option key={acc.code} value={acc.code}>
                  {acc.name}
                </option>
              ))}
            </datalist>
          </div>

          {/* Guidelines info badge */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-none flex items-start gap-2.5 text-xs text-slate-600 select-none">
            <Info className="h-4 w-4 text-cyan-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold uppercase tracking-wide text-slate-800 text-[10px]">Normas de Contabilidad de Partida Doble:</p>
              <p>Toda póliza requiere que la suma total de los cargos (Debe) sea exactamente igual al total de abonos (Haber). Al configurar el código de cuenta contable, el sistema buscará autocompletar el nombre estándar oficial de este ejercicio.</p>
            </div>
          </div>

          {/* Action buttons footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-slate-300 text-slate-700 rounded-none text-xs font-bold uppercase tracking-wider hover:bg-slate-50 cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isBalanced}
              className={`px-6 py-2 rounded-none text-xs font-bold uppercase tracking-widest text-white shadow-xs transition-all flex items-center gap-1.5 ${
                isBalanced
                  ? 'bg-slate-900 hover:bg-slate-800 cursor-pointer'
                  : 'bg-slate-300 cursor-not-allowed opacity-80'
              }`}
            >
              Guardar Póliza
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
