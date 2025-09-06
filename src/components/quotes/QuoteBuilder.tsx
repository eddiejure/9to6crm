import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2, Save, Send, FileDown } from 'lucide-react';
import { QuoteInvoiceItem } from '../../types';
import { formatCurrency, calculateTax, calculateTotal, generateDocumentNumber } from '../../utils/formatters';
import { TAX_RATES } from '../../utils/constants';

interface SortableItemProps {
  item: QuoteInvoiceItem;
  onUpdate: (id: string, updates: Partial<QuoteInvoiceItem>) => void;
  onDelete: (id: string) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ item, onUpdate, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleFieldChange = (field: keyof QuoteInvoiceItem, value: any) => {
    const updates: Partial<QuoteInvoiceItem> = { [field]: value };
    
    // Recalculate total when quantity or unit_price changes
    if (field === 'quantity' || field === 'unit_price') {
      const quantity = field === 'quantity' ? value : item.quantity;
      const unitPrice = field === 'unit_price' ? value : item.unit_price;
      updates.total = quantity * unitPrice;
    }
    
    onUpdate(item.id, updates);
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-start gap-4">
        <button
          className="mt-2 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Beschreibung
            </label>
            <textarea
              value={item.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Leistungsbeschreibung..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Menge
            </label>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => handleFieldChange('quantity', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.01"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Einzelpreis
            </label>
            <input
              type="number"
              value={item.unit_price}
              onChange={(e) => handleFieldChange('unit_price', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.01"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              MwSt.
            </label>
            <select
              value={item.tax_rate}
              onChange={(e) => handleFieldChange('tax_rate', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={TAX_RATES.STANDARD}>19%</option>
              <option value={TAX_RATES.REDUCED}>7%</option>
              <option value={TAX_RATES.EXEMPT}>0%</option>
            </select>
          </div>

          <div className="md:col-span-1 flex items-end justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gesamt
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(item.total)}
              </p>
            </div>
            <button
              onClick={() => onDelete(item.id)}
              className="text-red-500 hover:text-red-700 p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface QuoteBuilderProps {
  onSave?: (quote: any) => void;
  onSend?: (quote: any) => void;
  initialData?: any;
}

const QuoteBuilder: React.FC<QuoteBuilderProps> = ({ onSave, onSend, initialData }) => {
  const [items, setItems] = useState<QuoteInvoiceItem[]>([
    {
      id: '1',
      description: 'Elementor Website Entwicklung',
      quantity: 1,
      unit_price: 1500,
      total: 1500,
      tax_rate: TAX_RATES.STANDARD
    }
  ]);

  const [quoteDetails, setQuoteDetails] = useState({
    quote_number: generateDocumentNumber('quote'),
    date: new Date().toISOString().split('T')[0],
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    client: '',
    notes: ''
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addItem = () => {
    const newItem: QuoteInvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unit_price: 0,
      total: 0,
      tax_rate: TAX_RATES.STANDARD
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, updates: Partial<QuoteInvoiceItem>) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = items.reduce((sum, item) => sum + calculateTax(item.total, item.tax_rate), 0);
  const total = calculateTotal(subtotal, taxAmount);

  const exportToPDF = async () => {
    const jsPDF = (await import('jspdf')).default;
    const doc = new jsPDF();
    
    // Add company header
    doc.setFontSize(20);
    doc.text('9to6', 20, 30);
    doc.setFontSize(12);
    doc.text('Professional Web Design Services', 20, 40);
    
    // Add quote details
    doc.setFontSize(16);
    doc.text(`Angebot ${quoteDetails.quote_number}`, 20, 60);
    doc.setFontSize(10);
    doc.text(`Datum: ${quoteDetails.date}`, 20, 70);
    doc.text(`Gültig bis: ${quoteDetails.valid_until}`, 20, 80);
    
    // Add items table
    let yPos = 100;
    doc.setFontSize(12);
    doc.text('Pos.', 20, yPos);
    doc.text('Beschreibung', 40, yPos);
    doc.text('Menge', 120, yPos);
    doc.text('Einzelpreis', 140, yPos);
    doc.text('Gesamt', 170, yPos);
    
    yPos += 10;
    doc.line(20, yPos, 190, yPos);
    yPos += 5;
    
    items.forEach((item, index) => {
      yPos += 10;
      doc.setFontSize(10);
      doc.text((index + 1).toString(), 20, yPos);
      doc.text(item.description.substring(0, 40), 40, yPos);
      doc.text(item.quantity.toString(), 120, yPos);
      doc.text(formatCurrency(item.unit_price), 140, yPos);
      doc.text(formatCurrency(item.total), 170, yPos);
    });
    
    // Add totals
    yPos += 20;
    doc.line(20, yPos, 190, yPos);
    yPos += 10;
    doc.text(`Zwischensumme: ${formatCurrency(subtotal)}`, 120, yPos);
    yPos += 10;
    doc.text(`MwSt.: ${formatCurrency(taxAmount)}`, 120, yPos);
    yPos += 10;
    doc.setFontSize(12);
    doc.text(`Gesamtsumme: ${formatCurrency(total)}`, 120, yPos);
    
    doc.save(`Angebot-${quoteDetails.quote_number}.pdf`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Angebot erstellen</h2>
              <p className="text-gray-600 mt-1">Drag & Drop Editor für Angebote</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={exportToPDF}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileDown className="w-4 h-4" />
                PDF Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Save className="w-4 h-4" />
                Speichern
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Send className="w-4 h-4" />
                Versenden
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Quote Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Angebotsnummer
              </label>
              <input
                type="text"
                value={quoteDetails.quote_number}
                onChange={(e) => setQuoteDetails(prev => ({ ...prev, quote_number: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Datum
              </label>
              <input
                type="date"
                value={quoteDetails.date}
                onChange={(e) => setQuoteDetails(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gültig bis
              </label>
              <input
                type="date"
                value={quoteDetails.valid_until}
                onChange={(e) => setQuoteDetails(prev => ({ ...prev, valid_until: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Positionen</h3>
              <button
                onClick={addItem}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Position hinzufügen
              </button>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {items.map(item => (
                    <SortableItem
                      key={item.id}
                      item={item}
                      onUpdate={updateItem}
                      onDelete={deleteItem}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* Totals */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="max-w-md ml-auto">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Zwischensumme:</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">MwSt.:</span>
                  <span className="font-medium">{formatCurrency(taxAmount)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Gesamtsumme:</span>
                    <span className="text-lg font-semibold">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Anmerkungen
            </label>
            <textarea
              value={quoteDetails.notes}
              onChange={(e) => setQuoteDetails(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Zusätzliche Informationen oder Bedingungen..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteBuilder;