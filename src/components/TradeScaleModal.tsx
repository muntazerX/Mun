import React, { useState } from 'react';
import { TRADE_SCALE, PriceTier, TradeItemExample } from '../data/tradeScale';
import { soundEngine } from '../utils/audio';
import { 
  Scale, 
  X, 
  Search, 
  Coins, 
  Sparkles, 
  Flame, 
  Shield, 
  Swords, 
  Scroll, 
  Briefcase, 
  Heart, 
  Compass,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface TradeScaleModalProps {
  onClose: () => void;
}

export const TradeScaleModal: React.FC<TradeScaleModalProps> = ({ onClose }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedTier, setExpandedTier] = useState<string | null>('tier_10_copper');

  const categories = [
    { id: 'all', name: 'كافة التصنيفات' },
    { id: 'طعام وسعرات', name: '🍞 طعام وسعرات' },
    { id: 'سلاح وعتاد', name: '⚔️ أسلحة وعتاد' },
    { id: 'دروع وحماية', name: '🛡️ دروع وحماية' },
    { id: 'جرعات وأدوية', name: '🧪 جرعات وأدوية' },
    { id: 'أجور وعمل', name: '💼 أجور ووظائف' },
    { id: 'دواب ونقل', name: '🐎 دواب وسفر' },
    { id: 'مخطوطات وفنون', name: '📜 مخطوطات مرويم' },
    { id: 'أملاك وخدمات', name: '🏰 أملاك وعقارات' },
    { id: 'نوادر وأساطير', name: '✨ نوادر وأساطير' }
  ];

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'طعام وسعرات': return <Flame className="w-3.5 h-3.5 text-amber-500" />;
      case 'سلاح وعتاد': return <Swords className="w-3.5 h-3.5 text-red-400" />;
      case 'دروع وحماية': return <Shield className="w-3.5 h-3.5 text-blue-400" />;
      case 'جرعات وأدوية': return <Heart className="w-3.5 h-3.5 text-emerald-400" />;
      case 'مخطوطات وفنون': return <Scroll className="w-3.5 h-3.5 text-purple-400" />;
      case 'أجور وعمل': return <Briefcase className="w-3.5 h-3.5 text-yellow-400" />;
      case 'دواب ونقل': return <Compass className="w-3.5 h-3.5 text-orange-400" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-amber-300" />;
    }
  };

  const filteredTiers = TRADE_SCALE.map(tier => {
    const matchingExamples = tier.examples.filter(ex => {
      const matchSearch = !search.trim() || 
        ex.name.toLowerCase().includes(search.toLowerCase()) || 
        ex.desc.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === 'all' || ex.category === selectedCategory;
      return matchSearch && matchCat;
    });
    return { ...tier, examples: matchingExamples };
  }).filter(tier => tier.examples.length > 0 || !search.trim());

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full sm:max-w-4xl bg-neutral-950 border border-amber-900/40 rounded-t-2xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800 bg-neutral-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-950/40 border border-amber-800/50 rounded-xl">
              <Scale className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-amber-300 text-sm sm:text-base">
                ميزان التجارة وفئات التسعير الإلزامية لقارة التربة القاتمة
              </h2>
              <p className="text-[11px] text-neutral-400 font-mono">
                المعيار الرسمي لتقييم السلع، السعرات، الأجور، والعتاد الأسطوري (14 فئة سعرية معيارية)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Currency Conversion Ruler */}
        <div className="bg-neutral-900/60 border-b border-neutral-800 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-4 text-amber-300">
            <span>🪙 1 دينار ذهبي (G) = 100 فضية</span>
            <span>·</span>
            <span>🥈 1 درهم فضي (S) = 100 نحاس</span>
            <span>·</span>
            <span>🥉 1 ذهب = 10,000 نحاس (C)</span>
          </div>
          <span className="text-[11px] text-neutral-500">
            مقياس إلزامي يخضع له كل تجار القارة والذكاء الاصطناعي
          </span>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="p-3 bg-neutral-950 border-b border-neutral-850 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-500 absolute right-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن سلاح، وجبة، أجر عمل، دواء، أو أثر أسطوري..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pr-9 pl-3 py-1.5 text-xs text-neutral-200 outline-none focus:border-amber-500 font-serif"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] no-scrollbar">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedCategory(c.id);
                }}
                className={`px-2.5 py-1 rounded-lg border whitespace-nowrap cursor-pointer transition-all ${
                  selectedCategory === c.id
                    ? 'bg-amber-600 text-black font-bold border-amber-600'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Price Tiers Accordion List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          {filteredTiers.map((tier) => {
            const isExpanded = expandedTier === tier.id || Boolean(search.trim());

            return (
              <div
                key={tier.id}
                className="border border-neutral-800/90 rounded-2xl bg-neutral-900/50 overflow-hidden shadow-sm"
              >
                {/* Tier Header Toggle */}
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setExpandedTier(isExpanded ? null : tier.id);
                  }}
                  className="w-full px-4 py-3 bg-neutral-900/90 hover:bg-neutral-850 flex items-center justify-between text-right cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-400 text-xs font-bold font-mono">
                      {tier.valueDisplay}
                    </span>
                    <div>
                      <h3 className="font-serif font-bold text-neutral-100 text-xs sm:text-sm">
                        {tier.name}
                      </h3>
                      <p className="text-[11px] text-neutral-400 font-serif line-clamp-1">
                        {tier.significance}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-amber-500/80 font-mono hidden sm:inline">
                      {tier.examples.length} أمثلة معيارية
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-neutral-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400" />
                    )}
                  </div>
                </button>

                {/* Tier Body (10 Examples) */}
                {isExpanded && (
                  <div className="p-3 sm:p-4 border-t border-neutral-800/80 bg-neutral-950/70 space-y-2">
                    <p className="text-xs text-neutral-400 leading-relaxed font-serif pb-2 border-b border-neutral-900">
                      💡 <strong>المعنى والقوة الشرائية:</strong> {tier.significance}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {tier.examples.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-neutral-900/70 border border-neutral-800/70 flex flex-col justify-between text-xs hover:border-neutral-700 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="font-bold text-neutral-200 flex items-center gap-1.5 font-serif">
                              {getCategoryIcon(item.category)}
                              <span>{item.name}</span>
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 whitespace-nowrap font-mono">
                              {item.category}
                            </span>
                          </div>

                          <p className="text-[11px] text-neutral-400 font-serif leading-relaxed">
                            {item.desc}
                          </p>

                          {item.calories && (
                            <div className="mt-1.5 pt-1 border-t border-neutral-800/50 flex items-center gap-1 text-[10px] text-amber-400 font-mono font-bold">
                              <Flame className="w-3 h-3 text-amber-500" />
                              <span>يمنح: +{item.calories.toLocaleString('ar-SA')} سعرة حرارية</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer info note */}
        <div className="p-3 bg-neutral-900/90 border-t border-neutral-800 text-center text-xs text-neutral-400 font-serif">
          يتم احتساب السعرات والأسعار في كل المتاجر والصفقات والمكافآت بصرامة استناداً إلى هذا الميزان.
        </div>
      </div>
    </div>
  );
};
