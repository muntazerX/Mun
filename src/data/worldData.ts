import { Kingdom, Faction, PoliticsState, FactionRankInfo } from '../types/game';

export interface MapLandmark {
  name: string;
  icon: string;
  x: number;
  y: number;
  cat: 'urban' | 'wild';
  danger: number;
  resources: string[];
}

export interface MapZone {
  id: string;
  name: string;
  color: string;
  border: string;
  terrain: string;
  path: { x: number; y: number }[];
  landmarks: MapLandmark[];
}

export interface MapRoad {
  name: string;
  points: { x: number; y: number; name?: string; icon?: string }[];
  type: 'highway' | 'road' | 'path' | 'trail';
  color: string;
}

export interface MapMountain {
  name: string;
  icon: string;
  x: number;
  y: number;
  height: number;
  width: number;
  color: string;
}

export const MAP_CONTINENT = {
  name: "تربة قاتمة",
  boundary: [
    { x: -5600, y: -5600 }, { x: 5600, y: -5600 }, { x: 5600, y: 2000 }, { x: 2600, y: 2000 },
    { x: 2600, y: 5000 }, { x: -2000, y: 5000 }, { x: -2000, y: 3200 }, { x: -5600, y: 3200 },
    { x: -5600, y: -5600 }
  ],
  zones: [
    {
      id: "north_highlands",
      name: "المرتفعات الشمالية",
      color: "rgba(35,40,55,0.75)",
      border: "#4a5a7a",
      terrain: "جبال شاهقة مغطاة بالجليد، غابات صنوبر كثيفة، قلاع بركانية",
      path: [
        { x: -3200, y: -5600 }, { x: 1000, y: -5600 }, { x: 1000, y: -2000 }, { x: -3200, y: -2000 }
      ],
      landmarks: [
        { x: -2000, y: -4800, name: "جبل الصاعقة", icon: "🏔️", cat: "wild", danger: 72, resources: ["حديد", "خامات معدنية", "جليد"] },
        { x: -1200, y: -5000, name: "قلعة الرماد", icon: "🏰", cat: "urban", danger: 25, resources: ["أسلحة", "حبوب", "حجر بركاني"] },
        { x: -800, y: -4600, name: "غابة الصنوبر المعتمة", icon: "🌲", cat: "wild", danger: 58, resources: ["خشب صنوبر", "فطر", "أعشاب"] },
        { x: -1600, y: -4400, name: "قرية السحاب", icon: "🏠", cat: "urban", danger: 18, resources: ["جبنة", "حبوب", "صوف"] },
        { x: -2400, y: -4200, name: "قلعة الجليد الشاهق", icon: "🏰", cat: "urban", danger: 30, resources: ["جليد صلب", "أسلحة", "فراء"] },
        { x: -1000, y: -3800, name: "ودي العظام", icon: "💀", cat: "wild", danger: 65, resources: ["عظام قديمة", "فحم"] },
        { x: -1800, y: -3600, name: "منجم الفضة الأعمق", icon: "⛏️", cat: "urban", danger: 45, resources: ["فضة", "ذهب", "بلاتين"] },
        { x: -2600, y: -3800, name: "ممر الأفعى", icon: "🐍", cat: "wild", danger: 70, resources: ["أحجار كريمة", "سموم"] },
        { x: -1400, y: -3200, name: "بحيرة المرآة", icon: "💧", cat: "wild", danger: 20, resources: ["ماء نقي", "سمك"] },
        { x: -2200, y: -3400, name: "قلعة النسور", icon: "🏰", cat: "urban", danger: 22, resources: ["مخطوطات", "أدوية"] },
        { x: -600, y: -4200, name: "الشلال الدموي", icon: "🩸", cat: "wild", danger: 35, resources: ["أحجار حمراء", "ماء معدني"] },
        { x: -1600, y: -5200, name: "قمة الريح", icon: "⛰️", cat: "wild", danger: 80, resources: ["حجر نادر", "أوزون"] },
        { x: -800, y: -3200, name: "قرية الأشباح", icon: "👻", cat: "urban", danger: 55, resources: ["قطع أثرية", "أسرار"] },
        { x: -1200, y: -2800, name: "قلعة العاصفة", icon: "🏰", cat: "urban", danger: 28, resources: ["أسلحة", "فراء"] }
      ]
    },
    {
      id: "east_desert",
      name: "الصحراء الشرقية",
      color: "rgba(55,45,20,0.75)",
      border: "#8a7a3a",
      terrain: "كثبان رملية ممتدة، واحات نادرة، قوافل تجارية، أطلال تحت الرمال",
      path: [
        { x: 2600, y: -5600 }, { x: 5600, y: -5600 }, { x: 5600, y: 2000 }, { x: 2600, y: 2000 }
      ],
      landmarks: [
        { x: 3600, y: -3800, name: "واحة الأمل", icon: "🌴", cat: "urban", danger: 12, resources: ["تمر", "ماء", "توابل"] },
        { x: 4400, y: -2600, name: "أطلال سارغنا", icon: "🏚️", cat: "wild", danger: 50, resources: ["تحف قديمة", "أحجار كريمة"] },
        { x: 3200, y: -3000, name: "قلعة الرمال المتحركة", icon: "🏰", cat: "urban", danger: 35, resources: ["رمال كريستالية", "حبوب"] },
        { x: 2800, y: -3600, name: "سوق القوافل الكبير", icon: "⛺", cat: "urban", danger: 15, resources: ["توابل", "أقمشة", "جمال"] },
        { x: 4000, y: -1800, name: "الهاوية السحيقة", icon: "🕳️", cat: "wild", danger: 85, resources: ["صخور بركانية", "حمم"] },
        { x: 4800, y: -1000, name: "قلعة السراب", icon: "🏰", cat: "urban", danger: 40, resources: ["حجر شفاف", "أوهام"] },
        { x: 3800, y: -1200, name: "قرية الظل", icon: "🏠", cat: "urban", danger: 42, resources: ["أغنام", "جمال", "ماء"] },
        { x: 4600, y: -2200, name: "قصر الذهب الأسود", icon: "🏛️", cat: "urban", danger: 38, resources: ["ذهب أسود", "أحجار كريمة"] },
        { x: 5000, y: -1800, name: "واحة السر المخفي", icon: "💧", cat: "wild", danger: 25, resources: ["ماء عذب", "ليمون"] },
        { x: 3000, y: -4200, name: "قرية القوافل", icon: "🏠", cat: "urban", danger: 10, resources: ["مؤن", "توابل"] },
        { x: 4400, y: -1400, name: "واحة النخيل المسحورة", icon: "🌴", cat: "wild", danger: 48, resources: ["تمر مسحور", "نخيل"] }
      ]
    },
    {
      id: "central_plains",
      name: "السهول الوسطى",
      color: "rgba(25,45,30,0.75)",
      border: "#4a8b4a",
      terrain: "سهول خصبة واسعة، أنهار عريضة، حقول قمح، مدن كبرى مسوّرة",
      path: [
        { x: -2000, y: -2000 }, { x: 2600, y: -2000 }, { x: 2600, y: 2000 }, { x: -2000, y: 2000 }
      ],
      landmarks: [
        { x: 0, y: -600, name: "المدينة العظيمة", icon: "🏛️", cat: "urban", danger: 15, resources: ["حبوب", "حرف يدوية", "أسلحة", "ذهب"] },
        { x: 800, y: -400, name: "مدينة النور", icon: "🏛️", cat: "urban", danger: 18, resources: ["كتب", "فلك", "زجاج"] },
        { x: -400, y: 200, name: "قلعة الحراس", icon: "🏰", cat: "urban", danger: 20, resources: ["أسلحة", "فراء", "حبوب"] },
        { x: 1200, y: 200, name: "قرية المزارعين", icon: "🏠", cat: "urban", danger: 8, resources: ["حبوب", "خضار", "فواكه"] },
        { x: 1600, y: -200, name: "مدينة الحرفيين", icon: "🏛️", cat: "urban", danger: 12, resources: ["أسلحة", "دروع", "نحاس"] },
        { x: -1200, y: -400, name: "قلعة الحدود الشمالية", icon: "🏰", cat: "urban", danger: 25, resources: ["أسلحة", "مؤن"] },
        { x: 400, y: 800, name: "قرية النهر", icon: "🏠", cat: "urban", danger: 10, resources: ["سمك", "قوارب"] },
        { x: -800, y: 1000, name: "مدينة الميزة", icon: "🏛️", cat: "urban", danger: 14, resources: ["سجاد", "توابل", "ذهب"] },
        { x: 2000, y: 600, name: "قلعة البحيرة", icon: "🏰", cat: "urban", danger: 40, resources: ["سمك", "فضة"] },
        { x: -1600, y: 0, name: "قرية الريح", icon: "🏠", cat: "urban", danger: 15, resources: ["قمح", "طواحين"] },
        { x: 2400, y: -600, name: "قلعة الصحراء", icon: "🏰", cat: "urban", danger: 22, resources: ["أسلحة", "مؤن"] },
        { x: -400, y: -1200, name: "نهر الأزرق", icon: "💧", cat: "wild", danger: 30, resources: ["سمك", "ماء", "ذهب رملي"] },
        { x: 800, y: 1400, name: "غابة الأشباح", icon: "🌲", cat: "wild", danger: 55, resources: ["خشب عتيق", "أعشاب"] },
        { x: 1600, y: 1000, name: "ودي الزهور", icon: "🌺", cat: "wild", danger: 20, resources: ["زهور", "عسل"] },
        { x: 0, y: 1600, name: "مدينة البُحّارين", icon: "🏛️", cat: "urban", danger: 12, resources: ["سمك مملح", "قوارب"] },
        { x: 2000, y: 1200, name: "كهف الحكمة", icon: "🕳️", cat: "urban", danger: 8, resources: ["مخطوطات", "ألواح"] },
        { x: -800, y: -1600, name: "قلعة الذاكرة المفقودة", icon: "🏚️", cat: "urban", danger: 60, resources: ["أحجار بيضاء", "رموز"] }
      ]
    },
    {
      id: "south_wetlands",
      name: "الأراضي الرطبة الجنوبية",
      color: "rgba(20,45,35,0.75)",
      border: "#3a7a5a",
      terrain: "مستنقعات ضبابية، قنوات مائية، قرى عائمة، كائنات ضخمة في القصب",
      path: [
        { x: -2000, y: 2000 }, { x: 2600, y: 2000 }, { x: 2600, y: 5000 }, { x: -2000, y: 5000 }
      ],
      landmarks: [
        { x: -400, y: 3600, name: "غابة الأشباح الاستوائية", icon: "🌿", cat: "wild", danger: 75, resources: ["خشب نادر", "فطر"] },
        { x: 800, y: 4000, name: "بحيرة الدم", icon: "💧", cat: "wild", danger: 55, resources: ["طحالب حمراء", "معادن"] },
        { x: -800, y: 2800, name: "قرية المتسليحين", icon: "🏠", cat: "urban", danger: 30, resources: ["سمك", "أخشاب"] },
        { x: 1200, y: 3200, name: "واحة البحيرة الساحرة", icon: "💧", cat: "wild", danger: 25, resources: ["ماء مضيء", "أعشاب"] },
        { x: -1200, y: 3600, name: "قلعة المستنقع", icon: "🏰", cat: "urban", danger: 28, resources: ["حديد", "سمك"] },
        { x: 400, y: 3200, name: "أهوار الرعب", icon: "🌿", cat: "wild", danger: 88, resources: ["جلد تمساح", "عظام"] },
        { x: 1600, y: 3600, name: "قرية النحل العملاق", icon: "🏠", cat: "urban", danger: 20, resources: ["عسل ذهبي", "شمع"] },
        { x: -400, y: 4400, name: "الشلالات الصاخبة", icon: "🌊", cat: "wild", danger: 35, resources: ["ماء", "أسماك"] },
        { x: 400, y: 2800, name: "قرية الصيادين القدماء", icon: "🏠", cat: "urban", danger: 12, resources: ["سمك", "أعشاب"] },
        { x: 1200, y: 4400, name: "قلعة الماء", icon: "🏰", cat: "urban", danger: 22, resources: ["ماء عذب", "حجر أبيض"] },
        { x: -400, y: 2400, name: "قرية الأكواخ العائمة", icon: "🏠", cat: "urban", danger: 15, resources: ["سمك", "قصب"] }
      ]
    },
    {
      id: "west_coast",
      name: "الساحل الغربي",
      color: "rgba(20,35,50,0.75)",
      border: "#3a5a8a",
      terrain: "سواحل صخرية شاهقة، موانئ عاتية، أمواج ملحية، أساطيل حربية",
      path: [
        { x: -5600, y: -5600 }, { x: -3200, y: -5600 }, { x: -3200, y: -2000 }, { x: -2000, y: -2000 },
        { x: -2000, y: 3200 }, { x: -5600, y: 3200 }
      ],
      landmarks: [
        { x: -3600, y: -3000, name: "ميناء الصخور", icon: "⚓", cat: "urban", danger: 15, resources: ["سمك", "قوارب"] },
        { x: -4200, y: -1500, name: "قلعة الأمواج", icon: "🏰", cat: "urban", danger: 30, resources: ["ملح", "أصداف"] },
        { x: -3000, y: -1800, name: "جزيرة الأسرار", icon: "🏝️", cat: "wild", danger: 50, resources: ["تحف غارقة", "لؤلؤ"] },
        { x: -4600, y: -800, name: "قرية الملح الأزرق", icon: "🏠", cat: "urban", danger: 10, resources: ["ملح أزرق", "سمك"] },
        { x: -4400, y: 800, name: "ميناء الريح الشمالية", icon: "⚓", cat: "urban", danger: 12, resources: ["أخشاب", "حبوب", "سمك"] },
        { x: -3600, y: 1200, name: "قرية الحوت", icon: "🏠", cat: "urban", danger: 25, resources: ["زيت حوت", "عظام"] },
        { x: -3000, y: 2000, name: "شاطئ الصدف", icon: "🏖️", cat: "urban", danger: 15, resources: ["صدف", "لؤلؤ"] },
        { x: -4600, y: 2800, name: "قلعة العاصفة الجنوبية", icon: "🏰", cat: "urban", danger: 32, resources: ["فولاذ أسود", "أسلحة"] },
        { x: -2600, y: -800, name: "قرية البحارة القدامى", icon: "🏠", cat: "urban", danger: 18, resources: ["خرائط", "قطران"] },
        { x: -3200, y: -2400, name: "قلعة البحارة المفقودين", icon: "🏚️", cat: "urban", danger: 45, resources: ["خرائط قديمة", "أسرار"] }
      ]
    }
  ] as MapZone[],
  mountains: [
    { x: -4500, y: -4500, name: "سلسلة الجبال الشمالية", icon: "⛰️", height: 5000, width: 1200, color: "#8a8aaa" },
    { x: -2500, y: -4200, name: "جبال الصاعقة", icon: "🏔️", height: 4000, width: 800, color: "#7a7a9a" },
    { x: 4200, y: -3500, name: "جبال الرمال", icon: "⛰️", height: 1500, width: 600, color: "#aa9a6a" },
    { x: 0, y: 0, name: "هضبة المركز", icon: "🗻", height: 800, width: 1600, color: "#4a6a4a" },
    { x: -3000, y: 4200, name: "جبال الأهوار", icon: "⛰️", height: 1200, width: 720, color: "#3a5a4a" },
    { x: -4800, y: -500, name: "جبال الساحل", icon: "⛰️", height: 2000, width: 600, color: "#5a5a7a" }
  ] as MapMountain[],
  roads: [
    // Central Plains Hub Roads
    { name: "طريق الحرير التجاري", points: [{ x: 0, y: -600, name: "المدينة العظيمة" }, { x: 800, y: -400, name: "مدينة النور" }], type: "highway", color: "#8b6914" },
    { name: "طريق القلعة الملكي", points: [{ x: 0, y: -600, name: "المدينة العظيمة" }, { x: -400, y: 200, name: "قلعة الحراس" }], type: "highway", color: "#8b6914" },
    { name: "طريق القوافل العظيم", points: [{ x: -3600, y: -3000, name: "ميناء الصخور" }, { x: 0, y: -600, name: "المدينة العظيمة" }, { x: 3600, y: -3800, name: "واحة الأمل" }], type: "highway", color: "#8b6914" },
    { name: "طريق الذاكرة", points: [{ x: -800, y: -1600, name: "قلعة الذاكرة المفقودة" }, { x: 0, y: -600, name: "المدينة العظيمة" }], type: "highway", color: "#8b6914" },
    { name: "درب الحصاد", points: [{ x: 0, y: -600, name: "المدينة العظيمة" }, { x: 1200, y: 200, name: "قرية المزارعين" }], type: "road", color: "#5a5a2a" },
    { name: "طريق الصناع", points: [{ x: 800, y: -400, name: "مدينة النور" }, { x: 1600, y: -200, name: "مدينة الحرفيين" }], type: "road", color: "#5a5a2a" },
    { name: "طريق الصحراء الشرقي", points: [{ x: 800, y: -400, name: "مدينة النور" }, { x: 2400, y: -600, name: "قلعة الصحراء" }], type: "road", color: "#5a5a2a" },
    { name: "درب الحراسة", points: [{ x: -400, y: 200, name: "قلعة الحراس" }, { x: -1200, y: -400, name: "قلعة الحدود الشمالية" }], type: "road", color: "#5a5a2a" },
    { name: "طريق النهر", points: [{ x: -400, y: 200, name: "قلعة الحراس" }, { x: 400, y: 800, name: "قرية النهر" }], type: "road", color: "#5a5a2a" },
    { name: "طريق الميزة", points: [{ x: -400, y: 200, name: "قلعة الحراس" }, { x: -800, y: 1000, name: "مدينة الميزة" }], type: "road", color: "#5a5a2a" },
    { name: "طريق التجارة الجنوبي", points: [{ x: -800, y: 1000, name: "مدينة الميزة" }, { x: 0, y: 1600, name: "مدينة البُحّارين" }], type: "road", color: "#5a5a2a" },
    { name: "طريق النهر الأزرق", points: [{ x: 0, y: -600, name: "المدينة العظيمة" }, { x: -400, y: -1200, name: "نهر الأزرق" }], type: "road", color: "#5a5a2a" },
    { name: "درب غابة الأشباح", points: [{ x: 0, y: 1600, name: "مدينة البُحّارين" }, { x: 800, y: 1400, name: "غابة الأشباح" }], type: "trail", color: "#6a5a4a" },
    { name: "درب وادي الزهور", points: [{ x: 1200, y: 200, name: "قرية المزارعين" }, { x: 1600, y: 1000, name: "ودي الزهور" }], type: "road", color: "#5a5a2a" },
    { name: "طريق بحيرة المركز", points: [{ x: 1600, y: -200, name: "مدينة الحرفيين" }, { x: 2000, y: 600, name: "قلعة البحيرة" }], type: "road", color: "#5a5a2a" },
    { name: "درب كهف الحكمة", points: [{ x: 2000, y: 600, name: "قلعة البحيرة" }, { x: 2000, y: 1200, name: "كهف الحكمة" }], type: "trail", color: "#6a5a4a" },
    { name: "درب الريح الغربي", points: [{ x: -1200, y: -400, name: "قلعة الحدود الشمالية" }, { x: -1600, y: 0, name: "قرية الريح" }], type: "road", color: "#5a5a2a" },
    { name: "درب مستنقع الأوهام", points: [{ x: -800, y: 1000, name: "مدينة الميزة" }, { x: -1200, y: 1600, name: "مستنقع الأوهام" }], type: "trail", color: "#6a5a4a" },
    { name: "درب بحيرة السكون", points: [{ x: -1600, y: 0, name: "قرية الريح" }, { x: -1600, y: -1200, name: "بحيرة السكون" }], type: "trail", color: "#6a5a4a" },

    // North Highlands Roads
    { name: "طريق قمم الشمال", points: [{ x: -1200, y: -400, name: "قلعة الحدود الشمالية" }, { x: -1200, y: -2800, name: "قلعة العاصفة" }], type: "highway", color: "#8b6914" },
    { name: "طريق معقل الرماد", points: [{ x: -1200, y: -2800, name: "قلعة العاصفة" }, { x: -1200, y: -5000, name: "قلعة الرماد" }], type: "highway", color: "#8b6914" },
    { name: "درب جبل الصاعقة", points: [{ x: -1200, y: -5000, name: "قلعة الرماد" }, { x: -2000, y: -4800, name: "جبل الصاعقة" }], type: "road", color: "#5a5a2a" },
    { name: "طريق الجليد الشاهق", points: [{ x: -2000, y: -4800, name: "جبل الصاعقة" }, { x: -2400, y: -4200, name: "قلعة الجليد الشاهق" }], type: "road", color: "#5a5a2a" },
    { name: "درب الصنوبر المعتم", points: [{ x: -1200, y: -5000, name: "قلعة الرماد" }, { x: -800, y: -4600, name: "غابة الصنوبر المعتمة" }], type: "trail", color: "#6a5a4a" },
    { name: "درب قرية السحاب", points: [{ x: -1200, y: -5000, name: "قلعة الرماد" }, { x: -1600, y: -4400, name: "قرية السحاب" }], type: "road", color: "#5a5a2a" },
    { name: "درب وادي العظام", points: [{ x: -1600, y: -4400, name: "قرية السحاب" }, { x: -1000, y: -3800, name: "ودي العظام" }], type: "trail", color: "#6a5a4a" },
    { name: "طريق الفضة", points: [{ x: -1000, y: -3800, name: "ودي العظام" }, { x: -1800, y: -3600, name: "منجم الفضة الأعمق" }], type: "road", color: "#5a5a2a" },
    { name: "طريق ممر الأفعى", points: [{ x: -2400, y: -4200, name: "قلعة الجليد الشاهق" }, { x: -2600, y: -3800, name: "ممر الأفعى" }], type: "road", color: "#5a5a2a" },
    { name: "طريق النسور", points: [{ x: -2600, y: -3800, name: "ممر الأفعى" }, { x: -2200, y: -3400, name: "قلعة النسور" }], type: "road", color: "#5a5a2a" },
    { name: "درب بحيرة المرآة", points: [{ x: -2200, y: -3400, name: "قلعة النسور" }, { x: -1400, y: -3200, name: "بحيرة المرآة" }], type: "road", color: "#5a5a2a" },
    { name: "درب الشلال الدموي", points: [{ x: -800, y: -4600, name: "غابة الصنوبر المعتمة" }, { x: -600, y: -4200, name: "الشلال الدموي" }], type: "trail", color: "#6a5a4a" },
    { name: "طريق قمة الريح", points: [{ x: -2000, y: -4800, name: "جبل الصاعقة" }, { x: -1600, y: -5200, name: "قمة الريح" }], type: "trail", color: "#6a5a4a" },
    { name: "درب قرية الأشباح", points: [{ x: -1200, y: -2800, name: "قلعة العاصفة" }, { x: -800, y: -3200, name: "قرية الأشباح" }], type: "trail", color: "#6a5a4a" },

    // East Desert Roads
    { name: "طريق واحة الأمل", points: [{ x: 2400, y: -600, name: "قلعة الصحراء" }, { x: 3600, y: -3800, name: "واحة الأمل" }], type: "highway", color: "#8b6914" },
    { name: "طريق القوافل الصغير", points: [{ x: 3600, y: -3800, name: "واحة الأمل" }, { x: 3000, y: -4200, name: "قرية القوافل" }], type: "road", color: "#5a5a2a" },
    { name: "طريق الرمال المتحركة", points: [{ x: 3000, y: -4200, name: "قرية القوافل" }, { x: 3200, y: -3000, name: "قلعة الرمال المتحركة" }], type: "road", color: "#5a5a2a" },
    { name: "طريق سوق القوافل", points: [{ x: 3200, y: -3000, name: "قلعة الرمال المتحركة" }, { x: 2800, y: -3600, name: "سوق القوافل الكبير" }], type: "road", color: "#5a5a2a" },
    { name: "طريق الذهب الأسود", points: [{ x: 3200, y: -3000, name: "قلعة الرمال المتحركة" }, { x: 4600, y: -2200, name: "قصر الذهب الأسود" }], type: "highway", color: "#8b6914" },
    { name: "درب أطلال سارغنا", points: [{ x: 3600, y: -3800, name: "واحة الأمل" }, { x: 4400, y: -2600, name: "أطلال سارغنا" }], type: "road", color: "#5a5a2a" },
    { name: "درب الهاوية السحيقة", points: [{ x: 4600, y: -2200, name: "قصر الذهب الأسود" }, { x: 4000, y: -1800, name: "الهاوية السحيقة" }], type: "trail", color: "#6a5a4a" },
    { name: "طريق قلعة السراب", points: [{ x: 4600, y: -2200, name: "قصر الذهب الأسود" }, { x: 4800, y: -1000, name: "قلعة السراب" }], type: "road", color: "#5a5a2a" },
    { name: "درب قرية الظل", points: [{ x: 4800, y: -1000, name: "قلعة السراب" }, { x: 3800, y: -1200, name: "قرية الظل" }], type: "road", color: "#5a5a2a" },
    { name: "درب السر المخفي", points: [{ x: 4600, y: -2200, name: "قصر الذهب الأسود" }, { x: 5000, y: -1800, name: "واحة السر المخفي" }], type: "trail", color: "#6a5a4a" },
    { name: "درب النخيل المسحور", points: [{ x: 4400, y: -2600, name: "أطلال سارغنا" }, { x: 4400, y: -1400, name: "واحة النخيل المسحورة" }], type: "road", color: "#5a5a2a" },

    // South Wetlands Roads
    { name: "طريق مدخل الأهوار", points: [{ x: 0, y: 1600, name: "مدينة البُحّارين" }, { x: -400, y: 2400, name: "قرية الأكواخ العائمة" }], type: "road", color: "#5a5a2a" },
    { name: "طريق قلعة المستنقع", points: [{ x: -400, y: 2400, name: "قرية الأكواخ العائمة" }, { x: -1200, y: 3600, name: "قلعة المستنقع" }], type: "highway", color: "#8b6914" },
    { name: "درب المتسليحين", points: [{ x: -400, y: 2400, name: "قرية الأكواخ العائمة" }, { x: -800, y: 2800, name: "قرية المتسليحين" }], type: "road", color: "#5a5a2a" },
    { name: "درب الصيادين القدماء", points: [{ x: -400, y: 2400, name: "قرية الأكواخ العائمة" }, { x: 400, y: 2800, name: "قرية الصيادين القدماء" }], type: "road", color: "#5a5a2a" },
    { name: "طريق قلعة الماء", points: [{ x: -1200, y: 3600, name: "قلعة المستنقع" }, { x: 1200, y: 4400, name: "قلعة الماء" }], type: "road", color: "#5a5a2a" },
    { name: "درب بحيرة الدم", points: [{ x: -1200, y: 3600, name: "قلعة المستنقع" }, { x: 800, y: 4000, name: "بحيرة الدم" }], type: "road", color: "#5a5a2a" },
    { name: "درب الشلالات الصاخبة", points: [{ x: -1200, y: 3600, name: "قلعة المستنقع" }, { x: -400, y: 4400, name: "الشلالات الصاخبة" }], type: "road", color: "#5a5a2a" },
    { name: "درب أهوار الرعب", points: [{ x: 400, y: 2800, name: "قرية الصيادين القدماء" }, { x: 400, y: 3200, name: "أهوار الرعب" }], type: "trail", color: "#6a5a4a" },
    { name: "طريق النحل الذهبي", points: [{ x: -1200, y: 3600, name: "قلعة المستنقع" }, { x: 1600, y: 3600, name: "قرية النحل العملاق" }], type: "road", color: "#5a5a2a" },
    { name: "درب واحة البحيرة الساحرة", points: [{ x: 1600, y: 3600, name: "قرية النحل العملاق" }, { x: 1200, y: 3200, name: "واحة البحيرة الساحرة" }], type: "trail", color: "#6a5a4a" },
    { name: "درب الغابة الاستوائية", points: [{ x: -1200, y: 3600, name: "قلعة المستنقع" }, { x: -400, y: 3600, name: "غابة الأشباح الاستوائية" }], type: "trail", color: "#6a5a4a" },

    // West Coast Roads
    { name: "طريق الساحل الغربي الرئيسي", points: [{ x: -3600, y: -3000, name: "ميناء الصخور" }, { x: -4200, y: -1500, name: "قلعة الأمواج" }], type: "highway", color: "#8b6914" },
    { name: "طريق الملح الأزرق", points: [{ x: -4200, y: -1500, name: "قلعة الأمواج" }, { x: -4600, y: -800, name: "قرية الملح الأزرق" }], type: "road", color: "#5a5a2a" },
    { name: "طريق ميناء الريح", points: [{ x: -4600, y: -800, name: "قرية الملح الأزرق" }, { x: -4400, y: 800, name: "ميناء الريح الشمالية" }], type: "highway", color: "#8b6914" },
    { name: "طريق قرية الحوت", points: [{ x: -4400, y: 800, name: "ميناء الريح الشمالية" }, { x: -3600, y: 1200, name: "قرية الحوت" }], type: "road", color: "#5a5a2a" },
    { name: "طريق شاطئ الصدف", points: [{ x: -3600, y: 1200, name: "قرية الحوت" }, { x: -3000, y: 2000, name: "شاطئ الصدف" }], type: "road", color: "#5a5a2a" },
    { name: "طريق العاصفة الجنوبية", points: [{ x: -3000, y: 2000, name: "شاطئ الصدف" }, { x: -4600, y: 2800, name: "قلعة العاصفة الجنوبية" }], type: "highway", color: "#8b6914" },
    { name: "درب البحارة القدامى", points: [{ x: -4200, y: -1500, name: "قلعة الأمواج" }, { x: -2600, y: -800, name: "قرية البحارة القدامى" }], type: "road", color: "#5a5a2a" },
    { name: "درب جزيرة الأسرار", points: [{ x: -3600, y: -3000, name: "ميناء الصخور" }, { x: -3000, y: -1800, name: "جزيرة الأسرار" }], type: "trail", color: "#6a5a4a" },
    { name: "درب البحارة المفقودين", points: [{ x: -3600, y: -3000, name: "ميناء الصخور" }, { x: -3200, y: -2400, name: "قلعة البحارة المفقودين" }], type: "trail", color: "#6a5a4a" }
  ] as MapRoad[]
};

