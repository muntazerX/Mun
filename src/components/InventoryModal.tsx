import React, { useState } from 'react';
import { PlayerStats, InventoryItem } from '../types/game';
import { RARITY_COLORS, RARITY_LABELS } from '../data/items';
import { soundEngine } from '../utils/audio';
import { calculateInventorySurvivalDays, getItemCalorieValue, getItemWaterUnits } from '../utils/dice';
import { 
  Backpack, 
  Coins, 
  Weight, 
  Swords, 
  Shield, 
  X, 
  Sparkles, 
  Check, 
  Trash2,
  HelpCircle,
  Flame,
  Droplets,
  Scale
} from 'lucide-react';

interface InventoryModalProps {
  player: PlayerStats;
  onClose: () => void;
  onEquipItem: (item: InventoryItem, slot: 'weapon' | 'armor') => void;
  onUseItem: (item: InventoryItem) => void;
  onDropItem: (item: InventoryItem) => void;
  onOpenTradeScale?: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  player,
  onClose,
  onEquipItem,
  onUseItem,
  onDropItem,
  onOpenTradeScale
}) => {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const weightPct = Math.min(100, (player.carry_weight_current / player.carry_weight_max) * 100);

  const survival = calculateInventorySurvivalDays(
    player.inventory || [],
    player.calories_current ?? 8000,
    player.hydration_current ?? 100
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full sm:max-w-xl bg-neutral-950 border border-amber-900/40 rounded-t-2xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800 bg-neutral-900/60">
          <div className="flex items-center gap-2">
            <Backpack className="w-5 h-5 text-amber-500" />
            <h2 className="font-serif font-bold text-amber-300 text-sm">المخزون والعتاد الحربي</h2>
          </div>
          <div className="flex items-center gap-2">
            {onOpenTradeScale && (
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onOpenTradeScale();
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-700/60 hover:bg-amber-900/50 text-amber-300 text-xs font-semibold cursor-pointer"
                title="مراجعة ميزان التجارة وفئات الأسعار"
              >
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">ميزان التجارة</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Currency & Weight Bar */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-neutral-900/40 border-b border-neutral-800 text-xs">
          {/* Currency */}
          <div className="flex items-center gap-3">
            <Coins className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="flex items-center gap-2 font-mono">
              <span className="text-amber-400 font-bold">{player.currency.G} <span className="text-[10px] text-neutral-500">ذهب</span></span>
              <span className="text-neutral-300 font-bold">{player.currency.S} <span className="text-[10px] text-neutral-500">فضة</span></span>
              <span className="text-amber-600 font-bold">{player.currency.C} <span className="text-[10px] text-neutral-500">نحاس</span></span>
            </div>
          </div>

          {/* Weight */}
          <div className="flex items-center gap-2">
            <Weight className="w-3.5 h-3.5 text-neutral-400" />
            <div className="w-20 h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
              <div
                className={`h-full transition-all ${weightPct > 90 ? 'bg-red-500' : 'bg-amber-500'}`}
                style={{ width: `${weightPct}%` }}
              />
            </div>
            <span className="font-mono text-neutral-400 text-[11px]">
              {player.carry_weight_current.toFixed(1)}/{player.carry_weight_max} كغ
            </span>
          </div>
        </div>

        {/* True Synchronized Provisions & Survival Summary Banner */}
        <div className="px-5 py-2 bg-neutral-900/80 border-b border-neutral-800/80 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-amber-300">
              <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>المؤونة: <strong>{survival.foodDays} يوماً</strong></span>
              <span className="text-[10px] text-neutral-500">({survival.totalCaloriesAvailable.toLocaleString('ar-SA')} سعرة)</span>
            </span>
            <span className="text-neutral-600">·</span>
            <span className="flex items-center gap-1 text-sky-300">
              <Droplets className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>المياه: <strong>{survival.waterDays} يوماً</strong></span>
            </span>
          </div>

          <span className="text-[10px] text-emerald-400 font-sans hidden sm:inline">
            متزامن مع السفر ومخزونك
          </span>
        </div>

        {/* Equipped Gear Section */}
        <div className="p-4 bg-neutral-950/80 border-b border-neutral-900 grid grid-cols-2 gap-3 text-xs">
          {/* Weapon Slot */}
          <div className="p-3 rounded-xl border border-amber-900/40 bg-neutral-900/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-neutral-500 block">السلاح المجهز</span>
              <span className="font-bold text-amber-300">{player.weapon_equipped || 'لا يوجد'}</span>
            </div>
            <Swords className="w-5 h-5 text-red-400/80" />
          </div>

          {/* Armor Slot */}
          <div className="p-3 rounded-xl border border-amber-900/40 bg-neutral-900/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-neutral-500 block">الدرع المجهز</span>
              <span className="font-bold text-amber-300">{player.armor_equipped || 'لا يوجد'}</span>
            </div>
            <Shield className="w-5 h-5 text-blue-400/80" />
          </div>
        </div>

        {/* Items List */}
        <div className="p-4 overflow-y-auto max-h-[50vh] space-y-2 text-xs">
          {player.inventory && player.inventory.length > 0 ? (
            player.inventory.map((item, idx) => {
              const rarityColor = RARITY_COLORS[item.rarity || 'common'] || '#a89880';
              const rarityLabel = RARITY_LABELS[item.rarity || 'common'] || 'شائع';
              const isEquipped = item.item === player.weapon_equipped || item.item === player.armor_equipped;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedItem(item);
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    selectedItem?.item === item.item
                      ? 'bg-amber-950/30 border-amber-500/80 shadow-md'
                      : 'bg-neutral-900/70 border-neutral-800/80 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: rarityColor }}
                      title={rarityLabel}
                    />
                    <div>
                      <div className="font-medium text-neutral-200 flex items-center gap-1.5">
                        <span style={{ color: rarityColor }}>{item.item}</span>
                        {isEquipped && (
                          <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.2 rounded border border-amber-500/30">
                            مجهز
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-neutral-500 flex items-center gap-2 mt-0.5">
                        <span>الوزن: {(item.weight * (item.qty || 1)).toFixed(2)} كغ</span>
                        {item.damage && <span className="text-red-400">ضرر +{item.damage}</span>}
                        {item.defense && <span className="text-blue-400">دفاع +{item.defense}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-neutral-400 font-bold">×{item.qty || 1}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-neutral-500 text-xs">
              حقيبتك فارغة تماماً.
            </div>
          )}
        </div>

        {/* Selected Item Detail Actions Bar */}
        {selectedItem && (
          <div className="p-4 bg-neutral-900/90 border-t border-neutral-800 flex items-center justify-between gap-3 text-xs">
            <div className="min-w-0 flex-1">
              <div className="font-bold text-amber-200 truncate">{selectedItem.item}</div>
              <p className="text-[11px] text-neutral-400 line-clamp-1">
                {selectedItem.desc || 'عنصر في حقيبتك.'}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Equip button if it's weapon or armor */}
              {(selectedItem.damage || selectedItem.item.includes('سيف') || selectedItem.item.includes('خنجر') || selectedItem.item.includes('قوس') || selectedItem.item.includes('فأس')) && (
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onEquipItem(selectedItem, 'weapon');
                  }}
                  className="px-3 py-1.5 bg-red-950/80 border border-red-800 text-red-200 rounded-lg hover:bg-red-900 cursor-pointer"
                >
                  تجهيز كسلاح
                </button>
              )}

              {(selectedItem.defense || selectedItem.item.includes('درع') || selectedItem.item.includes('عباءة') || selectedItem.item.includes('سترة')) && (
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onEquipItem(selectedItem, 'armor');
                  }}
                  className="px-3 py-1.5 bg-blue-950/80 border border-blue-800 text-blue-200 rounded-lg hover:bg-blue-900 cursor-pointer"
                >
                  تجهيز كدرع
                </button>
              )}

              {/* Use button for food / potions */}
              {(selectedItem.item.includes('جرعة') || selectedItem.item.includes('ماء') || selectedItem.item.includes('عشبة') || selectedItem.item.includes('مؤن') || selectedItem.item.includes('خبز')) && (
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onUseItem(selectedItem);
                  }}
                  className="px-3 py-1.5 bg-emerald-950/80 border border-emerald-800 text-emerald-200 rounded-lg hover:bg-emerald-900 cursor-pointer"
                >
                  استهلاك
                </button>
              )}

              {/* Drop button */}
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onDropItem(selectedItem);
                  setSelectedItem(null);
                }}
                className="p-1.5 bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-red-400 rounded-lg cursor-pointer"
                title="رمي أو التخلص"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
