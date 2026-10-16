import React from 'react';
import { SPAWN_HUBS } from '../data/worldData';
import { soundEngine } from '../utils/audio';
import { Compass, ShieldAlert, Dices, X } from 'lucide-react';

interface SpawnModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSelectSpawn: (landmarkName: string) => void;
  title?: string;
  subtitle?: string;
}

export const SpawnModal: React.FC<SpawnModalProps> = ({
  isOpen,
  onClose,
  onSelectSpawn,
  title = 'اختر موطن انطلاق مغامرتك',
  subtitle = 'حدد المعقل أو الإقليم الذي ستنطلق منه رحلتك في عالم التربة القاتمة:'
}) => {
  if (!isOpen) return null;

  const handleSelect = (name: string) => {
    soundEngine.playClick();
    onSelectSpawn(name);
  };

  const handleRandom = () => {
    soundEngine.playClick();
    const randomHub = SPAWN_HUBS[Math.floor(Math.random() * SPAWN_HUBS.length)];
    onSelectSpawn(randomHub.name);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-xl bg-neutral-950 border border-amber-800/50 rounded-2xl p-6 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3 mb-4">
          <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-lg">
            <Compass className="w-5 h-5 text-amber-500" />
            <span>{title}</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-200 text-lg px-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <p className="text-xs text-neutral-400 mb-4 leading-relaxed font-serif">
          {subtitle}
        </p>

        {/* Hubs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {SPAWN_HUBS.map((hub) => (
            <button
              key={hub.id}
              onClick={() => handleSelect(hub.name)}
              className="flex flex-col text-right p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/70 hover:border-amber-500/80 hover:bg-neutral-800/90 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-bold text-amber-300 group-hover:text-amber-200 text-sm">
                  {hub.name}
                </span>
                <span className="text-xl">{hub.icon}</span>
              </div>
              <div className="text-[11px] text-amber-600 font-mono mb-1">{hub.zone}</div>
              <div className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-2">
                {hub.desc}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mt-auto">
                <ShieldAlert className="w-3.5 h-3.5 text-neutral-500" />
                <span>مستوى الخطر: {hub.danger}%</span>
              </div>
            </button>
          ))}

          {/* Random Spawn Option */}
          <button
            onClick={handleRandom}
            className="flex flex-col text-right p-3.5 rounded-xl border border-dashed border-amber-700/60 bg-amber-950/20 hover:border-amber-500 hover:bg-amber-950/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="font-bold text-amber-400 text-sm">بداية عشوائية تماماً</span>
              <Dices className="w-6 h-6 text-amber-500" />
            </div>
            <div className="text-[11px] text-neutral-500 font-mono mb-1">القدر يختار</div>
            <div className="text-xs text-neutral-400 leading-relaxed mb-2">
              دع الرياح والقدر يحددان موطن يقظتك في أي بقعة من بقاع القارة.
            </div>
          </button>
        </div>

        {onClose && (
          <div className="mt-5 pt-3 border-t border-neutral-900 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200 text-xs cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