export const INITIAL_KINGDOMS: Kingdom[] = [
  {
    id: "empire",
    name: "إمبراطورية العواصم (العرش الإمبراطوري)",
    capital: "المدينة العظيمة",
    ruler: "الإمبراطور سولون الأول",
    rulerPower: 98,
    general: "سيف بن حرب (قائد الحرس الإمبراطوري)",
    generalPower: 93,
    level: 150,
    pop: 18500000,
    soldiers: 450000,
    economy: 94,
    morale: 92,
    allies: ["kingdom_south", "kingdom_center"],
    enemies: [],
    emblem: "👑",
    color: "#b48c3c",
    powerRank: 1
  },
  {
    id: "kingdom_north",
    name: "مملكة الشمال",
    capital: "قلعة الرماد",
    ruler: "الملك عاصف بن رعد",
    rulerPower: 88,
    general: "ذئب بن عاصفة",
    generalPower: 82,
    level: 150,
    pop: 3800000,
    soldiers: 140000,
    economy: 68,
    morale: 82,
    allies: ["kingdom_center"],
    enemies: ["kingdom_west"],
    emblem: "🐺",
    color: "#7a8a9a",
    powerRank: 4,
    territories: ["north_highlands"]
  },
  {
    id: "kingdom_east",
    name: "مملكة الشرق",
    capital: "قصر الذهب الأسود",
    ruler: "السلطان مالك بن عنتر",
    rulerPower: 85,
    general: "ثعبان بن رمال",
    generalPower: 78,
    level: 150,
    pop: 4500000,
    soldiers: 160000,
    economy: 82,
    morale: 72,
    allies: ["kingdom_west"],
    enemies: ["kingdom_center"],
    emblem: "🐍",
    color: "#c4a032",
    powerRank: 2,
    territories: ["east_desert"]
  },
  {
    id: "kingdom_center",
    name: "مملكة السهول",
    capital: "مدينة النور",
    ruler: "الملكة ضياء بنت نور",
    rulerPower: 80,
    general: "ضياء الفضي",
    generalPower: 72,
    level: 150,
    pop: 5200000,
    soldiers: 130000,
    economy: 88,
    morale: 75,
    allies: ["kingdom_north", "empire"],
    enemies: ["kingdom_east"],
    emblem: "🐎",
    color: "#e8d8a0",
    powerRank: 3,
    territories: ["central_plains"]
  },
  {
    id: "kingdom_south",
    name: "مملكة الأهوار",
    capital: "قلعة المستنقع",
    ruler: "السلطانة ندى بنت ماء",
    rulerPower: 74,
    general: "تمساح بن طين",
    generalPower: 68,
    level: 150,
    pop: 2900000,
    soldiers: 95000,
    economy: 60,
    morale: 68,
    allies: ["empire"],
    enemies: ["kingdom_north"],
    emblem: "🐊",
    color: "#4a6a4a",
    powerRank: 5,
    territories: ["south_wetlands"]
  },
  {
    id: "kingdom_west",
    name: "مملكة الساحل",
    capital: "ميناء الريح الشمالية",
    ruler: "الملك بحر بن يام",
    rulerPower: 82,
    general: "زبد بن بحر",
    generalPower: 70,
    level: 150,
    pop: 4100000,
    soldiers: 120000,
    economy: 90,
    morale: 70,
    allies: ["kingdom_east"],
    enemies: ["kingdom_north"],
    emblem: "🌊",
    color: "#2a7a9b",
    powerRank: 3,
    territories: ["west_coast"]
  }
];

