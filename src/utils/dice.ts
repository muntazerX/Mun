import { Currency } from '../types/game';

export interface DiceResult {
  raw: number;
  modifiers: number;
  final: number;
  grade: 'كارثي' | 'قاسٍ' | 'بيثوري' | 'عادي' | 'مثالي';
  color: string;
  emoji: string;
}

export function rollDice(modifiers: number = 0): DiceResult {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const raw = (array[0] % 100) + 1;
  const final = Math.max(1, Math.min(100, raw + modifiers));

  let grade: 'كارثي' | 'قاسٍ' | 'بيثوري' | 'عادي' | 'مثالي' = 'عادي';
  let color = '#4a8b20';
  let emoji = '🙂';

  if (final <= 30) {
    grade = 'كارثي';
    color = '#d44';
    emoji = '💀';
  } else if (final <= 50) {
    grade = 'قاسٍ';
    color = '#da3';
    emoji = '😰';
  } else if (final <= 65) {
    grade = 'بيثوري';
    color = '#8b6914';
    emoji = '😐';
  } else if (final <= 85) {
    grade = 'عادي';
    color = '#4a8b20';
    emoji = '🙂';
  } else {
    grade = 'مثالي';
    color = '#4af';
    emoji = '🌟';
  }

  return { raw, modifiers, final, grade, color, emoji };
}

export function calculateCombatDamage(
  attackerStrength: number,
  weaponDamage: number,
  diceRoll: number,
  targetDefense: number,
  targetArmor: number
): { damage: number; multiplier: number; isCrit: boolean } {
  let multiplier = 1.0;
  let isCrit = false;

  if (diceRoll <= 30) multiplier = 0.25;
  else if (diceRoll <= 50) multiplier = 0.6;
  else if (diceRoll <= 65) multiplier = 0.85;
  else if (diceRoll <= 85) multiplier = 1.0;
  else {
    multiplier = 1.35;
    isCrit = true;
  }

  const base = attackerStrength * 0.35 + 2;
  const rawDamage = (base + weaponDamage) * multiplier;
  const finalDamage = Math.max(1, Math.floor(rawDamage - (targetDefense * 0.4 + targetArmor * 0.6)));

  return { damage: finalDamage, multiplier, isCrit };
}

export interface TransportOption {
  id: string;
  name: string;
  speedKmH: number;
  hoursPerDay: number;
  kmPerDay: number;
  apCostPerDay: number;
  costCopperPerDay: number;
  protectionBonus: number; // bonus to travel dice
  exhaustionPerDay: number;
  caloriesPerKm: number;
  caloriesPerDay: number;
  waterUnitsPerDay: number;
  desc: string;
}

