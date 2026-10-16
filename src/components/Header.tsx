import React, { useState, useEffect } from 'react';
import { GameState } from '../types/game';
import { soundEngine } from '../utils/audio';
import { toggleFullscreen, isFullscreenActive } from '../utils/fullscreen';
import { 
  MapPin, 
  Compass, 
  BarChart3, 
  Backpack, 
  Swords, 
  Save, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Shield,
  Activity,
  PlusCircle,
  Maximize,
  Minimize
} from 'lucide-react';

interface HeaderProps {
  gameState: GameState;
  onOpenMap: () => void;
  onOpenStatus: () => void;
  onOpenInventory: () => void;
  onOpenPolitics: () => void;
  onOpenSaves: () => void;
  onRequestNewGame?: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  gameState,
  onOpenMap,
  onOpenStatus,
  onOpenInventory,
  onOpenPolitics,
  onOpenSaves,
  onRequestNewGame,
  isMuted,
  onToggleMute
}) => {
  const p = gameState.player;
  const loc = gameState.location;
  const world = gameState.world_state;

  const [isFullscreen, setIsFullscreen] = useState(isFullscreenActive());

  useEffect(() => {
    const handler = () => setIsFullscreen(isFullscreenActive());
    document.addEventListener('fullscreenchange', handler);
    document.addEventListener('webkitfullscreenchange', handler);
    return () => {
      document.removeEventListener('fullscreenchange', handler);
      document.removeEventListener('webkitfullscreenchange', handler);
    };
  }, []);

  const hpPct = Math.max(0, Math.min(100, (p.hp_current / (p.hp_max || 100)) * 100));
  const apPct = Math.max(0, Math.min(100, (p.ap_current / (p.ap_max || 100)) * 100));

  return (
    <header className="sticky top-0 z-40 shrink-0 w-full bg-neutral-950/98 border-b border-amber-900/40 backdrop-blur-md px-3 py-2 flex items-center justify-between gap-2 text-xs select-none shadow-xl">
      {/* Title & Location cluster */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="flex items-center gap-1.5 font-serif font-bold text-amber-500 text-sm whitespace-nowrap">
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="hidden sm:inline">التربة القاتمة</span>
        </div>

        {/* Current Landmark badge */}
        <div 
          onClick={onOpenMap}
          className="flex items-center gap-1 text-neutral-400 bg-neutral-900/95 border border-neutral-800 hover:border-amber-600/80 px-2.5 py-1 rounded-lg text-xs truncate cursor-pointer transition-colors"
          title="انقر لفتح الخريطة والسفر"
        >
          <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="text-amber-200 font-medium truncate max-w-[130px] sm:max-w-[180px] md:max-w-[220px]">
            {p.current_landmark || loc.sub_location || 'السهول'}
          </span>
          <span className="text-neutral-500 hidden md:inline text-[11px]">
            ({loc.region})
          </span>
        </div>

        {/* Sect Membership badge if enrolled */}
        {p.faction_name && (
          <div 
            onClick={onOpenPolitics}
            className="hidden sm:flex items-center gap-1 bg-amber-950/50 border border-amber-700/60 text-amber-300 text-[11px] px-2 py-0.5 rounded-lg cursor-pointer hover:bg-amber-900/40"
            title="انقر لإدارة الطائفة والرتبة"
          >
            <span>⚔️</span>
            <span className="font-bold">{p.faction_name}</span>
            <span className="text-neutral-400 font-mono">[{p.faction_rank || 'تلميذ'}]</span>
          </div>
        )}

        {/* World Time & Weather */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-neutral-400 font-mono">
          <span className="text-amber-400/90 font-bold">اليوم {world.day}</span>
          <span className="text-neutral-600">·</span>
          <span>{world.weather}</span>
          <span className="text-neutral-600">·</span>
          <span className="text-red-400/80">التهديد {world.threat_index}%</span>
        </div>
      </div>

      {/* Quick Vitals Snapshot */}
      <div 
        onClick={onOpenStatus}
        className="hidden md:flex items-center gap-3 bg-neutral-900/80 border border-neutral-800 hover:border-emerald-600/60 px-3 py-1 rounded-lg cursor-pointer transition-colors"
        title="انقر لفتح قائمة الحالة والمهارات"
      >
        {/* HP Bar */}
        <div className="flex items-center gap-1.5" title={`الصحة: ${p.hp_current}/${p.hp_max}`}>
          <Activity className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <div className="w-16 h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
            <div 
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-300"
              style={{ width: `${hpPct}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-emerald-400 tabular-nums">
            {p.hp_current}
          </span>
        </div>

        {/* AP Bar */}
        <div className="flex items-center gap-1.5" title={`المتانة: ${p.ap_current}/${p.ap_max}`}>
          <Shield className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <div className="w-16 h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
            <div 
              className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-300"
              style={{ width: `${apPct}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-amber-400 tabular-nums">
            {p.ap_current}
          </span>
        </div>
      </div>

      {/* Actions Toolbar - Pinned and permanently visible */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onOpenMap}
          className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-amber-500 hover:bg-neutral-800 text-neutral-300 hover:text-amber-300 transition-colors cursor-pointer shadow-sm"
          title="خريطة العالم والسفر (🗺️)"
        >
          <Compass className="w-4 h-4 text-amber-400" />
        </button>

        <button
          onClick={onOpenStatus}
          className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-emerald-500 hover:bg-neutral-800 text-neutral-300 hover:text-emerald-300 transition-colors cursor-pointer shadow-sm"
          title="الحالة والرتب (📊)"
        >
          <BarChart3 className="w-4 h-4 text-emerald-400" />
        </button>

        <button
          onClick={onOpenInventory}
          className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-amber-500 hover:bg-neutral-800 text-neutral-300 hover:text-amber-300 transition-colors cursor-pointer shadow-sm"
          title="المخزون والعتاد (🎒)"
        >
          <Backpack className="w-4 h-4 text-amber-400" />
        </button>

        <button
          onClick={onOpenPolitics}
          className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-red-500 hover:bg-neutral-800 text-neutral-300 hover:text-red-300 transition-colors cursor-pointer shadow-sm"
          title="الممالك وطوائف المرويم (⚔️)"
        >
          <Swords className="w-4 h-4 text-red-400" />
        </button>

        <button
          onClick={onOpenSaves}
          className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-blue-500 hover:bg-neutral-800 text-neutral-300 hover:text-blue-300 transition-colors cursor-pointer shadow-sm"
          title="ملفات الحفظ والخيارات (💾)"
        >
          <Save className="w-4 h-4 text-blue-400" />
        </button>

        {onRequestNewGame && (
          <button
            onClick={onRequestNewGame}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-600/20 border border-amber-600/50 hover:bg-amber-600/40 text-amber-300 text-xs font-semibold cursor-pointer transition-colors"
            title="بدء مغامرة جديدة واختيار موطن الانطلاق"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>حفظ جديد</span>
          </button>
        )}

        <button
          onClick={() => {
            soundEngine.playClick();
            toggleFullscreen();
          }}
          className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-amber-500 text-neutral-400 hover:text-amber-300 transition-colors cursor-pointer shadow-sm"
          title={isFullscreen ? 'الخروج من ملء الشاشة' : 'ملء الشاشة للهاتف (⛶)'}
        >
          {isFullscreen ? <Minimize className="w-4 h-4 text-amber-400" /> : <Maximize className="w-4 h-4 text-neutral-300" />}
        </button>

        <button
          onClick={onToggleMute}
          className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-neutral-500" /> : <Volume2 className="w-4 h-4 text-amber-500/80" />}
        </button>
      </div>
    </header>
  );
};