export const INITIAL_FACTIONS: Record<string, Faction> = {
  // North
  "f_north_1": {
    id: "f_north_1",
    name: "طائفة رماد المعارك",
    type: "طائفة مرويم قتالية",
    lordName: "لورد الصخر الأسود",
    lordLevel: 135,
    members: 2300,
    alignment: "محايد",
    emblem: "🛡️",
    zone: "المرتفعات الشمالية",
    landmark: "قلعة الرماد",
    power: 75,
    status: "active",
    allies: ["f_north_7"],
    enemies: ["f_north_6"],
    description: "طائفة عريقة تعتمد على قساوة الحديد والحجر البركاني لصقل أجساد التلاميذ ضد أقسى الظروف.",
    minJoinLevel: 2,
    joinRequirements: "مستوى 2 فما فوق · عدم الانتماء لطائفة معادية · اجتياز اختبار تحطيم صخور البازلت",
    trialDesc: "اختبار ضربات الصخر: الصمود لدقيقتين أمام تلاميذ الطائفة بسيف خشبي وتحطيم لوح صخري.",
    exclusivePerk: "جسد البازلت (+15% صلابة دروع، مقاومة الصدمات)",
    ranks: [
      { name: "تلميذ خارجي", minLevel: 2, perks: "رداء الرماد، سيف بركاني ممرن، +5% هجوم" },
      { name: "تلميذ داخلي", minLevel: 7, perks: "تقنية الدرع الناري، وصول لورشة الصهر، +12% دفاع" },
      { name: "تلميذ النخبة", minLevel: 16, perks: "سلاح بركاني مصهور، +22% صحة ومتانة" },
      { name: "شيخ الطائفة", minLevel: 30, perks: "قيادة حامية القلعة والوصول لمخازن الفولاذ الأسود" }
    ]
  },
  "f_north_2": {
    id: "f_north_2",
    name: "حامية حرس السحاب",
    type: "حامية نظامية",
    lordName: "حارس الغيوم",
    lordLevel: 132,
    members: 1200,
    alignment: "صالح",
    emblem: "☁️",
    zone: "المرتفعات الشمالية",
    landmark: "قرية السحاب",
    power: 60,
    status: "active",
    allies: ["f_north_5"],
    enemies: [],
    description: "حماة الممرات الجبلية والقرى العالية ضد الوحوش وقطاع الطرق.",
    minJoinLevel: 3,
    joinRequirements: "سمعة صالحة ومحايدة · مستوى 3+ · الولاء لأمن الجبال",
    trialDesc: "اختبار الرصد: تعقب أثر وحش جبلي عبر المنحدرات الجليدية في عاصفة ثلجية.",
    exclusivePerk: "خطوات السحاب (+10% سرعة سفر جبلي ومقاومة الانزلاق)",
    ranks: [
      { name: "تلميذ خارجي", minLevel: 3, perks: "كساء الصوف المعزز، قوس الحراسة، +6% رماية" },
      { name: "تلميذ داخلي", minLevel: 8, perks: "سهم الرياح القاطع، +14% رصد وتفادي" },
      { name: "تلميذ النخبة", minLevel: 18, perks: "حرس القمم، +25% طاقة تركيز ذهني" },
      { name: "شيخ الطائفة", minLevel: 32, perks: "إمرة أبراج المراقبة الشمالية" }
    ]
  },
  "f_north_3": {
    id: "f_north_3",
    name: "طائفة السيوف الجليدية",
    type: "طائفة سيف أرثوذكسية",
    lordName: "سيف الجليد العتيق",
    lordLevel: 138,
    members: 1800,
    alignment: "محايد",
    emblem: "❄️",
    zone: "المرتفعات الشمالية",
    landmark: "قلعة الجليد الشاهق",
    power: 78,
    status: "active",
    allies: ["f_north_1"],
    enemies: [],
    description: "مدرسة فنون سيف قاطعة تركز على التجميد الحركي والسرعة الخاطفة على المنحدرات.",
    minJoinLevel: 4,
    joinRequirements: "مستوى 4+ · سيف صالح · اجتياز اختبار الشلال المتجمد",
    trialDesc: "اختبار الشلال: التأمل تحت مياه الشلال الجليدية وقطع كتلة جليد بضربة سيف واحدة.",
    exclusivePerk: "طعنة الصقيع (+18% ضرر حرج بالسيوف وسرعة هجوم خفية)",
    ranks: [
      { name: "تلميذ خارجي", minLevel: 4, perks: "سيف الجليد المبدئي، خفة حركة +8%" },
      { name: "تلميذ داخلي", minLevel: 10, perks: "سيف الفولاذ البارد، تقنية تجميد الخصم، +16% ضرر" },
      { name: "تلميذ النخبة", minLevel: 20, perks: "فن الصقيع الأبدي، +30% سرعة هجوم ومناورة" },
      { name: "شيخ الطائفة", minLevel: 35, perks: "حمل سيف الجليد الأسطوري وإدارة قاعة الشيوخ" }
    ]
  },
  "f_north_5": {
    id: "f_north_5",
    name: "نخبة صقور الجبل",
    type: "فصيل استطلاع جوي",
    lordName: "سيد النسور",
    lordLevel: 137,
    members: 1600,
    alignment: "صالح",
    emblem: "🦅",
    zone: "المرتفعات الشمالية",
    landmark: "قلعة النسور",
    power: 72,
    status: "active",
    allies: ["f_north_2"],
    enemies: ["f_north_6"],
    description: "فرسان يروضون نسور القمم الجبلية العملاقة، يمتلكون بصراً حاداً ومناورات لا مثيل لها.",
    minJoinLevel: 3,
    joinRequirements: "مستوى 3+ · هدوء أعصاب وعدم الخوف من المرتفعات الشاهقة",
    trialDesc: "اختبار ترويض فرخ الصقر الجبلي من حافة هاوية شاهقة.",
    exclusivePerk: "عين الصقر (+15% دقة إصابة وكشف الأعداء المتسللين)",
    ranks: [
      { name: "تلميذ خارجي", minLevel: 3, perks: "ريشة النسور للرماية، تفادي +6%" },
      { name: "تلميذ داخلي", minLevel: 9, perks: "نسر مساعد، سرعة سفر +25%" },
      { name: "تلميذ النخبة", minLevel: 19, perks: "فارس النسور المجنح، هجوم جوي +25%" },
      { name: "شيخ الطائفة", minLevel: 34, perks: "قيادة سرب النسور الملكي" }
    ]
  },
  "f_north_6": {
    id: "f_north_6",
    name: "طائفة الظلال الحمراء",
    type: "طائفة اغتيال محرمة",
    lordName: "شبح القمر",
    lordLevel: 134,
    members: 1100,
    alignment: "شرير",
    emblem: "👁️",
    zone: "المرتفعات الشمالية",
    landmark: "قرية الأشباح",
    power: 58,
    status: "active",
    allies: [],
    enemies: ["f_north_1", "f_north_5"],
    description: "طائفة تعمل في الخفاء، تغتال في جنح الليل وتستعمل سموم الأفاعي النادرة.",
    minJoinLevel: 4,
    joinRequirements: "مستوى 4+ · استعداد لتنفيذ مهام قاسية دون تردد · قسم كتمان الأسرار",
    trialDesc: "اختبار خطوة الظل: التسلل عبر ممر تحرسه الذئاب دون إصدار أي صوت وقتل دمية مراقبة.",
    exclusivePerk: "طعنة الغدر المسمومة (+25% ضرر من الخلف، تلطيخ السلاح بالسم)",
    ranks: [
      { name: "تلميذ خارجي", minLevel: 4, perks: "خنجر الظل، رداء الشبح الأسود، خفاء +10%" },
      { name: "تلميذ داخلي", minLevel: 10, perks: "سم الدماء القاتل، تفادي مميت +18%" },
      { name: "تلميذ النخبة", minLevel: 20, perks: "خطوة القمر الدموي، اختفاء فوري بالجولات الحرجة" },
      { name: "شيخ الطائفة", minLevel: 35, perks: "سيد شبكة الاغتيال وقبض الأثمان" }
    ]
  },
  "f_north_7": {
    id: "f_north_7",
    name: "حامية العاصفة الحديدية",
    type: "حامية دروع ثقيلة",
    lordName: "حارس العاصفة",
    lordLevel: 136,
    members: 2000,
    alignment: "محايد",
    emblem: "⚡",
    zone: "المرتفعات الشمالية",
    landmark: "قلعة العاصفة",
    power: 70,
    status: "active",
    allies: ["f_north_1"],
    enemies: [],
    description: "فرسان مدرعون بأثقل صفائح الفولاذ، يقفون في قلب العواصف دون أن يتزحزحوا.",
    minJoinLevel: 3,
    joinRequirements: "قوة جسدية 10+ · مستوى 3+ · تحمل ضربات المطارق",
    trialDesc: "اختبار الصدمة: حمل درع فولاذي وزنه 40 كغم والصمود أمام 10 ضربات بمطرقة ثقيلة.",
    exclusivePerk: "الجدار الحديدي (+20% دفاع ضد ضربات الأسهم والسيوف)",
    ranks: [
      { name: "تلميذ خارجي", minLevel: 3, perks: "درع الحديد الصلب، متانة +8%" },
      { name: "تلميذ داخلي", minLevel: 9, perks: "مطرقة العواصف، صد هائل +18%" },
      { name: "تلميذ النخبة", minLevel: 18, perks: "صفائح الفولاذ غير القابل للكسر، صحة +30" },
      { name: "شيخ الطائفة", minLevel: 32, perks: "رئيس حراس بوابات الشمال" }
    ]
  },

  // East
  "f_east_1": {
    id: "f_east_1",
    name: "حامية واحة الأمان",
    type: "حامية حراسة قوافل",
    lordName: "حارس الواحة",
    lordLevel: 133,
    members: 1400,
    alignment: "صالح",
    emblem: "🌴",
    zone: "الصحراء الشرقية",
    landmark: "واحة الأمل",
    power: 65,
    status: "active",
    allies: ["f_east_8"],
    enemies: ["f_east_4"],
    description: "حماة تجار الحرير ومياه الواحات في الصحراء العاتية، يعتمدون على المناوشات السريعة.",
    minJoinLevel: 2,
    joinRequirements: "مستوى 2+ · سمعة جيدة لدى التجار · مهارة التوجيه بالنجوم",
    trialDesc: "اختبار المسير الليلي: قيادة جمل محمل بالمياه لمسافة 50 كم ليلاً بالاعتماد على النجوم فقط.",
    exclusivePerk: "حارس الرمال (توفير 50% من استهلاك الماء والمؤن أثناء السفر)",
    ranks: [
      { name: "تلميذ خارجي", minLevel: 2, perks: "سيف مقوس خفيف، عباءة صحراوية، تحمل عطش +15%" },
      { name: "تلميذ داخلي", minLevel: 8, perks: "رمح الواحة، معرفة منابع المياه الخفية" },
      { name: "تلميذ النخبة", minLevel: 17, perks: "قائد حرس القوافل، خصم 30% على كل التبادلات التجارية" },
      { name: "شيخ الطائفة", minLevel: 30, perks: "إدارة أسواق الواحة الكبرى" }
    ]
  },
  "f_east_2": {
    id: "f_east_2",
    name: "طائفة الرمال السوداء",
    type: "طائفة مرويم صحراوية",
    lordName: "لورد الرمال",
    lordLevel: 139,
    members: 1700,
    alignment: "محايد",
    emblem: "🏜️",
    zone: "الصحراء الشرقية",
    landmark: "قلعة الرمال المتحركة",
    power: 77,
    status: "active",
    allies: ["f_east_6"],
    enemies: ["f_east_4"],
    description: "يتقنون فنون الانسياب كالرمال وتوجيه الضربات الملتوية التي تعمي الأعين وتكسر السيوف.",
    minJoinLevel: 3,
    joinRequirements: "مستوى 3+ · مرونة وسرعة بديهة · اجتياز فحص الرمال المتحركة",
    trialDesc: "اختبار الرمال الغارقة: النجاة من حفرة رمال متحركة خلال 3 دقائق دون استخدام حبال.",
    exclusivePerk: "إعصار الغبار (فرصة 25% لإعماء الخصم وخفض دقته للنصف)",
    ranks: [
      { name: "تلميذ خارجي", minLevel: 3, perks: "سيف خفيف منحني، تفادي رملي +8%" },
      { name: "تلميذ داخلي", minLevel: 9, perks: "تقنية إخفاء القدمين بالرمال، +16% هجوم" },
      { name: "تلميذ النخبة", minLevel: 19, perks: "فن تحريك الرمال، درع الحبيبات الكريستالية" },
      { name: "شيخ الطائفة", minLevel: 34, perks: "سيد قلعة الرمال ومجلس مشايخ الشرق" }
    ]
  },
  "f_east_4": {
    id: "f_east_4",
    name: "طائفة السراب القاتل",
    type: "طائفة فنون وهم وخداع",
    lordName: "سيدة السراب",
    lordLevel: 138,
    members: 1500,
    alignment: "شرير",
    emblem: "✨",
    zone: "الصحراء الشرقية",
    landmark: "قلعة السراب",
    power: 70,
    status: "active",
    allies: [],
    enemies: ["f_east_2"],
    description: "طائفة غامضة توظف انعكاسات ضوء الشمس والسراب لإيهام الأعداء وتطويقهم في القفار.",
    minJoinLevel: 4,
    joinRequirements: "مستوى 4+ · قدرة تركيز ذهني 10+ · إثبات خديعة ناجحة",
    trialDesc: "اختبار السراب: المشي وسط 5 مرايا وهمية والتعرف على الممر الحقيقي.",
    exclusivePerk: "صورة السراب (تفادي أول هجوم في كل معركة تلقائياً 100%)",
    ranks: [
      { name: "تلميذ خارجي", minLevel: 4, perks: "خناجر السراب المزدوجة، مراوغة +10%" },
      { name: "تلميذ داخلي", minLevel: 10, perks: "استنساخ الظل الوهمي، إرباك الخصم" },
      { name: "تلميذ النخبة", minLevel: 20, perks: "متاهة الأوهام، شلل مؤقت للعدو" },
      { name: "شيخ الطائفة", minLevel: 35, perks: "سيدة قصر الأوهام وسر الأبواب الستة" }
    ]
  },
  "f_east_6": {
    id: "f_east_6",
    name: "فصيل النخبة الذهبية",
    type: "حرس السلطان الخاص",
    lordName: "سيد القصر الأسود",
    lordLevel: 142,
    members: 2800,
    alignment: "محايد",
    emblem: "👑",
    zone: "الصحراء الشرقية",
    landmark: "قصر الذهب الأسود",
    power: 88,
    status: "active",
    allies: ["f_east_2"],
    enemies: [],
    description: "أقوى فيالق الشرق المقاتلة، مدججون بأسلحة مذهبة وفولاذ دمشقي لا يصدأ.",
    minJoinLevel: 6,
    joinRequirements: "مستوى 6+ · سيرة قتالية لا شائبة فيها · دفع رسوم ذهبية للتسليح",
    trialDesc: "نزال 3 من حرس القصر بالسيوف الحية دون خسارة أكثر من 20% صحة.",
    exclusivePerk: "السيف المذهب (+20% ضرر مالي وحصول على ذهب مضاعف من الغنائم)",
    ranks: [
      { name: "تلميذ خارجي", minLevel: 6, perks: "سيف دمشقي مذهب، درع حريري، +10% ضرر" },
      { name: "تلميذ داخلي", minLevel: 12, perks: "حرس خاص للقوافل السلطانية، +20% دفاع" },
      { name: "تلميذ النخبة", minLevel: 22, perks: "فارس الذهب الأسود، راتب شهري 10 ذهب" },
      { name: "شيخ الطائفة", minLevel: 38, perks: "قائد الحرس السلطاني الشرقي" }
    ]
  },
  "f_east_8": {
    id: "f_east_8",
    name: "طائفة رعاة القوافل",
    type: "رابطة أدلاء وسفر",
    lordName: "حارس القوافل",
    lordLevel: 131,
    members: 1300,
    alignment: "صالح",
    emblem: "🐪",
    zone: "الصحراء الشرقية",
    landmark: "قرية القوافل",
    power: 55,
    status: "active",
    allies: ["f_east_1"],
    enemies: [],
    description: "خبراء الصحراء الأكثر صبراً، يعرفون خبايا الدروب ويحمون العابرين من الهلاك.",
    minJoinLevel: 2,
    joinRequirements: "مستوى 2+ · حسن المعاملة مع الحيوانات · أمانة في نقل البضائع",
    trialDesc: "اختبار الإسعاف وحفظ المؤن في مسير 48 ساعة دون استراحة.",
    exclusivePerk: "دليل القفار (سرعة السفر في الصحراء أسرع بيوم كامل مجاناً)",
    ranks: [
      { name: "تلميذ خارجي", minLevel: 2, perks: "عصا الدليل، حزام خزن مياه، وزن حمل +15 كغم" },
      { name: "تلميذ داخلي", minLevel: 7, perks: "جمل أصيل للسفر السريع، مناعة ضربات الشمس" },
      { name: "تلميذ النخبة", minLevel: 16, perks: "كبير الأدلاء، خريطة المسالك السرية" },
      { name: "شيخ الطائفة", minLevel: 30, perks: "إشراف على كل قوافل الحرير الصحراوية" }
    ]
  },

  // Central
  "f_central_1": {
    id: "f_central_1",
    name: "فرسان العرش الإمبراطوري",
    type: "فيلق النخبة الإمبراطوري",
    lordName: "سيف بن حرب (قائد العرش)",
    lordLevel: 148,
    members: 4000,
    alignment: "صالح",
    emblem: "👑",
    zone: "السهول الوسطى",
    landmark: "المدينة العظيمة",
    power: 98,
    status: "active",
    allies: ["f_central_4"],
    enemies: ["f_central_2"],
    description: "أعلى مرتبة عسكرية في القارة بأسرها؛ حرس الإمبراطور المباشر، لا يقبلون سوى الأكفاء الصناديد.",
    minJoinLevel: 8,
    joinRequirements: "مستوى 8+ · لا سوابق إجرامية · اجتياز اختبار الساحة الإمبراطورية الكبرى",
    trialDesc: "اختبار الساحة الإمبراطورية: مبارزة فارس إمبراطوري والصمود لـ 5 جولات كاملة.",
    exclusivePerk: "هيبة العرش (+25% قوة ضربات، مناعة كاملة ضد الخوف والارتباك)",
    ranks: [
      { name: "تلميذ خارجي", minLevel: 8, perks: "سيف الإمبراطورية الفضي، درع الحرس، هجوم +15%" },
      { name: "تلميذ داخلي", minLevel: 15, perks: "فارس إمبراطوري رسمي، حصان ملكي، دفاع +25%" },
      { name: "تلميذ النخبة", minLevel: 25, perks: "قائد كتيبة، أمرة 100 جندي، هجوم +35%" },
      { name: "شيخ الطائفة", minLevel: 45, perks: "حارس شخصي للإمبراطور ومستشار الحرب الأعلى" }
    ]
  },
  "f_central_2": {
    id: "f_central_2",
    name: "طائفة السيوف السوداء",
    type: "طائفة مرويم قتالية حرة",
    lordName: "سيد السيوف المجهول",
    lordLevel: 145,
    members: 3500,
    alignment: "محايد",
    emblem: "🗡️",
    zone: "السهول الوسطى",
    landmark: "المدينة العظيمة",
    power: 92,
    status: "active",
    allies: [],
    enemies: ["f_central_1"],
    description: "مدرسة مرويم مستقلة ترفض الخضوع للملوك، تؤمن بأن السيف وحده هو السيد والحكم في هذه التربة.",
    minJoinLevel: 5,
    joinRequirements: "مستوى 5+ · شغف مطلق بفن السيف · رفض الخنوع لسلطة الحكام",
    trialDesc: "اختبار كسر السيف: مبارزة تلميذ بالسيوف الصامتة وإسقاط سلاحه دون إصابة جسده.",
    exclusivePerk: "سيف الموت الأسود (+22% هجوم عند القتال بمفردك دون دروع ثقيلة)",
    ranks: [
      { name: "تلميذ خارجي", minLevel: 5, perks: "سيف أسود حاد، سرعة ضرب +10%" },
      { name: "تلميذ داخلي", minLevel: 12, perks: "فنون سيف الموت، اختراق الدروع +20%" },
      { name: "تلميذ النخبة", minLevel: 22, perks: "السيف غير المرئي، ضربات حرجة +35%" },
      { name: "شيخ الطائفة", minLevel: 40, perks: "سيد قاعة المبارزات الخمس" }
    ]
  },
  "f_central_4": {
    id: "f_central_4",
    name: "طائفة علماء الحرب",
    type: "أكاديمية تكتيك وفلك",
    lordName: "عين النور الحكيم",
    lordLevel: 140,
    members: 2200,
    alignment: "صالح",
    emblem: "🔭",
    zone: "السهول الوسطى",
    landmark: "مدينة النور",
    power: 80,
    status: "active",
    allies: ["f_central_1"],
    enemies: [],
    description: "يدرسون نقاط ضعف الخصوم وتشريح الجسد والآثار القديمة لتحقيق النصر بأقل مجهود.",
    minJoinLevel: 3,
    joinRequirements: "مستوى 3+ · ذكاء وتركيز ذهني 10+ · اجتياز اختبار ألواح الحكمة",
    trialDesc: "اختبار حل معضلة حصار تكتيكي في نموذج شطرنج حربي مصغر.",
    exclusivePerk: "تشريح الخصم (كشف نقاط ضعف أي عدو وإحداث +30% ضرر مركز)",
    ranks: [
      { name: "تلميذ خارجي", minLevel: 3, perks: "مخطوطة التكتيك، تركيز ذهني +12" },
      { name: "تلميذ داخلي", minLevel: 9, perks: "منظار المعارك، قراءة نوايا العدو بالجولة القادمة" },
      { name: "تلميذ النخبة", minLevel: 18, perks: "مستشار استراتيجي، مضاعفة نقاط الخبرة XP" },
      { name: "شيخ الطائفة", minLevel: 35, perks: "عميد مكتبة علوم القارة المفقودة" }
    ]
  },
  "f_central_8": {
    id: "f_central_8",
    name: "طائفة حدادو الموت",
    type: "طائفة صناعة أسلحة ودروع",
    lordName: "سيد المطرقة الجلمود",
    lordLevel: 142,
    members: 2400,
    alignment: "محايد",
    emblem: "🔨",
    zone: "السهول الوسطى",
    landmark: "مدينة الحرفيين",
    power: 85,
    status: "active",
    allies: [],
    enemies: [],
    description: "أعظم صاغة ومصنعي الفولاذ والعتاد في العالم؛ كل سيف أسطوري خرج من أفرانهم.",
    minJoinLevel: 2,
    joinRequirements: "مستوى 2+ · قوة 9+ · تحمل حرارة الأفران الشديدة",
    trialDesc: "اختبار صهر حديد غامض وصقل نصل حديدي متوازن خلال ساعتين.",
    exclusivePerk: "سيد الصياغة (إمكانية ترقية الأسلحة والدروع ومضاعفة متانتها)",
    ranks: [
      { name: "تلميذ خارجي", minLevel: 2, perks: "مطرقة الصقل، مريلة الحداد المقاومة للحرق" },
      { name: "تلميذ داخلي", minLevel: 8, perks: "نصل مدمج بالفولاذ النقي، +15% قوة سلاح" },
      { name: "تلميذ النخبة", minLevel: 17, perks: "صانع أسلحة ملحمية، تخفيض وزن العتاد 40%" },
      { name: "شيخ الطائفة", minLevel: 35, perks: "سيد الكور الأكبر ومعدن النيازك" }
    ]
  },

  // South
  "f_south_1": {
    id: "f_south_1",
    name: "طائفة التسلل المستنقعي",
    type: "طائفة كمائن مائية",
    lordName: "ظل المستنقع",
    lordLevel: 133,
    members: 1300,
    alignment: "شرير",
    emblem: "🌿",
    zone: "الأراضي الرطبة الجنوبية",
    landmark: "قرية المتسليحين",
    power: 62,
    status: "active",
    allies: [],
    enemies: ["f_south_2"],
    description: "صائدو كمائن يختبئون تحت سطح الطين والماء لشهور متواصلة، يضربون بالسموم القاتلة.",
    minJoinLevel: 3,
    joinRequirements: "مستوى 3+ · تحمل الغوص في المياه الموحلة والمناعة الجزئية ضد السموم",
    trialDesc: "الغوص تحت الماء لمدة 4 دقائق والتنفس عبر قصبة مجوفة ومباغتة دمية حراسة.",
    exclusivePerk: "كمين الطين (+30% ضرر بالضربة الأولى، تسميم دائم للخصم)",
    ranks: [
      { name: "تلميذ خارجي", minLevel: 3, perks: "خنجر العظم المسموم، تمويه طيني" },
      { name: "تلميذ داخلي", minLevel: 9, perks: "قوس السهام السامة، مقاومة السموم 50%" },
      { name: "تلميذ النخبة", minLevel: 18, perks: "ظل الأهوار، اختفاء كامل في البيئات الرطبة" },
      { name: "شيخ الطائفة", minLevel: 33, perks: "سيد حوض الأفاعي المائية" }
    ]
  },
  "f_south_2": {
    id: "f_south_2",
    name: "حامية وحوش المستنقع",
    type: "حامية دفاعية مروضة",
    lordName: "حارس القلعة المستنقعية",
    lordLevel: 136,
    members: 1700,
    alignment: "محايد",
    emblem: "🐊",
    zone: "الأراضي الرطبة الجنوبية",
    landmark: "قلعة المستنقع",
    power: 74,
    status: "active",
    allies: ["f_south_5"],
    enemies: ["f_south_1"],
    description: "حماة قنوات الأهوار، يروضون التماسيح والزواحف الضخمة لنقل الجنود وخوض المعارك الموحلة.",
    minJoinLevel: 3,
    joinRequirements: "مستوى 3+ · شجاعة في مواجهة الوحوش الزاحفة · مهارات التجديف",
    trialDesc: "ترويض تمساح مستنقع ضخم وجره إلى الشاطئ دون التسبب في مقتله.",
    exclusivePerk: "جلد التمساح (+18% مقاومة الجروح السطحية والنزيف)",
    ranks: [
      { name: "تلميذ خارجي", minLevel: 3, perks: "درع جلد التمساح، رمح الصيد المائي" },
      { name: "تلميذ داخلي", minLevel: 9, perks: "تمساح ركوب مستنقعي، سرعة سباحة +40%" },
      { name: "تلميذ النخبة", minLevel: 19, perks: "سيد الوحوش الزاحفة، حماية جماعية +20%" },
      { name: "شيخ الطائفة", minLevel: 34, perks: "قائد أسطول زوارق الأهوار المنيعة" }
    ]
  },
  "f_south_3": {
    id: "f_south_3",
    name: "حامية لسعات النحل",
    type: "طائفة مربي النحل العملاق",
    lordName: "ملكة النحل الحارسة",
    lordLevel: 132,
    members: 1100,
    alignment: "صالح",
    emblem: "🐝",
    zone: "الأراضي الرطبة الجنوبية",
    landmark: "قرية النحل العملاق",
    power: 58,
    status: "active",
    allies: [],
    enemies: [],
    description: "ينتجون العسل الذهبي الشافي، ويوظفون النحل العملاق في الدفاع عن أراضيهم.",
    minJoinLevel: 2,
    joinRequirements: "مستوى 2+ · روح نباتية وطبية · عدم إيذاء خلايا النحل",
    trialDesc: "استخراج العسل الملكي من خلية نحل عملاقة يبلغ حجمها حجم بيت صغير دون التعرض للدغ.",
    exclusivePerk: "العسل الملكي (استعادة 30 صحة يومياً مجاناً، علاج كامل للإجهاد)",
    ranks: [
      { name: "تلميذ خارجي", minLevel: 2, perks: "جرار عسل علاجي، عباءة من الكتان المعالج" },
      { name: "تلميذ داخلي", minLevel: 8, perks: "سرب نحل دفاعي صغير يربك الأعداء، علاج +25%" },
      { name: "تلميذ النخبة", minLevel: 17, perks: "عسل القيامة، إنعاش تلقائي عند وصول الصحة للصفر" },
      { name: "شيخ الطائفة", minLevel: 30, perks: "وصي خلايا الشمع الذهبي الأبدي" }
    ]
  },
  "f_south_5": {
    id: "f_south_5",
    name: "طائفة فرسان الماء",
    type: "طائفة تحكم سائل ومرويم",
    lordName: "سيد الماء الصافي",
    lordLevel: 139,
    members: 1900,
    alignment: "محايد",
    emblem: "💧",
    zone: "الأراضي الرطبة الجنوبية",
    landmark: "قلعة الماء",
    power: 76,
    status: "active",
    allies: ["f_south_2"],
    enemies: [],
    description: "يستمدون طاقتهم من تدفق الشلالات والأمواج، وتتميز ضرباتهم بالسلاسة التي لا تصد.",
    minJoinLevel: 3,
    joinRequirements: "مستوى 3+ · هدوء تام كصفحة الماء · اجتياز اختبار الشلال الصامت",
    trialDesc: "إيقاف تدفق جدول مائي صغير بالسيف الخشبي لثوان معدودة.",
    exclusivePerk: "انسياب الماء (تحويل 20% من ضرر العدو المتلقى إلى طاقة متانة AP)",
    ranks: [
      { name: "تلميذ خارجي", minLevel: 3, perks: "سيف السيولة المرن، تفادي مائي +8%" },
      { name: "تلميذ داخلي", minLevel: 9, perks: "ضربة الأمواج المتتالية، +16% استعادة متانة" },
      { name: "تلميذ النخبة", minLevel: 19, perks: "درع الفقاعة المائية، امتصاص 50 ضرر" },
      { name: "شيخ الطائفة", minLevel: 35, perks: "سيد بحيرات الجنوب الكبرى" }
    ]
  },

  // West
  "f_west_1": {
    id: "f_west_1",
    name: "حامية صخور الساحل",
    type: "حامية موانئ ومضائق",
    lordName: "حارس الميناء العتيد",
    lordLevel: 133,
    members: 1400,
    alignment: "صالح",
    emblem: "⚓",
    zone: "الساحل الغربي",
    landmark: "ميناء الصخور",
    power: 65,
    status: "active",
    allies: ["f_west_4"],
    enemies: [],
    description: "رجال الموانئ الصلبين، يحرسون المنارات ويصدون القراصنة بعربات مقذوفات الملح.",
    minJoinLevel: 2,
    joinRequirements: "مستوى 2+ · أمانة بحرية · قوة في ربط الصواري والقتال الضيق",
    trialDesc: "رفع مرساة سفينة حربية تزن 120 كغم بمفردك على رصيف الميناء.",
    exclusivePerk: "المرساة الحصينة (مناعة كاملة ضد الإطاحة أو التراجع في القتال)",
    ranks: [
      { name: "تلميذ خارجي", minLevel: 2, perks: "فأس الميناء، خطاف السحب، استقرار +10%" },
      { name: "تلميذ داخلي", minLevel: 8, perks: "قوس بارود الملح، ضربات محطمة للدروع" },
      { name: "تلميذ النخبة", minLevel: 17, perks: "ربان بارجة صخرية، +25% دفاع بحري" },
      { name: "شيخ الطائفة", minLevel: 31, perks: "ناظر منارات الساحل الغربي" }
    ]
  },
  "f_west_2": {
    id: "f_west_2",
    name: "طائفة أمواج المحيط",
    type: "طائفة مرويم بحرية",
    lordName: "سيدة الأمواج الغاضبة",
    lordLevel: 137,
    members: 1800,
    alignment: "محايد",
    emblem: "🌊",
    zone: "الساحل الغربي",
    landmark: "قلعة الأمواج",
    power: 74,
    status: "active",
    allies: ["f_west_8"],
    enemies: [],
    description: "يقاتلون كأمواج العاصفة التي تضرب الشواطئ بلا هوادة، يفضلون السيوف المنحنية الثلاثية.",
    minJoinLevel: 3,
    joinRequirements: "مستوى 3+ · ثبات جسدي على متن السفن المترنحة وسط الأمواج العاتية",
    trialDesc: "المبارزة على لوح خشبي يطفو فوق أمواج صخرية متلاطمة لمدة 5 دقائق دون السقوط.",
    exclusivePerk: "المد الجارف (كل ضربة متتالية تزيد الضرر بنسبة 10% تراكمياً)",
    ranks: [
      { name: "تلميذ خارجي", minLevel: 3, perks: "سيف المد البحري، توازن ممتاز +8%" },
      { name: "تلميذ داخلي", minLevel: 9, perks: "رمح تيار المحيط، ضربات مائية ثلاثية" },
      { name: "تلميذ النخبة", minLevel: 19, perks: "فن تسونامي القاطع، ضربات حرجة +25%" },
      { name: "شيخ الطائفة", minLevel: 35, perks: "سيدة قلعة الأمواج العاتية" }
    ]
  },
  "f_west_4": {
    id: "f_west_4",
    name: "طائفة رياح الشمال البحرية",
    type: "طائفة مرويم الأشرعة",
    lordName: "قبطان الريح الغاضب",
    lordLevel: 140,
    members: 2200,
    alignment: "محايد",
    emblem: "⛵",
    zone: "الساحل الغربي",
    landmark: "ميناء الريح الشمالية",
    power: 82,
    status: "active",
    allies: ["f_west_1"],
    enemies: [],
    description: "أكبر أساطيل الغرب، ملاحون مقاتلون يطوعون الرياح لصالح سفنهم وسهامهم.",
    minJoinLevel: 3,
    joinRequirements: "مستوى 3+ · مهارة قيادة الدفة · قراءة اتجاه الرياح بدقة",
    trialDesc: "إطلاق 3 سهام وإصابة الهدف وهو يتحرك في عرض البحر وسط رياح هوجاء.",
    exclusivePerk: "ريح الأشرعة (السفر البحري مجاني وسريع بنسبة 100%، رماية بعيدة المدى)",
    ranks: [
      { name: "تلميذ خارجي", minLevel: 3, perks: "سيف البحار الخفيف، قوس الريح، دقة +10%" },
      { name: "تلميذ داخلي", minLevel: 9, perks: "سفينة شراعية سريعة للاستخدام الحر" },
      { name: "تلميذ النخبة", minLevel: 18, perks: "أميرال بحري، إمرة سفينة حربية كاملة" },
      { name: "شيخ الطائفة", minLevel: 35, perks: "قائد أسطول الشمال البحري" }
    ]
  },
  "f_west_8": {
    id: "f_west_8",
    name: "طائفة عاصفة الجنوب",
    type: "طائفة فنون صواعق بحرية",
    lordName: "سيد العاصفة والبرق",
    lordLevel: 138,
    members: 2000,
    alignment: "محايد",
    emblem: "🌪️",
    zone: "الساحل الغربي",
    landmark: "قلعة العاصفة الجنوبية",
    power: 78,
    status: "active",
    allies: ["f_west_2"],
    enemies: [],
    description: "يستغلون كهرباء الغيوم وعواصف الساحل الجنوبي لدمج البرق بأنصالهم.",
    minJoinLevel: 4,
    joinRequirements: "مستوى 4+ · شجاعة في قمم المنارات أثناء الصواعق · متانة جسدية عالية",
    trialDesc: "لمس قضيب صواعق نحاسي فور تعرضه لشرارة كهربائية من عاصفة بحرية دون الانهيار.",
    exclusivePerk: "نصل البرق (فرصة 20% لشل حركة العدو بصدمة كهربائية لمدة جولة)",
    ranks: [
      { name: "تلميذ خارجي", minLevel: 4, perks: "سيف النحاس المشحون، سرعة +8%" },
      { name: "تلميذ داخلي", minLevel: 10, perks: "شرارة الصاعقة الزرقاء، ضرر إضافي +18%" },
      { name: "تلميذ النخبة", minLevel: 20, perks: "فن إعصار البرق الشامل، هجوم متعدد على الأعداء" },
      { name: "شيخ الطائفة", minLevel: 36, perks: "سيد قلعة العاصفة الجنوبية" }
    ]
  },
  "f_west_10": {
    id: "f_west_10",
    name: "طائفة القراصنة الأموات",
    type: "طائفة نهب ومرويم ظلال",
    lordName: "كابتن الأشباح البحرية",
    lordLevel: 135,
    members: 1400,
    alignment: "شرير",
    emblem: "☠️",
    zone: "الساحل الغربي",
    landmark: "قلعة البحارة المفقودين",
    power: 68,
    status: "active",
    allies: [],
    enemies: ["f_west_4"],
    description: "قراصنة قساة القلوب أبحروا في مثلث الضياع وعادوا بطقوس الموتى لنهب كل سفينة تعبر مياههم.",
    minJoinLevel: 4,
    joinRequirements: "مستوى 4+ · روح قرصان لا ترحم · جلب كنز غارق أو رأس ضحية بحرية",
    trialDesc: "اختبار الشرب من كأس الدم المالح والقفز من صاري سفينة الأشباح في كهف مظلم.",
    exclusivePerk: "لعنة القرصان (نهب 50% نقود إضافية من كل عدو مهزوم)",
    ranks: [
      { name: "تلميذ خارجي", minLevel: 4, perks: "سيف القرصان المعقوف، خنجر السم، جرأة +10%" },
      { name: "تلميذ داخلي", minLevel: 10, perks: "بندقية بارود قرصانية، سلب غنائم إضافية" },
      { name: "تلميذ النخبة", minLevel: 19, perks: "قبطان سفينة أشباح، رعب يضعف معنويات الخصوم" },
      { name: "شيخ الطائفة", minLevel: 34, perks: "سيد جزر القراصنة المفقودة والكنوز الدفينة" }
    ]
  }
};

