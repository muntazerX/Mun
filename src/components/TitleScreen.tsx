import React, { useState, useEffect } from 'react';
import { SPAWN_HUBS } from '../data/worldData';
import { soundEngine } from '../utils/audio';
import { toggleFullscreen, isFullscreenActive } from '../utils/fullscreen';
import { Volume2, VolumeX, Play, RotateCcw, Compass, ShieldAlert, Maximize, Minimize } from 'lucide-react';

interface TitleScreenProps {
  hasExistingSave: boolean;
  onStartNewGame: (spawnHubId: string) => void;
  onContinueGame: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  hasExistingSave,
  onStartNewGame,
  onContinueGame,
  isMuted,
  onToggleMute
}) => {
  const [showSpawnSelect, setShowSpawnSelect] = useState(false);
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

  const handleStartClick = () => {
    soundEngine.playClick();
    setShowSpawnSelect(true);
  };

  const handleSelectSpawn = (spawnId: string) => {
    soundEngine.playClick();
    soundEngine.startAmbientDrone();
    onStartNewGame(spawnId);
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-[#070709] flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden select-none">
      {/* Background dark atmospheric textures */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/20 via-black to-black pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />

      {/* Floating dust particles simulation */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-red-900/10 rounded-full blur-3xl" />
      </div>

      {/* Top Header Bar */}
      <div className="relative z-10 w-full max-w-4xl flex items-center justify-between text-xs text-amber-700/60 font-mono tracking-wider">
        <span className="hidden sm:inline">نسخة الجيل الجديد · محرك إجرائي خفيف التوكنات</span>
        <span className="sm:hidden text-amber-500/80 font-bold">التربة القاتمة</span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundEngine.playClick();
              toggleFullscreen();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900/80 text-amber-300 hover:border-amber-600/60 transition-colors cursor-pointer shadow-sm"
            title="تبديل ملء الشاشة للهاتف"
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5 text-amber-400" /> : <Maximize className="w-3.5 h-3.5 text-amber-400" />}
            <span className="text-[11px] font-semibold">{isFullscreen ? 'تصغير' : 'ملء الشاشة'}</span>
          </button>

          <button
            onClick={onToggleMute}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900/80 text-amber-200/70 hover:border-amber-600/60 transition-colors cursor-pointer"
            title={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-neutral-500" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
            <span className="hidden sm:inline text-[11px]">{isMuted ? 'صامت' : 'صوت البيئة'}</span>
          </button>
        </div>
      </div>

      {/* Hero Centerpiece: Bespoke SVG Title Lockup */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto max-w-2xl">
        <div className="mb-4">
          <svg className="w-24 h-24 text-amber-500/80 drop-shadow-[0_0_25px_rgba(217,119,6,0.3)]" viewBox="0 0 100 100" fill="none" stroke="currentColor">
            <polygon points="50,5 95,50 50,95 5,50" strokeWidth="2" strokeDasharray="3 3" className="text-amber-700/50" />
            <polygon points="50,15 85,50 50,85 15,50" strokeWidth="2.5" />
            <circle cx="50" cy="50" r="16" fill="rgba(180,83,9,0.2)" strokeWidth="2" />
            <path d="M50,22 L50,78 M22,50 L78,50" strokeWidth="1.5" strokeOpacity="0.7" />
            <circle cx="50" cy="50" r="4" fill="#fbbf24" />
          </svg>
        </div>

        <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-700 drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] mb-2">
          التربة القاتمة
        </h1>
        <p className="font-mono text-xs md:text-sm tracking-[0.35em] text-amber-600/80 uppercase mb-4">
          GRIM SOIL · CHRONICLES OF ASH
        </p>
        <p className="text-sm md:text-base text-neutral-400/90 leading-relaxed max-w-lg mb-8 font-serif">
          عالم لا يرحم الضعيف، حيث لا تحكم الآلهة بل السيوف والإرادة ودهاء الممالك.
          توليد إجرائي ذكي للأحداث دون استهلاك أطنان التوكنات، مع محاكاة سياسية ودبلوماسية حية.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-sm">
          {hasExistingSave && (
            <button
              onClick={() => {
                soundEngine.playClick();
                soundEngine.startAmbientDrone();
                onContinueGame();
              }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-black font-semibold text-base shadow-lg shadow-amber-900/40 hover:from-amber-500 hover:to-amber-600 active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw className="w-5 h-5 text-black" />
              <span>متابعة المغامرة الحالية</span>
            </button>
          )}

            <button
            onClick={handleStartClick}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-base transition-all cursor-pointer ${
              hasExistingSave
                ? 'bg-neutral-900/90 text-amber-200/90 border border-neutral-700 hover:border-amber-500 hover:bg-neutral-800'
                : 'bg-gradient-to-r from-amber-600 to-amber-700 text-black shadow-lg shadow-amber-900/40 hover:from-amber-500 hover:to-amber-600 active:scale-95'
            }`}
          >
            <Play className={`w-5 h-5 ${hasExistingSave ? 'text-amber-400' : 'text-black'}`} />
            <span>بدء مغامرة جديدة</span>
          </button>
        </div>

        {/* Fullscreen Mobile View Trigger */}
        <div className="w-full max-w-sm mt-3">
          <button
            onClick={() => {
              soundEngine.playClick();
              toggleFullscreen();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900/70 border border-amber-800/40 hover:border-amber-500/80 text-amber-300 text-xs font-semibold cursor-pointer transition-all active:scale-98 shadow-sm"
          >
            {isFullscreen ? <Minimize className="w-4 h-4 text-amber-400" /> : <Maximize className="w-4 h-4 text-amber-400" />}
            <span>{isFullscreen ? 'الخروج من ملء الشاشة' : '⛶ وضع ملء الشاشة (تجربة هاتف مثالية)'}</span>
          </button>
        </div>
      </div>

      {/* Control hints */}
      <div className="relative z-10 w-full text-center text-xs text-neutral-600 font-mono tracking-wide py-2 border-t border-neutral-900">
        Enter إرسال الأوامر · أزرار تحكم سريعة · خريطة تفاعلية كاملة
      </div>

      {/* Spawn Hub Selector Modal */}
      {showSpawnSelect && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-neutral-950 border border-amber-800/40 rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
              <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-lg">
                <Compass className="w-5 h-5 text-amber-500" />
                <span>اختر موطن انطلاق رحلتك</span>
              </div>
              <button
                onClick={() => setShowSpawnSelect(false)}
                className="text-neutral-500 hover:text-neutral-300 text-lg px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
              مكان البداية يحدد الإقليم الجغرافي، بيئتك الأولية، والممالك المحيطة بك:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {SPAWN_HUBS.map((hub) => (
                <button
                  key={hub.id}
                  onClick={() => handleSelectSpawn(hub.name)}
                  className="flex flex-col text-right p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/70 hover:border-amber-500/80 hover:bg-neutral-800/90 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-bold text-amber-300 group-hover:text-amber-200 text-sm">
                      {hub.name}
                    </span>
                    <span className="text-xl">{hub.icon}</span>
                  </div>
                  <div className="text-[11px] text-amber-600/90 font-mono mb-1">{hub.zone}</div>
                  <div className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-2">
                    {hub.desc}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mt-auto">
                    <ShieldAlert className="w-3.5 h-3.5 text-neutral-500" />
                    <span>مستوى الخطر: {hub.danger}%</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-5 pt-3 border-t border-neutral-900 flex justify-end">
              <button
                onClick={() => setShowSpawnSelect(false)}
                className="px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200 text-xs cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
