import { InventoryItem } from '../types/game';

export const RARITY_LABELS: Record<string, string> = {
  common: 'شائع',
  uncommon: 'غير مألوف',
  rare: 'نادر',
  epic: 'ملحمي',
  legendary: 'أسطوري',
  unique: 'فريد'
};

export const RARITY_COLORS: Record<string, string> = {
  common: '#a89880',
  uncommon: '#4a8b20',
  rare: '#2a6a9b',
  epic: '#8a3a9b',
  legendary: '#d4a020',
  unique: '#d44'
};

export const DEFAULT_WEAPONS: InventoryItem[] = [
  { id: 'w_rusty_dagger', item: 'سكين صدئ', qty: 1, weight: 0.4, rarity: 'common', damage: 3, desc: 'خنجر قديم أكل عليه الصدأ ومقبضه متشقق.' },
  { id: 'w_iron_dagger', item: 'خنجر حديدي', qty: 1, weight: 0.5, rarity: 'common', damage: 5, desc: 'خنجر حديدي متين وصلب للطعن السريع.' },
  { id: 'w_iron_shortsword', item: 'سيف حديدي قصير', qty: 1, weight: 1.0, rarity: 'common', damage: 7, desc: 'سيف قصير متوازن من الحديد المطروق.' },
  { id: 'w_iron_longsword', item: 'سيف طويل حديدي', qty: 1, weight: 1.5, rarity: 'common', damage: 9, desc: 'سيف حرب صلب يحتاج كلتا اليدين أو قوة كافية.' },
  { id: 'w_steel_sword', item: 'سيف فولاذي مصقول', qty: 1, weight: 1.4, rarity: 'uncommon', damage: 12, desc: 'نصل دمشقي حاد يلمع تحت ضوء البدر.' },
  { id: 'w_hunting_bow', item: 'قوس صيد خفيف', qty: 1, weight: 0.9, rarity: 'common', damage: 6, desc: 'قوس قصير من خشب الطقسوس لصيد البراري.' },
  { id: 'w_war_axe', item: 'فأس حرب ثنائية', qty: 1, weight: 2.2, rarity: 'uncommon', damage: 13, desc: 'فأس حربية برأس مزدوج تحطم الدروع الثقيلة.' },
  { id: 'w_poison_dagger', item: 'خنجر العقرب المسموم', qty: 1, weight: 0.4, rarity: 'rare', damage: 8, desc: 'نصل معتم مغموس في سم أفاعي الصحراء.', special: { type: 'poison', desc: 'يسمم الهدف 4 ضرر لكل جولة', chance: 45 } },
  { id: 'w_inferno_blade', item: 'سيف اللهب الأسود', qty: 1, weight: 1.6, rarity: 'epic', damage: 16, desc: 'سيف حارق تتصاعد منه أبخرة حرارية ملتهبة.', special: { type: 'burn', desc: 'يحرق العدو بلهب إضافي 6 ضرر', chance: 35 } },
  { id: 'w_doombringer', item: 'جالب الهلاك الأسطوري', qty: 1, weight: 2.5, rarity: 'legendary', damage: 22, desc: 'سيف عتيق صُنع من حجر نيزكي سقط في ليلة انطفاء النجوم.', special: { type: 'lifesteal', desc: 'يمتص 8 صحة من العدو عند كل ضربة حرجة', chance: 40 } }
];

export const DEFAULT_ARMORS: InventoryItem[] = [
  { id: 'a_woolen_cloak', item: 'عباءة صوفية', qty: 1, weight: 1.2, rarity: 'common', defense: 1, desc: 'عباءة سميكة تدفئ في برد الشمال وتحمي من رمال الشرق.' },
  { id: 'a_leather_vest', item: 'سترة جلدية مقواة', qty: 1, weight: 2.0, rarity: 'common', defense: 2, desc: 'سترة من جلد ثور مدبوغ تصد الطعنات الخفيفة.' },
  { id: 'a_chainmail', item: 'درع بريد متسلسل', qty: 1, weight: 5.5, rarity: 'uncommon', defense: 6, desc: 'قميص من حلقات فولاذية متشابكة يصد السيوف.' },
  { id: 'a_steel_plate', item: 'درع صفائح فولاذية', qty: 1, weight: 8.5, rarity: 'rare', defense: 10, desc: 'درع فرسان ثقيل يمنح حماية صلبة كالحصن.' },
  { id: 'a_shadow_cloak', item: 'عباءة أطياف الظل', qty: 1, weight: 0.8, rarity: 'epic', defense: 4, desc: 'عباءة نسيجها يمتزج بالظلام ويصعّب رصد المرتدي.', special: { type: 'dodge', desc: 'فرصة 25% لتفادي الهجمات المباشرة', chance: 25 } },
  { id: 'a_dragonscale', item: 'درع حراشف التنين القديم', qty: 1, weight: 6.0, rarity: 'legendary', defense: 16, desc: 'حراشف كائن أسطوري تقاوم الحرق والطعن العنيف.', special: { type: 'reflect', desc: 'يعكس 20% من الضرر على المهاجم', chance: 30 } }
];

export const COMMON_TOOLS: InventoryItem[] = [
  { id: 't_water_skin', item: 'قربة ماء جلدية', qty: 1, weight: 0.5, rarity: 'common', desc: 'قربة تحفظ الماء العذب أثناء السفر.' },
  { id: 't_rations', item: 'حصة مؤن جافة', qty: 3, weight: 0.3, rarity: 'common', desc: 'تمر ولحم مجفف يسد رمق الجوع في الطرق الطويلة.' },
  { id: 't_healing_herbs', item: 'أعشاب شمسية مطهرة', qty: 2, weight: 0.1, rarity: 'common', desc: 'أعشاب ضماد سريعة توقف النزيف وتعيد 15 HP.' },
  { id: 't_torch', item: 'مشعل زفتي مشتعل', qty: 1, weight: 0.3, rarity: 'common', desc: 'ينير الكهوف والممرات المظلمة ويرهب الوحوش.' },
  { id: 't_rope', item: 'حبل متين من الليف (5م)', qty: 1, weight: 0.8, rarity: 'common', desc: 'حبل قوي لتسلق الصخور وعبور الحفر.' },
  { id: 't_lockpicks', item: 'طقم نقب أقفال دقيق', qty: 1, weight: 0.1, rarity: 'uncommon', desc: 'أدوات حديدية رقيقة لفتح الصناديق والأبواب القديمة.' },
  { id: 't_healing_potion', item: 'جرعة ترياق كيميائية', qty: 1, weight: 0.3, rarity: 'uncommon', desc: 'سائل أحمر يعالج السموم ويستعيد 35 HP فوراً.' }
];