// Generate authentic, complete 10-tier cultivation ranks for any Murim Sect
export function generateFactionRanks(factionName: string, minJoinLevel: number = 5, specialty: string = 'القتال والصقل'): FactionRankInfo[] {
  const base = Math.max(5, minJoinLevel);
  return [
    { name: "مريد تمهيدي (تلميذ عامل)", minLevel: base, perks: `صيانة ساحات ${factionName}، صقل الجسد المبدئي، وكساء العمل (+5% متانة)` },
    { name: "تلميذ خارجي", minLevel: Math.max(15, base + 8), perks: `رداء الطائفة الممهور، سيف التمرن الفولاذي، وحراسة البوابات (+10% هجوم)` },
    { name: "تلميذ داخلي", minLevel: Math.max(35, base + 26), perks: `ولوج مكتبة المخطوطات الباطنية، فنون ${specialty} المتقدمة (+18% دفاع وهجوم)` },
    { name: "تلميذ جوهري (النخبة)", minLevel: Math.max(60, base + 48), perks: `حمل راية الطائفة بالمحافل القارية، سلاح روحاني أصيل (+30% طاقة وضرر)` },
    { name: "التلميذ الأكبر (موروث الطائفة)", minLevel: 80, perks: `توجيه الشيوخ الكبار، الوصول لكنوز الطائفة السرية وخلافة القيادة (+45% حيوية)` },
    { name: "شماس مهام الطائفة", minLevel: 98, perks: `إدارة سجل المهام ومحاكمات الانضباط، وتوزيع المخصصات الشهرية` },
    { name: "شيخ قاعة الطائفة", minLevel: 115, perks: `رئاسة إحدى قاعات القوة الكبرى وصياغة الأسلحة والعلوم العليا` },
    { name: "شيخ أعظم", minLevel: 128, perks: `عضو مجلس الشيوخ الأكبر وحامي حرم الطائفة ضد جيوش الممالك` },
    { name: "نائب سيد الطائفة", minLevel: 138, perks: `إدارة الشؤون السياسية والتحالفات وإعلان الحروب القارية` },
    { name: "سيد الطائفة المطلق", minLevel: 148, perks: `السيادة المطلقة وقوة خارقة تهز أرجاء قارة التربة القاتمة` }
  ];
}

