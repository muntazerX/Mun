import React, { useState } from 'react';
import { GameState } from '../types/game';
import { soundEngine } from '../utils/audio';
import { 
  Save, 
  Trash2, 
  RotateCcw, 
  Download, 
  Upload, 
  Plus, 
  X, 
  Calendar, 
  MapPin 
} from 'lucide-react';

export interface SaveSlotMeta {
  id: string;
  name: string;
  created: number;
  day?: number;
  landmark?: string;
  level?: number;
}

interface SaveSlotsModalProps {
  currentSlotId: string;
  currentGameState: GameState;
  hasUndoSnapshot: boolean;
  onClose: () => void;
  onSwitchSlot: (slotId: string) => void;
  onRequestNewSlot: () => void;
  onDeleteSlot: (slotId: string) => void;
  onUndoLastTurn: () => void;
  onExportJson: () => void;
  onImportJson: (jsonString: string) => void;
}

export const SaveSlotsModal: React.FC<SaveSlotsModalProps> = ({
  currentSlotId,
  currentGameState,
  hasUndoSnapshot,
  onClose,
  onSwitchSlot,
  onRequestNewSlot,
  onDeleteSlot,
  onUndoLastTurn,
  onExportJson,
  onImportJson
}) => {
  const [importText, setImportText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);

  // Retrieve saved slots metadata from localStorage
  const getSlotsList = (): SaveSlotMeta[] => {
    try {
      const raw = localStorage.getItem('grim_soil_slots');
      if (raw) return JSON.parse(raw);
    } catch {}
    return [{ id: 'slot_1', name: 'التخزينة الأساسية 1', created: Date.now() }];
  };

  const slots = getSlotsList();

  const handleImportSubmit = () => {
    if (!importText.trim()) return;
    try {
      onImportJson(importText.trim());
      setShowImportBox(false);
      setImportText('');
    } catch {
      alert('ملف الحفظ غير صالح');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full sm:max-w-lg bg-neutral-950 border border-amber-900/40 rounded-t-2xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800 bg-neutral-900/60">
          <div className="flex items-center gap-2">
            <Save className="w-5 h-5 text-blue-400" />
            <h2 className="font-serif font-bold text-amber-300 text-sm">ملفات الحفظ وإدارة التقدم</h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Undo Quick Banner */}
        {hasUndoSnapshot && (
          <div className="bg-amber-950/30 border-b border-amber-900/40 px-5 py-2.5 flex items-center justify-between text-xs">
            <span className="text-amber-200">أخطأت في قرار الجولة السابقة؟</span>
            <button
              onClick={() => {
                soundEngine.playClick();
                onUndoLastTurn();
              }}
              className="flex items-center gap-1.5 px-3 py-1 bg-amber-600/30 border border-amber-500/60 text-amber-300 rounded-lg hover:bg-amber-600/50 cursor-pointer font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>تراجع عن الجولة الأخيرة</span>
            </button>
          </div>
        )}

        {/* Slots List */}
        <div className="p-5 overflow-y-auto max-h-[50vh] space-y-2.5 text-xs">
          {slots.map((slot) => {
            const isActive = slot.id === currentSlotId;
            return (
              <div
                key={slot.id}
                onClick={() => {
                  if (!isActive) {
                    soundEngine.playClick();
                    onSwitchSlot(slot.id);
                  }
                }}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-950/30 border-amber-500/80 shadow-md'
                    : 'bg-neutral-900/70 border-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 font-bold text-neutral-200">
                    <span>{slot.name}</span>
                    {isActive && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-mono">
                        الحالية النشطة
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-neutral-500 mt-1 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>اليوم {isActive ? currentGameState.world_state.day : (slot.day || 1)}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-500/80" />
                      <span className="text-neutral-400">
                        {isActive ? currentGameState.player.current_landmark : (slot.landmark || 'السهول')}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {slots.length > 1 && !isActive && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundEngine.playClick();
                        onDeleteSlot(slot.id);
                      }}
                      className="p-2 text-neutral-500 hover:text-red-400 rounded-lg hover:bg-neutral-800 cursor-pointer"
                      title="حذف التخزينة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-900 space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                soundEngine.playClick();
                onRequestNewSlot();
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-bold cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>+ تخزينة جديدة واختيار موطن</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                onExportJson();
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-blue-500 text-blue-300 font-semibold cursor-pointer text-xs"
            >
              <Download className="w-4 h-4" />
              <span>تصدير الحفظ (JSON)</span>
            </button>
          </div>

          {!showImportBox ? (
            <button
              onClick={() => setShowImportBox(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-neutral-400 hover:text-neutral-200 text-[11px] cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>استيراد حفظ خارجي (نسخ / لصق JSON)</span>
            </button>
          ) : (
            <div className="space-y-2 pt-2 border-t border-neutral-900">
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="الصق نص الـ JSON هنا..."
                rows={3}
                className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-mono text-neutral-300 outline-none focus:border-amber-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowImportBox(false)}
                  className="px-3 py-1 rounded bg-neutral-900 text-neutral-400"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleImportSubmit}
                  className="px-3 py-1 rounded bg-amber-600 text-black font-bold"
                >
                  تأكيد الاستيراد
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