export const TRANSPORTS: TransportOption[] = [
  {
    id: 'foot',
    name: 'مشي على الأقدام',
    speedKmH: 5,
    hoursPerDay: 8,
    kmPerDay: 40,
    apCostPerDay: 3,
    costCopperPerDay: 0,
    protectionBonus: -10,
    exhaustionPerDay: 2,
    caloriesPerKm: 50,
    caloriesPerDay: 2000,
    waterUnitsPerDay: 1,
    desc: 'سير اعتيادي بدون تكلفة مالية، يستهلك ~2000 سعرة يومياً ويرفع الإجهاد'
  },
  {
    id: 'run',
    name: 'ركض مستعجل',
    speedKmH: 14,
    hoursPerDay: 6,
    kmPerDay: 84,
    apCostPerDay: 8,
    costCopperPerDay: 0,
    protectionBonus: -15,
    exhaustionPerDay: 5,
    caloriesPerKm: 60,
    caloriesPerDay: 5000,
    waterUnitsPerDay: 2,
    desc: 'اندفاع شاق يختصر الأيام لكنه يحرق ~5000 سعرة يومياً وينهك الجسد بشدة'
  },
  {
    id: 'horse',
    name: 'جواد ركوب أصيل',
    speedKmH: 18,
    hoursPerDay: 10,
    kmPerDay: 180,
    apCostPerDay: 1,
    costCopperPerDay: 20,
    protectionBonus: 5,
    exhaustionPerDay: 0,
    caloriesPerKm: 7,
    caloriesPerDay: 1200,
    waterUnitsPerDay: 1,
    desc: 'سفر سريع ومريح يختصر المسافات الشاسعة مع استهلاك منخفض للسعرات'
  },
  {
    id: 'camel',
    name: 'جمل صحراوي صبور',
    speedKmH: 7,
    hoursPerDay: 8,
    kmPerDay: 56,
    apCostPerDay: 1,
    costCopperPerDay: 15,
    protectionBonus: 5,
    exhaustionPerDay: 1,
    caloriesPerKm: 25,
    caloriesPerDay: 1400,
    waterUnitsPerDay: 0.5,
    desc: 'صمود عالي أمام عطش الصحراء وعواصف الرمال باستهلاك مائي منخفض'
  },
  {
    id: 'caravan',
    name: 'قافلة تجارية مؤمنة',
    speedKmH: 4,
    hoursPerDay: 6,
    kmPerDay: 24,
    apCostPerDay: 0,
    costCopperPerDay: 40,
    protectionBonus: 20,
    exhaustionPerDay: 0,
    caloriesPerKm: 0,
    caloriesPerDay: 0, // Food & water provided fully by caravan service!
    waterUnitsPerDay: 0,
    desc: 'حماية جماعية وتأمين طعام ومياه ومبيت مجاني مشمول في أجرة القافلة'
  },
  {
    id: 'flying_sword',
    name: 'تحليق بالسيف الروحي',
    speedKmH: 35,
    hoursPerDay: 10,
    kmPerDay: 350,
    apCostPerDay: 12,
    costCopperPerDay: 0,
    protectionBonus: 30,
    exhaustionPerDay: 1,
    caloriesPerKm: 2,
    caloriesPerDay: 800,
    waterUnitsPerDay: 0.5,
    desc: 'طيران فوق الجبال والوديان بسرعات خيالية معتمد على صقل التشي'
  }
];

export const RANKS = [
  { id: 1, name: "أفق الولادة", icon: "🌱", color: "#8b6914" },
  { id: 2, name: "متشرد", icon: "🏚️", color: "#6a5a4a" },
  { id: 3, name: "تائه", icon: "🧭", color: "#5a4a3a" },
  { id: 4, name: "ناجي", icon: "⚔️", color: "#4a6a4a" },
  { id: 5, name: "محارب", icon: "🗡️", color: "#6a4a4a" },
  { id: 6, name: "صائد", icon: "🎯", color: "#4a4a6a" },
  { id: 7, name: "مقاتل", icon: "💀", color: "#6a3a3a" },
  { id: 8, name: "سيّد الحرب", icon: "👑", color: "#8b2020" },
  { id: 9, name: "فاتح", icon: "🔥", color: "#a07a18" },
  { id: 10, name: "أسطورة", icon: "⭐", color: "#d44" },
  { id: 11, name: "ولي", icon: "🌟", color: "#4a8b20" },
  { id: 12, name: "ملك", icon: "💎", color: "#2a4a8b" },
  { id: 13, name: "متألق", icon: "⚡", color: "#6a2a8b" },
  { id: 14, name: "عظيم", icon: "✨", color: "#ff4" },
  { id: 15, name: "ما وراء الوجود", icon: "🌌", color: "#fff" }
];

export function getRankData(level: number) {
  const safeLevel = Math.max(1, Math.min(150, level));
  const rankIdx = Math.min(14, Math.floor((safeLevel - 1) / 10));
  const rankLevel = ((safeLevel - 1) % 10) + 1;
  const rank = RANKS[rankIdx];
  const xpNeeded = safeLevel * 25;
  return {
    rank,
    level: safeLevel,
    rankLevel,
    xpNeeded,
    display: `${rank.icon} ${rank.name} — مستوى ${rankLevel}`
  };
}