// Enhance all factions with realistic, balanced ranks and leader dynamics
Object.values(INITIAL_FACTIONS).forEach(f => {
  const minLvl = Math.max(5, (f.minJoinLevel || 2) * 2 + 1);
  f.minJoinLevel = minLvl;
  f.lordLevel = Math.max(145, f.lordLevel < 140 ? 145 + (f.power % 5) : f.lordLevel);
  f.requiredAffinity = f.alignment === 'صالح' ? 10 : (f.alignment === 'شرير' ? -15 : 0);
  f.ranks = generateFactionRanks(f.name, minLvl, f.type);
});

export const SPAWN_HUBS = [
  { id: "holy_city", name: "المدينة العظيمة", zone: "السهول الوسطى", icon: "🏛️", desc: "قلب الإمبراطورية — مركز التجارة، آمنة ومزدهرة", danger: 15 },
  { id: "ash_fortress", name: "قلعة الرماد", zone: "المرتفعات الشمالية", icon: "🏰", desc: "معقل الشمال القاسي — ثرية بالحديد والمعادن، رياح جليدية", danger: 40 },
  { id: "north_port", name: "ميناء الريح الشمالية", zone: "الساحل الغربي", icon: "⚓", desc: "ميناء بحري عظيم — تجارة وسفن عابرة للمحيط الغربي", danger: 20 },
  { id: "oasis_hope", name: "واحة الأمل", zone: "الصحراء الشرقية", icon: "🌴", desc: "ملتقى القوافل في قلب الرمال — تمر، ماء، أسرار دفينة", danger: 30 },
  { id: "marsh_fortress", name: "قلعة المستنقع", zone: "الأراضي الرطبة الجنوبية", icon: "🐊", desc: "حصن الأهوار المنيع — قنوات مائية، صيد، ضباب داكن", danger: 35 }
];

