import React, { useState } from 'react';
import { PlayerStats } from '../types/game';
import { getRankData, RANKS, calculateInventorySurvivalDays } from '../utils/dice';
import { soundEngine } from '../utils/audio';
import { 
  Heart, 
  Zap, 
  Brain, 
  Target, 
  Dumbbell, 
  Shield, 
  Swords, 
  Award, 
  Sparkles, 
  X, 
  AlertCircle,
  Flame,
  Droplets,
  Trophy,
  Scale,
  CheckCircle2
} from 'lucide-react';

interface StatusModalProps {
  player: PlayerStats;
  onClose: () => void;
  onOpenTradeScale?: () => void;
  onAttemptBreakthrough?: () => void;
}

export const StatusModal: React.FC<StatusModalProps> = ({ 
  player, 
  onClose,
  onOpenTradeScale,
  onAttemptBreakthrough
}) => {
  const [activeTab, setActiveTab] = useState<'vitals' | 'ranks' | 'skills'>('vitals');
  const rankData = getRankData(player.level || 1);
  const xpPct = Math.min(100, ((player.xp || 0) / rankData.xpNeeded) * 100);

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
            <span className="text-xl">{rankData.rank.icon}</span>
            <div>
              <h2 className="font-serif font-bold text-amber-300 text-sm">{rankData.display}</h2>
              <div className="text-[11px] text-neutral-400 font-mono">
                المستوى {player.level} / 150 · {player.xp} / {rankData.xpNeeded} XP
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level XP Bar */}
        <div className="w-full bg-neutral-900 h-1.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-300 transition-all duration-300"
            style={{ width: `${xpPct}%` }}
          />
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-neutral-800 bg-neutral-950 px-4">
          <button
            onClick={() => setActiveTab('vitals')}
            className={`flex-1 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'vitals'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            المؤشرات الحيوية
          </button>
          <button
            onClick={() => setActiveTab('ranks')}
            className={`flex-1 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'ranks'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            شجرة الرتب (15 رتبة)
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`flex-1 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'skills'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            المهارات والندبات
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto max-h-[65vh] space-y-4">
          {activeTab === 'vitals' && (
            <div className="space-y-4">
              {/* Sect Membership banner if enrolled */}
              {player.faction_name && (
                <div className="border border-amber-700/60 bg-amber-950/40 p-3 rounded-xl flex items-center justify-between text-xs shadow-md">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-1 bg-neutral-950 rounded-lg border border-neutral-800">⚔️</span>
                    <div>
                      <span className="text-neutral-400 block text-[10px] font-mono">طائفة المرويم المنتمي إليها:</span>
                      <strong className="text-amber-200 text-sm font-serif">{player.faction_name}</strong>
                    </div>
                  </div>
                  <div className="text-left font-mono">
                    <span className="text-amber-300 bg-amber-900/60 border border-amber-600/80 px-2.5 py-1 rounded-lg text-xs font-bold">
                      {player.faction_rank || 'تلميذ خارجي'}
                    </span>
                  </div>
                </div>
              )}

              {/* Vitals Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* HP */}
                <div className="bg-neutral-900/80 border border-neutral-800/80 p-3 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-emerald-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4" />
                      <span>الصحة (HP)</span>
                    </span>
                    <span className="font-mono">{player.hp_current}/{player.hp_max}</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${(player.hp_current / player.hp_max) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-neutral-500">حياتك الجسدية؛ وصولها للصفر يعني الهلاك التام.</p>
                </div>

                {/* AP */}
                <div className="bg-neutral-900/80 border border-neutral-800/80 p-3 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-amber-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4" />
                      <span>المتانة (AP)</span>
                    </span>
                    <span className="font-mono">{player.ap_current}/{player.ap_max}</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${(player.ap_current / player.ap_max) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-neutral-500">طاقة الحركة، السفر، وتنفيذ المهارات القتالية.</p>
                </div>

                {/* Mind M */}
                <div className="bg-neutral-900/80 border border-neutral-800/80 p-3 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-blue-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Brain className="w-4 h-4" />
                      <span>الذهن (M)</span>
                    </span>
                    <span className="font-mono">{player.m_current}/{player.m_max}</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(player.m_current / player.m_max) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-neutral-500">الصحة النفسية والاتزان أمام رعب الموت والأهوال.</p>
                </div>

                {/* Focus S */}
                <div className="bg-neutral-900/80 border border-neutral-800/80 p-3 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-purple-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Target className="w-4 h-4" />
                      <span>التركيز (S)</span>
                    </span>
                    <span className="font-mono">{player.s_current}/{player.s_max}</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${(player.s_current / player.s_max) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-neutral-500">الدقة والانتباه للتفاصيل وحسن التقدير.</p>
                </div>
              </div>

              {/* Combat Attributes */}
              <div className="border border-neutral-800 bg-neutral-900/40 p-3 rounded-xl space-y-2">
                <h3 className="text-xs font-bold text-amber-400 font-serif">الإحصائيات القتالية</h3>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-neutral-900 rounded-lg">
                    <div className="flex items-center justify-center gap-1 text-neutral-400 mb-1">
                      <Dumbbell className="w-3.5 h-3.5 text-amber-500" />
                      <span>القوة</span>
                    </div>
                    <div className="text-sm font-bold font-mono text-amber-200">{player.strength}</div>
                  </div>

                  <div className="p-2 bg-neutral-900 rounded-lg">
                    <div className="flex items-center justify-center gap-1 text-neutral-400 mb-1">
                      <Swords className="w-3.5 h-3.5 text-red-500" />
                      <span>الضرر الأساسي</span>
                    </div>
                    <div className="text-sm font-bold font-mono text-red-300">{player.base_damage}</div>
                  </div>

                  <div className="p-2 bg-neutral-900 rounded-lg">
                    <div className="flex items-center justify-center gap-1 text-neutral-400 mb-1">
                      <Shield className="w-3.5 h-3.5 text-blue-500" />
                      <span>الدفاع الكلي</span>
                    </div>
                    <div className="text-sm font-bold font-mono text-blue-300">{player.defense}</div>
                  </div>
                </div>
              </div>

              {/* Calorie & Hydration Living Systems */}
              <div className="border border-neutral-800 bg-neutral-900/40 p-3 rounded-xl space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-amber-400 font-serif flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span>مخزون السعرات الحرارية والترطيب</span>
                  </h3>
                  {onOpenTradeScale && (
                    <button
                      onClick={onOpenTradeScale}
                      className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-200 cursor-pointer bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800"
                    >
                      <Scale className="w-3 h-3" />
                      <span>ميزان التجارة</span>
                    </button>
                  )}
                </div>

                {/* Calories Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-neutral-300">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      <span>السعرات الحالية:</span>
                    </span>
                    <span className="font-mono text-amber-300 font-bold">
                      {(player.calories_current ?? 8000).toLocaleString('ar-SA')} / {(player.calories_max ?? 10000).toLocaleString('ar-SA')} سعرة
                    </span>
                  </div>
                  <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        (player.calories_current ?? 8000) > 4000
                          ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, ((player.calories_current ?? 8000) / (player.calories_max ?? 10000)) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Hydration Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-neutral-300">
                    <span className="flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5 text-sky-400" />
                      <span>نسبة الترطيب:</span>
                    </span>
                    <span className="font-mono text-sky-300 font-bold">
                      {player.hydration_current ?? 100}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                    <div
                      className="h-full bg-gradient-to-r from-sky-600 to-sky-400 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(0, player.hydration_current ?? 100))}%` }}
                    />
                  </div>
                </div>

                {/* Synchronized Inventory Provisions Summary */}
                <div className="bg-neutral-950/80 p-2.5 rounded-lg border border-neutral-800 text-[11px] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <span className="text-amber-400">🍞 طعام المخزون:</span>
                    <strong className="text-amber-200 font-mono">{survival.foodDays} يوماً</strong>
                    <span className="text-neutral-500 font-mono">({survival.totalInventoryCalories.toLocaleString('ar-SA')} سعرة)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <span className="text-sky-400">💧 مياه المخزون:</span>
                    <strong className="text-sky-200 font-mono">{survival.waterDays} يوماً</strong>
                    <span className="text-neutral-500 font-mono">({survival.totalInventoryWaterUnits} وحدة)</span>
                  </div>
                </div>

                {/* Biological Afflictions Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-2 border-t border-neutral-800/80">
                  <div className={`p-2 rounded-lg ${player.hunger_days > 0 ? 'bg-red-950/40 border border-red-800' : 'bg-neutral-900/80'}`}>
                    <span className="text-neutral-500 block text-[10px]">الجوع الفعلي</span>
                    <span className={`font-mono font-bold ${player.hunger_days > 0 ? 'text-red-400' : 'text-neutral-300'}`}>
                      {player.hunger_days > 0 ? `${player.hunger_days} أيام (مجاعة)` : 'شبع تام'}
                    </span>
                  </div>
                  <div className={`p-2 rounded-lg ${player.thirst_days > 0 ? 'bg-red-950/40 border border-red-800' : 'bg-neutral-900/80'}`}>
                    <span className="text-neutral-500 block text-[10px]">العطش الفعلي</span>
                    <span className={`font-mono font-bold ${player.thirst_days > 0 ? 'text-red-400' : 'text-neutral-300'}`}>
                      {player.thirst_days > 0 ? `${player.thirst_days} أيام (جفاف)` : 'مرتوٍ تماماً'}
                    </span>
                  </div>
                  <div className="p-2 bg-neutral-900/80 rounded-lg">
                    <span className="text-neutral-500 block text-[10px]">الإرهاق البدني</span>
                    <span className="font-mono text-amber-400">{player.exhaustion || 0}%</span>
                  </div>
                  <div className="p-2 bg-neutral-900/80 rounded-lg">
                    <span className="text-neutral-500 block text-[10px]">عدوى الدم</span>
                    <span className="font-mono text-red-400">{player.blood_infection || 0}%</span>
                  </div>
                </div>
              </div>

              {/* Strict Level Progression & Breakthrough Challenge */}
              <div className="border border-amber-900/40 bg-neutral-900/50 p-3 rounded-xl space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5 font-serif">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>تحدي صقل واختراق المستوى {player.level + 1}</span>
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                    player.xp >= rankData.xpNeeded
                      ? 'bg-amber-500 text-black animate-pulse'
                      : 'bg-neutral-900 text-neutral-400'
                  }`}>
                    {player.xp}/{rankData.xpNeeded} XP {player.xp >= rankData.xpNeeded ? '· جاهز للاختراق' : ''}
                  </span>
                </div>

                <p className="text-neutral-300 text-xs leading-relaxed font-serif">
                  {player.level_challenge || `تحدي اختراق المستوى ${player.level + 1}: خوض نزال في حلبة المبارزة بـ [${player.current_landmark}] وهزيمة تلميذ متمرس أو الصمود أمام وحش بري دون تراجع.`}
                </p>

                {player.xp >= rankData.xpNeeded && onAttemptBreakthrough && (
                  <button
                    onClick={() => {
                      soundEngine.playVictoryChime();
                      onAttemptBreakthrough();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs shadow-lg shadow-amber-950/60 active:scale-95 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>خوض اختبار الاختراق وارتقاء المستوى {player.level + 1}</span>
                  </button>
                )}

                <p className="text-[11px] text-neutral-500 font-serif border-t border-neutral-800 pt-1.5">
                  ⚠️ <strong>قانون الارتقاء:</strong> المستويات لا ترتفع بالمشي أو الشراء أو السفر، بل بإنجاز تحديات الصقل الصارمة واكتساب نقاط الخبرة القتالية الحقيقية.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'ranks' && (
            <div className="space-y-2">
              <p className="text-xs text-neutral-400 mb-3">
                يتدرج المحارب عبر 15 رتبة كبرى، كل رتبة تضم 10 مستويات تعزز القوة والدفاع والصحة تلقائياً:
              </p>

              <div className="space-y-1.5">
                {RANKS.map((r, idx) => {
                  const startLvl = idx * 10 + 1;
                  const endLvl = (idx + 1) * 10;
                  const isCurrent = player.level >= startLvl && player.level <= endLvl;
                  const isUnlocked = player.level >= startLvl;

                  return (
                    <div
                      key={r.id}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                        isCurrent
                          ? 'bg-amber-950/40 border-amber-500/80 shadow-md'
                          : isUnlocked
                          ? 'bg-neutral-900/80 border-neutral-800 text-neutral-300'
                          : 'bg-neutral-950 border-neutral-900 text-neutral-600 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{r.icon}</span>
                        <div>
                          <div className="font-bold text-neutral-200">
                            {r.name}
                            {isCurrent && (
                              <span className="mr-2 text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-mono">
                                الرتبة الحالية
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-neutral-500">
                            المستويات {startLvl} – {endLvl}
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] font-mono">
                        {isUnlocked ? (
                          <span className="text-emerald-400">مكتسب ✓</span>
                        ) : (
                          <span className="text-neutral-600">مقفل 🔒</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-4 text-xs">
              <div>
                <h3 className="font-bold text-amber-400 font-serif mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>المهارات الخاصة والتقنيات</span>
                </h3>

                {player.skills && player.skills.length > 0 ? (
                  <div className="space-y-2">
                    {player.skills.map((skill, idx) => (
                      <div key={idx} className="p-3 bg-neutral-900/90 border border-neutral-800 rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-200">{skill.name}</span>
                          <span className="text-amber-500 font-mono text-[11px]">⚡ {skill.ap_cost} AP</span>
                        </div>
                        <p className="text-neutral-400 text-[11px] leading-relaxed">{skill.desc}</p>
                        {skill.damage && (
                          <div className="text-red-400 text-[10px]">الضرر: {skill.damage}</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-neutral-500 bg-neutral-900/40 rounded-xl border border-neutral-900">
                    لم تكتشف مهارات سحرية أو تقنيات قتالية بعد. ابحث عن المخطوطات والرهبان في رحلاتك.
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-bold text-neutral-300 font-serif mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span>الندبات والآثار الجسدية</span>
                </h3>

                {player.scars && player.scars.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {player.scars.map((scar, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-red-950/40 border border-red-900/40 text-red-300 rounded-lg text-xs">
                        ✦ {scar}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-neutral-500 text-xs">
                    جسدك سليم ولم يصب بندبات معارك دائمة حتى الآن.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
