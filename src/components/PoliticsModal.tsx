import React, { useState } from 'react';
import { PoliticsState, Faction, PlayerStats } from '../types/game';
import { soundEngine } from '../utils/audio';
import { 
  Swords, 
  Flame, 
  X, 
  Shield,
  HeartHandshake,
  Crown,
  Award,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface PoliticsModalProps {
  politics: PoliticsState;
  factions: Record<string, Faction>;
  player: PlayerStats;
  onClose: () => void;
  onJoinFaction: (faction: Faction, initialRank: string) => void;
  onPromoteFactionRank: (faction: Faction, nextRank: string) => void;
  onLeaveFaction: () => void;
  onTravelToSect?: (landmark: string) => void;
}

export const PoliticsModal: React.FC<PoliticsModalProps> = ({
  politics,
  factions,
  player,
  onClose,
  onJoinFaction,
  onPromoteFactionRank,
  onLeaveFaction,
  onTravelToSect
}) => {
  const [activeTab, setActiveTab] = useState<'kingdoms' | 'factions' | 'wars' | 'news'>('factions');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [selectedFaction, setSelectedFaction] = useState<Faction | null>(null);

  const allKingdoms = [politics.empire, ...politics.kingdoms];
  const activeWars = politics.wars.filter(w => w.status !== 'ended');

  const getKingdomName = (id: string): string => {
    if (id === 'empire') return politics.empire.name;
    const found = politics.kingdoms.find(k => k.id === id);
    return found ? found.name : id;
  };

  const filteredFactions = Object.values(factions).filter(f => {
    if (f.status === 'destroyed') return false;
    if (zoneFilter === 'all') return true;
    return f.zone.includes(zoneFilter);
  });

  // Check if player is eligible for promotion in their current sect
  const getNextRankInfo = (f: Faction) => {
    if (!f.ranks || !player.faction_rank) return null;
    const currentIdx = f.ranks.findIndex(r => r.name === player.faction_rank);
    if (currentIdx === -1) {
      // Try fuzzy match
      const fuzzyIdx = f.ranks.findIndex(r => player.faction_rank?.includes(r.name) || r.name.includes(player.faction_rank || ''));
      if (fuzzyIdx !== -1 && fuzzyIdx < f.ranks.length - 1) return f.ranks[fuzzyIdx + 1];
      return f.ranks[1] || null;
    }
    if (currentIdx >= f.ranks.length - 1) return null;
    return f.ranks[currentIdx + 1];
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full sm:max-w-3xl bg-neutral-950 border border-amber-900/40 rounded-t-2xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800 bg-neutral-900/80">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-red-500" />
            <div>
              <h2 className="font-serif font-bold text-amber-300 text-sm">شؤون الممالك وطوائف المرويم والحروب</h2>
              <span className="text-[11px] text-neutral-400 font-mono">
                {player.faction_name ? `طائفتك الحالية: ${player.faction_name} (${player.faction_rank})` : 'أنت حر بلا انتماء لطائفة'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-neutral-800 bg-neutral-950 px-4 text-xs">
          <button
            onClick={() => {
              setActiveTab('factions');
              setSelectedFaction(null);
            }}
            className={`flex-1 py-3 font-semibold border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'factions'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span>طوائف المرويم</span>
            <span className="text-[10px] bg-neutral-900 px-1.5 py-0.2 rounded font-mono">
              {filteredFactions.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('kingdoms');
              setSelectedFaction(null);
            }}
            className={`flex-1 py-3 font-semibold border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'kingdoms'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>الممالك والعرش الإمبراطوري</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('wars');
              setSelectedFaction(null);
            }}
            className={`flex-1 py-3 font-semibold border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'wars'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-red-500" />
            <span>الحروب ({activeWars.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('news');
              setSelectedFaction(null);
            }}
            className={`flex-1 py-3 font-semibold border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'news'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span>الأخبار العالمية</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-4 sm:p-5 overflow-y-auto max-h-[70vh] space-y-3 text-xs">
          
          {/* TAB 1: FACTIONS & MURIM SECTS */}
          {activeTab === 'factions' && !selectedFaction && (
            <div className="space-y-3">
              {/* Region Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
                {[
                  { id: 'all', name: 'جميع الأقاليم' },
                  { id: 'شمال', name: 'المرتفعات الشمالية' },
                  { id: 'شرق', name: 'الصحراء الشرقية' },
                  { id: 'وسط', name: 'السهول الوسطى' },
                  { id: 'جنوب', name: 'الأراضي الرطبة' },
                  { id: 'غرب', name: 'الساحل الغربي' }
                ].map((z) => (
                  <button
                    key={z.id}
                    onClick={() => setZoneFilter(z.id)}
                    className={`px-3 py-1 rounded-lg border whitespace-nowrap transition-all cursor-pointer ${
                      zoneFilter === z.id
                        ? 'bg-amber-600 text-black font-bold border-amber-600'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    {z.name}
                  </button>
                ))}
              </div>

              {/* Factions Cards List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {filteredFactions.map((f) => {
                  const isPlayerSect = player.faction_id === f.id;

                  return (
                    <div
                      key={f.id}
                      onClick={() => {
                        soundEngine.playClick();
                        setSelectedFaction(f);
                      }}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isPlayerSect
                          ? 'bg-amber-950/40 border-amber-500 shadow-lg shadow-amber-950/50'
                          : 'bg-neutral-900/70 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xl p-1 bg-neutral-950 rounded-lg border border-neutral-800">
                              {f.emblem}
                            </span>
                            <div>
                              <h3 className="font-bold text-amber-200 text-sm flex items-center gap-1.5">
                                <span>{f.name}</span>
                                {isPlayerSect && (
                                  <span className="text-[10px] bg-amber-500 text-black px-1.5 py-0.2 rounded font-mono font-bold">
                                    طائفتك
                                  </span>
                                )}
                              </h3>
                              <span className="text-[11px] text-neutral-500 font-mono">
                                {f.type} · {f.zone}
                              </span>
                            </div>
                          </div>

                          <span className={`text-[10px] px-2 py-0.5 rounded font-mono border ${
                            f.alignment === 'صالح'
                              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                              : f.alignment === 'شرير'
                              ? 'bg-red-950/60 text-red-300 border-red-800'
                              : 'bg-amber-950/60 text-amber-300 border-amber-800'
                          }`}>
                            {f.alignment}
                          </span>
                        </div>

                        <p className="text-[11px] text-neutral-400 line-clamp-2 font-serif leading-relaxed mb-2">
                          {f.description || 'طائفة مرويم عريقة تتبع مسار الفنون القتالية والصمود.'}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-neutral-400">
                          الزعيم: <strong className="text-neutral-200">{f.lordName}</strong>
                        </span>
                        <div className="flex items-center gap-1 text-amber-400 font-mono font-bold">
                          <span>{f.members.toLocaleString('ar-SA')} تلميذ</span>
                          <ChevronRight className="w-4 h-4 text-neutral-500" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* FACTION DETAILS & MURIM JOINING SHEET */}
          {activeTab === 'factions' && selectedFaction && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Back button */}
              <button
                onClick={() => setSelectedFaction(null)}
                className="flex items-center gap-1 text-neutral-400 hover:text-amber-300 text-xs cursor-pointer font-serif mb-2"
              >
                <span>← العودة لقائمة الطوائف</span>
              </button>

              {/* Sect Dossier Header */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/30 to-neutral-900 border border-amber-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-4xl p-3 bg-neutral-950 rounded-2xl border border-neutral-800">
                    {selectedFaction.emblem}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-amber-200 font-serif">{selectedFaction.name}</h2>
                      <span className="text-[10px] bg-neutral-900 border border-neutral-700 text-neutral-300 px-2 py-0.5 rounded font-mono">
                        {selectedFaction.type}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 font-mono mt-0.5">
                      المعقل الرئيسي: <strong className="text-amber-400">{selectedFaction.landmark}</strong> ({selectedFaction.zone})
                    </p>
                    <p className="text-xs text-neutral-300 font-serif mt-1">
                      سيد الطائفة: <strong className="text-amber-300">{selectedFaction.lordName}</strong> [مستوى {selectedFaction.lordLevel}] · القوة: {selectedFaction.power}/100
                    </p>
                  </div>
                </div>

                <div className="text-right sm:text-left font-mono">
                  <span className="text-amber-400 text-base font-bold block">
                    {selectedFaction.members.toLocaleString('ar-SA')}
                  </span>
                  <span className="text-[11px] text-neutral-500">تلميذ ومقاتل نشط</span>
                </div>
              </div>

              {/* Sect Lore Description */}
              <div className="p-3.5 bg-neutral-900/70 border border-neutral-800 rounded-xl">
                <h4 className="font-bold text-amber-300 text-xs mb-1 font-serif">عقيدة الطائفة وفلسفتها القتالية:</h4>
                <p className="text-neutral-300 text-xs leading-relaxed font-serif">
                  {selectedFaction.description}
                </p>
                {selectedFaction.exclusivePerk && (
                  <div className="mt-2.5 pt-2 border-t border-neutral-800/80 flex items-center gap-1.5 text-xs text-amber-400">
                    <Award className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>امتياز الطائفة الحصري: <strong>{selectedFaction.exclusivePerk}</strong></span>
                  </div>
                )}
              </div>

              {/* Murim Ranks Ladder */}
              <div className="space-y-2">
                <h4 className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-500" />
                  <span>سلم رتب الطائفة (نظام المرويم):</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(selectedFaction.ranks || [
                    { name: "تلميذ خارجي", minLevel: selectedFaction.minJoinLevel || 2, perks: "رداء الطائفة وسلاح التدريب المبدئي، +5% هجوم" },
                    { name: "تلميذ داخلي", minLevel: (selectedFaction.minJoinLevel || 2) + 6, perks: "فنون الطائفة المتقدمة، وصول للمكتبة السرية، +12% دفاع" },
                    { name: "تلميذ النخبة", minLevel: (selectedFaction.minJoinLevel || 2) + 15, perks: "توجيه الشيوخ المباشر، +25% صحة ومتانة" },
                    { name: "شيخ الطائفة", minLevel: 35, perks: "إمرة فيالق الطائفة وإدارة شؤون المعقل" }
                  ]).map((rank, idx) => {
                    const isCurrent = player.faction_id === selectedFaction.id && player.faction_rank === rank.name;

                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-xs flex flex-col justify-between ${
                          isCurrent
                            ? 'bg-amber-950/40 border-amber-500 shadow-md'
                            : 'bg-neutral-900/60 border-neutral-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-neutral-200 flex items-center gap-1">
                            <span>{idx + 1}. {rank.name}</span>
                            {isCurrent && (
                              <span className="text-[10px] bg-amber-500 text-black px-1.5 rounded font-mono font-bold">
                                رتبتك الحالية
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-amber-500 font-mono">
                            المستوى {rank.minLevel}+
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 font-serif leading-relaxed">
                          {rank.perks}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Entry Conditions, Relations, & Trials Section */}
              <div className="p-4 bg-neutral-900/90 border border-neutral-800 rounded-xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800/80 pb-2.5">
                  <div>
                    <h4 className="font-bold text-amber-300 text-xs">شروط القبول ومقر الطائفة:</h4>
                    <span className="text-[11px] text-neutral-400 font-mono">
                      مقر الطائفة: <strong className="text-amber-400">{selectedFaction.landmark}</strong> · موقعك الحالي: <strong className={player.current_landmark === selectedFaction.landmark ? "text-emerald-400" : "text-orange-400"}>{player.current_landmark}</strong>
                    </span>
                  </div>

                  {/* Affinity Badge */}
                  {(() => {
                    const affinity = player.faction_relations?.[selectedFaction.id] ?? 0;
                    let affinityLabel = 'حياد وتعامل عادي';
                    let affinityColor = 'text-neutral-400 bg-neutral-800/80 border-neutral-700';
                    if (affinity <= -50) {
                      affinityLabel = 'عداء متبادل ومطاردة';
                      affinityColor = 'text-red-400 bg-red-950/60 border-red-800';
                    } else if (affinity < 0) {
                      affinityLabel = 'ريبة وجفاء';
                      affinityColor = 'text-orange-400 bg-orange-950/60 border-orange-800';
                    } else if (affinity >= 70) {
                      affinityLabel = 'ولاء واندماج مطلق';
                      affinityColor = 'text-emerald-300 bg-emerald-950/60 border-emerald-700';
                    } else if (affinity >= 30) {
                      affinityLabel = 'ثقة وتقدير رفيع';
                      affinityColor = 'text-sky-300 bg-sky-950/60 border-sky-700';
                    } else if (affinity > 0) {
                      affinityLabel = 'احترام متبادل';
                      affinityColor = 'text-amber-300 bg-amber-950/60 border-amber-700';
                    }

                    return (
                      <div className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono flex items-center gap-1.5 ${affinityColor}`}>
                        <span>العلاقة:</span>
                        <strong>{affinity > 0 ? `+${affinity}` : affinity}</strong>
                        <span>({affinityLabel})</span>
                      </div>
                    );
                  })()}
                </div>

                <div className="space-y-1.5 text-xs text-neutral-300 font-serif">
                  <p>• {selectedFaction.joinRequirements || 'مستوى كافٍ واجتياز اختبار المهارة'}</p>
                  <p className="text-amber-200/90">
                    • <strong>وصف الاختبار:</strong> {selectedFaction.trialDesc || 'المبارزة أمام شيوخ الطائفة وإثبات الجدارة'}
                  </p>
                </div>

                {/* Interactive Action Controls */}
                <div className="pt-3 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  {/* Case 1: Player is NOT in this sect */}
                  {player.faction_id !== selectedFaction.id ? (
                    player.faction_id ? (
                      <div className="text-xs text-amber-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>أنت منتمٍ حالياً لطائفة <strong>{player.faction_name}</strong>. غادرها أولاً لتتمكن من الانضمام هنا.</span>
                      </div>
                    ) : player.current_landmark !== selectedFaction.landmark ? (
                      /* STRICT: Must be physically present in the faction city */
                      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 bg-amber-950/30 border border-amber-800/60 p-3 rounded-xl text-xs">
                        <div className="flex items-center gap-2 text-amber-300">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>
                            يجب أن تكون متواجداً شخصياً في مقر الطائفة بـ <strong>{selectedFaction.landmark}</strong> لخوض اختبار القبول! (أنت الآن في <strong>{player.current_landmark}</strong>).
                          </span>
                        </div>
                        {onTravelToSect && (
                          <button
                            onClick={() => {
                              soundEngine.playClick();
                              onTravelToSect(selectedFaction.landmark);
                            }}
                            className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs cursor-pointer shadow-md"
                          >
                            سافر إلى {selectedFaction.landmark}
                          </button>
                        )}
                      </div>
                    ) : (player.faction_relations?.[selectedFaction.id] ?? 0) < (selectedFaction.requiredAffinity ?? 0) ? (
                      <div className="text-xs text-red-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                        <span>علاقتك مع الطائفة متدنية أو معادية ({player.faction_relations?.[selectedFaction.id] ?? 0}) ولا تسمح بالقبول (المطلوب {selectedFaction.requiredAffinity}+).</span>
                      </div>
                    ) : player.level < (selectedFaction.minJoinLevel || 5) ? (
                      <div className="text-xs text-red-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                        <span>مستواك الحالي ({player.level}) لا يكفي لاجتياز اختبار الدخول (مطلوب مستوى {selectedFaction.minJoinLevel || 5}+).</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          soundEngine.playVictoryChime();
                          const initialRank = selectedFaction.ranks?.[0]?.name || 'مريد تمهيدي (تلميذ عامل)';
                          onJoinFaction(selectedFaction, initialRank);
                        }}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-bold text-xs shadow-lg shadow-amber-950/60 active:scale-95 transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>خوض اختبار القبول والانضمام برتبة [{selectedFaction.ranks?.[0]?.name || 'مريد تمهيدي'}]</span>
                      </button>
                    )
                  ) : (
                    /* Case 2: Player IS ALREADY in this sect */
                    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-300 font-bold">
                          أنت عضو رسمي برتبة [{player.faction_rank || 'تلميذ'}]
                        </span>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        {/* Promotion button if eligible */}
                        {(() => {
                          const nextRank = getNextRankInfo(selectedFaction);
                          if (!nextRank) return null;
                          const canPromote = player.level >= nextRank.minLevel;

                          return canPromote ? (
                            <button
                              onClick={() => {
                                soundEngine.playVictoryChime();
                                onPromoteFactionRank(selectedFaction, nextRank.name);
                              }}
                              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs cursor-pointer shadow-md"
                            >
                              <Award className="w-3.5 h-3.5" />
                              <span>ترقية إلى [{nextRank.name}] (مستوى {nextRank.minLevel}+)</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-neutral-500 font-mono">
                              الترقية لـ [{nextRank.name}] تتطلب مستوى {nextRank.minLevel}
                            </span>
                          );
                        })()}

                        <button
                          onClick={() => {
                            soundEngine.playClick();
                            onLeaveFaction();
                          }}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 border border-red-900/60 hover:bg-red-950/40 text-red-400 text-xs cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>مغادرة الطائفة</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KINGDOMS & IMPERIAL HEGEMONY */}
          {activeTab === 'kingdoms' && (
            <div className="space-y-3">
              {allKingdoms.map((k) => {
                const currentWar = activeWars.find(w => w.attacker === k.id || w.defender === k.id);
                const isEmpire = k.id === 'empire';

                return (
                  <div
                    key={k.id}
                    className={`p-4 rounded-xl border space-y-2.5 ${
                      isEmpire 
                        ? 'bg-gradient-to-br from-amber-950/40 via-neutral-950 to-neutral-950 border-amber-500/80 shadow-xl' 
                        : 'bg-neutral-900/60 border-neutral-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl p-1 bg-neutral-950 rounded-lg border border-neutral-800">
                          {k.emblem}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-amber-200 text-sm">{k.name}</h3>
                            {isEmpire && (
                              <span className="text-[10px] bg-amber-500 text-black px-2 py-0.5 rounded font-mono font-bold">
                                السيادة الإمبراطورية الكبرى
                              </span>
                            )}
                            {currentWar && (
                              <span className="text-[10px] bg-red-950/80 border border-red-800 text-red-300 px-1.5 py-0.5 rounded animate-pulse">
                                ⚔️ في حرب نشطة
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-400 font-serif">
                            الحاكم: <strong className="text-neutral-200">{k.ruler}</strong> · العاصمة: {k.capital} · القائد: {k.general}
                          </p>
                        </div>
                      </div>

                      <div className="text-left font-mono text-[11px]">
                        <span className="text-amber-400 block font-bold">قوة العرش {k.rulerPower}</span>
                        <span className="text-neutral-500">المستوى {k.level}</span>
                      </div>
                    </div>

                    {isEmpire && (
                      <p className="text-[11px] text-amber-300/80 font-serif bg-amber-950/30 p-2 rounded-lg border border-amber-900/40 leading-relaxed">
                        🏛️ <strong>دور العرش الإمبراطوري في العالم:</strong> يحكم الإمبراطور سولون الأول القارة من المدينة العظيمة، ويمتلك فيالق الحرس الإمبراطوري المتأهبة للتدخل وفرض مراسيم التهدئة وغرامات الحرب إذا هددت نزاعات الممالك أمن التجارة أو استقرار المدن الكبرى.
                      </p>
                    )}

                    {/* Stats Grid with exact soldier counts */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px] pt-2 border-t border-neutral-800/80">
                      <div className="bg-neutral-950/80 p-2 rounded-lg border border-neutral-800/60">
                        <span className="text-neutral-500 block text-[10px]">الجيش الفعلي</span>
                        <span className="font-mono text-red-400 font-bold block truncate" title={`${k.soldiers.toLocaleString('ar-SA')} مقاتل`}>
                          {k.soldiers.toLocaleString('ar-SA')}
                        </span>
                        <span className="text-[9px] text-neutral-500">جندي نظامي</span>
                      </div>

                      <div className="bg-neutral-950/80 p-2 rounded-lg border border-neutral-800/60">
                        <span className="text-neutral-500 block text-[10px]">تعداد السكان</span>
                        <span className="font-mono text-amber-300 font-bold block truncate">
                          {(k.pop / 1000000).toFixed(1)} مليون
                        </span>
                        <span className="text-[9px] text-neutral-500">نسمة</span>
                      </div>

                      <div className="bg-neutral-950/80 p-2 rounded-lg border border-neutral-800/60">
                        <span className="text-neutral-500 block text-[10px]">الاقتصاد</span>
                        <span className="font-mono text-emerald-400 font-bold block">
                          {k.economy}%
                        </span>
                        <span className="text-[9px] text-neutral-500">خزينة وتجارة</span>
                      </div>

                      <div className="bg-neutral-950/80 p-2 rounded-lg border border-neutral-800/60">
                        <span className="text-neutral-500 block text-[10px]">المعنويات</span>
                        <span className="font-mono text-blue-400 font-bold block">
                          {k.morale}%
                        </span>
                        <span className="text-[9px] text-neutral-500">صمود وولاء</span>
                      </div>
                    </div>

                    {/* Allies & Enemies */}
                    <div className="flex flex-wrap items-center justify-between text-[11px] text-neutral-400 pt-1">
                      <div className="flex items-center gap-1.5">
                        <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
                        <span>الحلفاء: </span>
                        {k.allies.length > 0 ? (
                          <span className="text-emerald-300 font-medium">{k.allies.map(getKingdomName).join('، ')}</span>
                        ) : (
                          <span className="text-neutral-600">لا يوجد حلفاء معلنون</span>
                        )}
                      </div>

                      {k.enemies.length > 0 && (
                        <div className="flex items-center gap-1 text-red-400">
                          <span>العداوة الشديدة: {k.enemies.map(getKingdomName).join('، ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: WARS & CONFLICTS */}
          {activeTab === 'wars' && (
            <div className="space-y-3">
              {activeWars.length > 0 ? (
                activeWars.map((war) => {
                  const atkName = getKingdomName(war.attacker);
                  const defName = getKingdomName(war.defender);

                  return (
                    <div key={war.id} className="p-4 bg-red-950/20 border border-red-900/40 rounded-xl space-y-2.5">
                      <div className="flex items-center justify-between text-red-400 font-bold">
                        <span className="flex items-center gap-1.5">
                          <Flame className="w-4 h-4 text-red-500" />
                          <span>نزاع عسكري مستمر — اليوم {war.currentDay} من الحرب</span>
                        </span>
                        <span className="text-[11px] font-mono bg-red-900/40 border border-red-800/80 px-2 py-0.5 rounded text-red-200">
                          {war.status === 'preparing' ? 'حشد وتحضير الجيوش' : 'معارك دائرة ومجازر'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-neutral-200 font-serif bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800">
                        <span className="text-red-300 font-bold text-sm">{atkName} (المهاجم)</span>
                        <span className="text-neutral-500 font-mono">ضد</span>
                        <span className="text-blue-300 font-bold text-sm">{defName} (المدافع)</span>
                      </div>

                      {/* Precise Casualties Readout */}
                      <div className="grid grid-cols-2 gap-2 text-center text-xs text-neutral-300 pt-1">
                        <div className="bg-neutral-950/80 p-2 rounded-lg border border-red-900/30">
                          <span className="text-neutral-500 block text-[10px]">خسائر {atkName}</span>
                          <span className="text-red-400 font-bold font-mono text-sm block">
                            {war.totalAttackerKilled.toLocaleString('ar-SA')} قتيل
                          </span>
                          <span className="text-[10px] text-neutral-500">
                            نسبة استنزاف الجيش: {war.attackerLosses.toFixed(1)}%
                          </span>
                        </div>

                        <div className="bg-neutral-950/80 p-2 rounded-lg border border-red-900/30">
                          <span className="text-neutral-500 block text-[10px]">خسائر {defName}</span>
                          <span className="text-red-400 font-bold font-mono text-sm block">
                            {war.totalDefenderKilled.toLocaleString('ar-SA')} قتيل
                          </span>
                          <span className="text-[10px] text-neutral-500">
                            نسبة استنزاف الجيش: {war.defenderLosses.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-neutral-500 font-serif">
                  لا توجد حروب عسكرية مفتوحة في هذه اللحظة. الممالك تراقب بعضها بحذر وتحشد قواها.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: WORLD NEWS */}
          {activeTab === 'news' && (
            <div className="space-y-2">
              {politics.politicalEvents.length > 0 ? (
                [...politics.politicalEvents].reverse().slice(0, 40).map((ev, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-neutral-900/70 border border-neutral-800/80 rounded-xl flex items-start gap-3 text-xs"
                  >
                    <span className="text-xl mt-0.5">{ev.icon || '📰'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono mb-1">
                        <span className="text-amber-500 font-bold">اليوم {ev.day}</span>
                        <span className="bg-neutral-800/80 px-2 py-0.5 rounded text-neutral-300 font-sans">{ev.type}</span>
                      </div>
                      <p className="text-neutral-200 leading-relaxed text-xs font-serif">{ev.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-neutral-500 font-serif">
                  لا توجد أخبار عالمية مسجلة بعد. السكون يسبق العواصف في قارة التربة القاتمة.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