// Helper to look up landmark info
export function getLandmark(name: string): { landmark: MapLandmark; zone: MapZone } | null {
  for (const zone of MAP_CONTINENT.zones) {
    for (const lm of zone.landmarks) {
      if (lm.name === name) return { landmark: lm, zone };
    }
  }
  return null;
}

// Build a graph of roads between landmarks
export function getRoadGraph(): Record<string, { to: string; dist: number; type: string }[]> {
  const g: Record<string, { to: string; dist: number; type: string }[]> = {};
  for (const road of MAP_CONTINENT.roads) {
    const pts = road.points.filter(p => p.name);
    for (let i = 0; i + 1 < pts.length; i++) {
      const a = pts[i].name!;
      const b = pts[i + 1].name!;
      const dx = pts[i + 1].x - pts[i].x;
      const dy = pts[i + 1].y - pts[i].y;
      const d = Math.max(15, Math.round(Math.sqrt(dx * dx + dy * dy) * 0.7));
      if (!g[a]) g[a] = [];
      if (!g[b]) g[b] = [];
      g[a].push({ to: b, dist: d, type: road.type });
      g[b].push({ to: a, dist: d, type: road.type });
    }
  }
  return g;
}

// Find shortest route between ANY landmarks - guaranteed never to fail or return null
export function findShortestRoute(fromName: string, toName: string): { path: string[]; dist: number; type: string } {
  if (fromName === toName) {
    return { path: [fromName], dist: 0, type: 'road' };
  }

  const graph = getRoadGraph();

  // If both nodes exist in the graph, run Dijkstra
  if (graph[fromName] && graph[toName]) {
    const dist: Record<string, number> = {};
    const prev: Record<string, string> = {};
    const typeMap: Record<string, string> = {};
    const q = new Set(Object.keys(graph));

    for (const node of q) dist[node] = Infinity;
    dist[fromName] = 0;

    while (q.size > 0) {
      let u: string | null = null;
      let minD = Infinity;
      for (const node of q) {
        if (dist[node] < minD) {
          minD = dist[node];
          u = node;
        }
      }
      if (!u || u === toName || minD === Infinity) break;
      q.delete(u);

      for (const edge of graph[u] || []) {
        const alt = dist[u] + edge.dist;
        if (alt < dist[edge.to]) {
          dist[edge.to] = alt;
          prev[edge.to] = u;
          typeMap[edge.to] = edge.type;
        }
      }
    }

    if (dist[toName] !== Infinity) {
      const path: string[] = [];
      let curr: string | undefined = toName;
      while (curr) {
        path.unshift(curr);
        if (curr === fromName) break;
        curr = prev[curr];
      }
      return { path, dist: dist[toName], type: typeMap[toName] || 'road' };
    }
  }

  // Fallback: calculate realistic direct distance via coordinates so travel NEVER fails
  const a = getLandmark(fromName);
  const b = getLandmark(toName);

  if (a && b) {
    const dx = b.landmark.x - a.landmark.x;
    const dy = b.landmark.y - a.landmark.y;
    const directDist = Math.max(25, Math.round(Math.sqrt(dx * dx + dy * dy) * 0.75));
    return { path: [fromName, toName], dist: directDist, type: 'highway' };
  }

  return { path: [fromName, toName], dist: 80, type: 'road' };
}