export function currencyToCopper(curr: Currency): number {
  return (curr.G || 0) * 10000 + (curr.S || 0) * 100 + (curr.C || 0);
}

export function copperToCurrency(copper: number): Currency {
  const safeCopper = Math.max(0, Math.floor(copper));
  const G = Math.floor(safeCopper / 10000);
  const S = Math.floor((safeCopper % 10000) / 100);
  const C = safeCopper % 100;
  return { G, S, C };
}

// Extract exact calories per unit of an item
export function getItemCalorieValue(item: { item: string; calories?: number; special?: any }): number {
  if (item.calories && item.calories > 0) return item.calories;
  if (item.special?.calories && item.special.calories > 0) return item.special.calories;
  if (item.special?.type === 'food' && item.special?.value) return item.special.value;

  const name = item.item.toLowerCase();
  if (name.includes('ميرة سفر كبرى')) return 12000;
  if (name.includes('ميرة سفر')) return 3500;
  if (name.includes('وجبة حساء') || name.includes('لحم مقدد')) return 1200;
  if (name.includes('تمر') || name.includes('رغيف')) return 400;
  if (name.includes('زاد') || name.includes('طعام') || name.includes('مؤن')) return 1000;
  if (name.includes('خبز') || name.includes('كعك')) return 500;
  if (name.includes('شاي') || name.includes('مشروب')) return 100;
  return 0;
}

// Extract exact water units (1 unit = 1 day hydration)
export function getItemWaterUnits(item: { item: string; water?: number; special?: any }): number {
  if (item.water && item.water > 0) return item.water;
  if (item.special?.water && item.special.water > 0) return item.special.water;
  if (item.special?.type === 'water') return (item.special?.value ? item.special.value / 100 : 1) * 2;

  const name = item.item.toLowerCase();
  if (name.includes('قربة ماء جلدية محكمة')) return 3; // 3 days of water
  if (name.includes('قربة ماء') || name.includes('ماء عذب')) return 2; // 2 days
  if (name.includes('جرعة') || name.includes('شربة ماء')) return 0.5;
  return 0;
}

// Calculate true synchronized days of food and water
export function calculateInventorySurvivalDays(
  inventory: Array<{ item: string; qty: number; calories?: number; water?: number; special?: any }>,
  currentCalories: number = 8000,
  currentHydration: number = 100,
  dailyCalorieBurn: number = 2000,
  dailyWaterBurn: number = 1
): {
  totalInventoryCalories: number;
  totalCaloriesAvailable: number;
  foodDays: number;
  totalInventoryWaterUnits: number;
  waterDays: number;
} {
  let totalInventoryCalories = 0;
  let totalInventoryWaterUnits = 0;

  for (const item of inventory) {
    const qty = Math.max(1, item.qty || 1);
    const cal = getItemCalorieValue(item);
    if (cal > 0) {
      totalInventoryCalories += cal * qty;
    }
    const w = getItemWaterUnits(item);
    if (w > 0) {
      totalInventoryWaterUnits += w * qty;
    }
  }

  const totalCaloriesAvailable = currentCalories + totalInventoryCalories;
  const foodDays = Math.max(0, Math.floor(totalCaloriesAvailable / Math.max(1, dailyCalorieBurn)));
  
  // Hydration percentage is 0-100%, 100% = 1 day of hydration stored in the body
  const bodyWaterDays = Math.max(0, currentHydration / 100);
  const totalWaterAvailable = bodyWaterDays + totalInventoryWaterUnits;
  const waterDays = Math.max(0, Math.floor(totalWaterAvailable / Math.max(0.5, dailyWaterBurn)));

  return {
    totalInventoryCalories,
    totalCaloriesAvailable,
    foodDays,
    totalInventoryWaterUnits,
    waterDays
  };
}
