import { GameState, Kingdom, Faction, War, PoliticalEvent } from '../types/game';

export interface SimulationResult {
  events: PoliticalEvent[];
  updatedKingdoms: Kingdom[];
  updatedFactions: Record<string, Faction>;
  updatedWars: War[];
  updatedEmpire?: Kingdom;
}

export function simulateWorldDays(
  gameState: GameState,
  daysElapsed: number
): SimulationResult {
  if (daysElapsed <= 0) {
    return {
      events: [],
      updatedKingdoms: gameState.politics.kingdoms,
      updatedFactions: gameState.factions,
      updatedWars: gameState.politics.wars,
      updatedEmpire: gameState.politics.empire
    };
  }

  const kingdoms = JSON.parse(JSON.stringify(gameState.politics.kingdoms)) as Kingdom[];
  const empire = JSON.parse(JSON.stringify(gameState.politics.empire)) as Kingdom;
  const factions = JSON.parse(JSON.stringify(gameState.factions)) as Record<string, Faction>;
  const wars = JSON.parse(JSON.stringify(gameState.politics.wars)) as War[];
  const newEvents: PoliticalEvent[] = [];

  const startDay = gameState.world_state.day - daysElapsed;

  const getKingdom = (id: string): Kingdom | null => {
    if (id === 'empire') return empire;
    return kingdoms.find(k => k.id === id) || null;
  };

  // Simulate day by day
  for (let d = 1; d <= daysElapsed; d++) {
    const currentSimDay = startDay + d;

    // 1. SIMULATE ACTIVE WARS (Lasts weeks/months with realistic, grounded casualties)
    for (let wIdx = wars.length - 1; wIdx >= 0; wIdx--) {
      const war = wars[wIdx];
      if (war.status === 'ended') continue;

      war.currentDay += 1;

      // Preparation phase before actual clashes
      if (war.status === 'preparing') {
        war.preparationLeft -= 1;
        if (war.preparationLeft <= 0) {
          war.status = 'active';
          const atk = getKingdom(war.attacker);
          const def = getKingdom(war.defender);
          newEvents.push({
            type: 'war_clash',
            day: currentSimDay,
            text: `⚔️ اندلعت المعارك الميدانية الكبرى رسمياً بين ${atk?.name || war.attacker} و ${def?.name || war.defender} بعد اكتمال حشود الحدود!`,
            icon: '⚔️',
            color: '#d44'
          });
        }
        continue;
      }

      const atk = getKingdom(war.attacker);
      const def = getKingdom(war.defender);
      if (!atk || !def) continue;

      // Real siege & battle attrition
      // Pitched battle every 5 days, skirmish on other days
      const isMajorBattle = war.currentDay % 5 === 0 || d === daysElapsed;
      const atkLoss = isMajorBattle
        ? Math.floor(1200 + Math.random() * 2400)
        : Math.floor(150 + Math.random() * 550);
      const defLoss = isMajorBattle
        ? Math.floor(950 + Math.random() * 2100)
        : Math.floor(120 + Math.random() * 450);

      // Direct, precise deduction from army numbers
      atk.soldiers = Math.max(3000, atk.soldiers - atkLoss);
      def.soldiers = Math.max(3000, def.soldiers - defLoss);

      war.totalAttackerKilled += atkLoss;
      war.totalDefenderKilled += defLoss;

      const totalLossAtk = war.totalAttackerKilled;
      const totalLossDef = war.totalDefenderKilled;

      war.attackerLosses = Number(((totalLossAtk / (atk.soldiers + totalLossAtk)) * 100).toFixed(1));
      war.defenderLosses = Number(((totalLossDef / (def.soldiers + totalLossDef)) * 100).toFixed(1));

      // Gradual drain on state economy and morale
      if (isMajorBattle) {
        atk.economy = Math.max(10, atk.economy - 1);
        def.economy = Math.max(10, def.economy - 1);
        atk.morale = Math.max(10, atk.morale - 1);
        def.morale = Math.max(10, def.morale - 1);

        newEvents.push({
          type: 'battle_report',
          day: currentSimDay,
          text: `🗡️ تقرير معركة دامية: خسرت ${atk.name} ${atkLoss.toLocaleString('ar-SA')} جندي، وخسرت ${def.name} ${defLoss.toLocaleString('ar-SA')} جندي في مواجهات عنيفة. (إجمالي قتلى الحرب: ${(totalLossAtk + totalLossDef).toLocaleString('ar-SA')})`,
          icon: '🗡️',
          color: '#e11d48'
        });
      }

      // IMPERIAL INTERVENTION (العرش الإمبراطوري يتدخل لفرض السلم وحماية التجارة إذا طال النزاع)
      if (war.currentDay >= 15 && (totalLossAtk + totalLossDef) >= 20000 && Math.random() < 0.25) {
        war.status = 'ended';
        war.winner = 'empire_truce';

        // Imperial decree fines the aggressor and restores order
        atk.economy = Math.max(10, atk.economy - 4);
        empire.economy = Math.min(100, empire.economy + 2);

        newEvents.push({
          type: 'imperial_decree',
          day: currentSimDay,
          text: `👑 مرسوم التهدئة الإمبراطوري: الإمبراطور سولون الأول يرسل فيالق الحرس الإمبراطوري لفض النزاع قسراً بين ${atk.name} و ${def.name}، وفرض غرامة حرب على الطرفين لحفظ الأمن القاري.`,
          icon: '👑',
          color: '#b48c3c'
        });
        continue;
      }

      // War End / Capitulation conditions
      if (war.attackerLosses >= 35 || atk.soldiers <= 25000) {
        war.status = 'ended';
        war.winner = def.id;
        def.morale = Math.min(100, def.morale + 10);
        atk.morale = Math.max(15, atk.morale - 15);
        newEvents.push({
          type: 'war_end',
          day: currentSimDay,
          text: `🏁 انتهاء الحرب: انتصرت ${def.name} وصمدت قلاعها بعد استنزاف جيش ${atk.name}. بلغت خسائر المهاجم الإجمالية ${totalLossAtk.toLocaleString('ar-SA')} جندي.`,
          icon: '🏁',
          color: '#4a8b20'
        });
      } else if (war.defenderLosses >= 35 || def.soldiers <= 25000) {
        war.status = 'ended';
        war.winner = atk.id;
        atk.morale = Math.min(100, atk.morale + 12);
        def.morale = Math.max(15, def.morale - 18);
        newEvents.push({
          type: 'war_end',
          day: currentSimDay,
          text: `🏁 اختراق دفاعات ${def.name}! انتصرت ${atk.name} واقتطعت حصوناً جديدة بعد معارك شرسة أزهقت أرواح ${(totalLossAtk + totalLossDef).toLocaleString('ar-SA')} مقاتل.`,
          icon: '🏁',
          color: '#4a8b20'
        });
      }
    }

    // 2. CHANCE FOR NEW WARS (Only when relations are at rock bottom: <= -45)
    if (Math.random() < 0.018 && wars.filter(w => w.status !== 'ended').length < 2) {
      const hostilePairs: [Kingdom, Kingdom][] = [];
      for (const k1 of kingdoms) {
        for (const k2 of kingdoms) {
          if (k1.id !== k2.id && (k1.enemies.includes(k2.id) || k2.enemies.includes(k1.id))) {
            const alreadyAtWar = wars.some(w => 
              w.status !== 'ended' && 
              ((w.attacker === k1.id && w.defender === k2.id) || (w.attacker === k2.id && w.defender === k1.id))
            );
            if (!alreadyAtWar) hostilePairs.push([k1, k2]);
          }
        }
      }

      if (hostilePairs.length > 0) {
        const [atk, def] = hostilePairs[Math.floor(Math.random() * hostilePairs.length)];
        const newWar: War = {
          id: `war_${atk.id}_${def.id}_${currentSimDay}`,
          attacker: atk.id,
          defender: def.id,
          startDay: currentSimDay,
          currentDay: 1,
          status: 'preparing',
          preparationLeft: 5, // 5 days preparation
          attackerLosses: 0,
          defenderLosses: 0,
          totalAttackerKilled: 0,
          totalDefenderKilled: 0,
          battles: []
        };
        wars.push(newWar);

        newEvents.push({
          type: 'war_declaration',
          day: currentSimDay,
          text: `📢 إعلان حرب رسمي: بعد تدهور العلاقات إلى الحضيض، أعلنت ${atk.name} الحرب على ${def.name}، والجيوش تتحرك نحو قلاع التماس!`,
          icon: '⚔️',
          color: '#d44'
        });
      }
    }

    // 3. MURIM SECTS CLASHES & ATTRITION (Real disciple casualties deducted directly)
    if (Math.random() < 0.035) {
      const activeFactions = Object.values(factions).filter(f => f.status === 'active');
      if (activeFactions.length >= 2) {
        const f1 = activeFactions[Math.floor(Math.random() * activeFactions.length)];
        const f2 = activeFactions.find(f => f.id !== f1.id && (f.zone === f1.zone || f1.enemies?.includes(f.id))) || 
                   activeFactions.find(f => f.id !== f1.id);

        if (f2 && f1.id !== f2.id) {
          const f1Loss = Math.floor(20 + Math.random() * 65);
          const f2Loss = Math.floor(18 + Math.random() * 55);

          f1.members = Math.max(0, f1.members - f1Loss);
          f2.members = Math.max(0, f2.members - f2Loss);
          f1.power = Math.max(5, Math.floor(f1.power - f1Loss * 0.05));
          f2.power = Math.max(5, Math.floor(f2.power - f2Loss * 0.05));

          newEvents.push({
            type: 'faction_battle',
            day: currentSimDay,
            text: `🩸 صراع مرويم دامٍ: اشتباك بين "${f1.name}" و "${f2.name}" في ${f1.zone}. مقتل ${f1Loss} تلميذاً من الأولى و ${f2Loss} من الثانية وتراجع في القوة.`,
            icon: '🩸',
            color: '#b91c1c'
          });

          if (f1.members <= 150) {
            f1.status = 'destroyed';
            newEvents.push({
              type: 'faction_destroyed',
              day: currentSimDay,
              text: `💀 انهيار وتفكك طائفة "${f1.name}" بعد مقتل قادتها ونفاد تلاميذها المدافعين!`,
              icon: '💀',
              color: '#7f1d1d'
            });
          }
          if (f2.members <= 150) {
            f2.status = 'destroyed';
            newEvents.push({
              type: 'faction_destroyed',
              day: currentSimDay,
              text: `💀 انهيار وتفكك طائفة "${f2.name}" بعد مقتل قادتها ونفاد تلاميذها المدافعين!`,
              icon: '💀',
              color: '#7f1d1d'
            });
          }
        }
      }
    }

    // 4. MAJOR WORLD EVENTS (Rare, high-impact non-war events)
    if (Math.random() < 0.025) {
      const k = kingdoms[Math.floor(Math.random() * kingdoms.length)];
      const roll = Math.random();

      if (roll < 0.25) {
        // Plague outbreak
        const popLoss = Math.floor(k.pop * 0.015);
        const soldierLoss = Math.floor(k.soldiers * 0.018);
        k.pop = Math.max(500000, k.pop - popLoss);
        k.soldiers = Math.max(5000, k.soldiers - soldierLoss);
        k.economy = Math.max(10, k.economy - 5);
        k.morale = Math.max(10, k.morale - 6);

        newEvents.push({
          type: 'plague',
          day: currentSimDay,
          text: `☠️ تفشي وباء الحمى الرملية في ${k.name}: وفاة ${popLoss.toLocaleString('ar-SA')} نسمة و ${soldierLoss.toLocaleString('ar-SA')} جندي، وتراجع ملحوظ في الاقتصاد.`,
          icon: '☠️',
          color: '#8b2020'
        });
      } else if (roll < 0.5) {
        // Mineral discovery / trade prosperity
        k.economy = Math.min(100, k.economy + 8);
        k.morale = Math.min(100, k.morale + 4);

        newEvents.push({
          type: 'prosperity',
          day: currentSimDay,
          text: `💰 اكتشاف عروق بلاتين وفضة في تخوم ${k.name}: انتعاش الخزينة وارتفاع مؤشر الاقتصاد إلى ${k.economy}%.`,
          icon: '💰',
          color: '#4a8b20'
        });
      } else if (roll < 0.75) {
        // Mutual Defense Alliance Pact
        const potentialAlly = kingdoms.find(other => other.id !== k.id && !k.allies.includes(other.id) && !k.enemies.includes(other.id));
        if (potentialAlly) {
          k.allies.push(potentialAlly.id);
          potentialAlly.allies.push(k.id);
          k.morale = Math.min(100, k.morale + 5);
          potentialAlly.morale = Math.min(100, potentialAlly.morale + 5);

          newEvents.push({
            type: 'alliance_pact',
            day: currentSimDay,
            text: `🤝 تحالف استراتيجي جديد: أبرمت ${k.name} و ${potentialAlly.name} معاهدة دفاع مشترك لحماية طرق القوافل وتنسيق الجيوش.`,
            icon: '🤝',
            color: '#3b82f6'
          });
        }
      } else {
        // Imperial Martial Exam Tournament
        empire.morale = Math.min(100, empire.morale + 3);
        newEvents.push({
          type: 'imperial_exam',
          day: currentSimDay,
          text: `🏆 انطلاق المسابقة الإمبراطورية الكبرى في العاصمة: شيوخ وتلاميذ طوائف المرويم يتنافسون على ألقاب البطولة القارية في ساحة المدينة العظيمة.`,
          icon: '🏆',
          color: '#eab308'
        });
      }
    }
  }

  return {
    events: newEvents,
    updatedKingdoms: kingdoms,
    updatedFactions: factions,
    updatedWars: wars,
    updatedEmpire: empire
  };
}
