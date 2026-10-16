import React, { useState, useEffect, useCallback } from 'react';
import { GameState, InventoryItem, StoryLogEntry, Faction } from './types/game';
import { MAP_CONTINENT, INITIAL_KINGDOMS, INITIAL_FACTIONS, findShortestRoute, getLandmark } from './data/worldData';
import { DEFAULT_WEAPONS, DEFAULT_ARMORS, COMMON_TOOLS } from './data/items';
import { TRANSPORTS, rollDice, getRankData, copperToCurrency, currencyToCopper } from './utils/dice';
import { soundEngine } from './utils/audio';
import { simulateWorldDays } from './utils/worldSimulation';

import { TitleScreen } from './components/TitleScreen';
import { Header } from './components/Header';
import { ChatView, ChatMessage } from './components/ChatView';
import { WorldMapModal } from './components/WorldMapModal';
import { StatusModal } from './components/StatusModal';
import { InventoryModal } from './components/InventoryModal';
import { PoliticsModal } from './components/PoliticsModal';
import { SaveSlotsModal, SaveSlotMeta } from './components/SaveSlotsModal';
import { SpawnModal } from './components/SpawnModal';
import { TradeScaleModal } from './components/TradeScaleModal';

const ACTIVE_SLOT_KEY = 'grim_soil_active_slot';
const SLOTS_LIST_KEY = 'grim_soil_slots';

function generateIntroMessage(landmarkName: string, regionName: string): ChatMessage {
  let atmosphere = '';
  if (landmarkName === 'المدينة العظيمة') {
    atmosphere = `تفتح عينيك وسط صخب الأزقة الحجرية في **المدينة العظيمة**، قلب إمبراطورية العواصم ومهد العرش الإمبراطوري.
أمامك ترتفع الأسوار البيضاء الشاهقة ومآذن القصر، حيث تجوب دوريات الحرس الإمبراطوري بدروعهم الفضية والحراب المذهبة لحفظ الأمن.
في جيبك خنجر متواضع وبضع قطع نقدية، وتملأ أنفك رائحة التوابل وغبار الخيول وحديد السيوف المشحوذة في الأسواق الكبرى.`;
  } else if (landmarkName === 'قلعة الرماد') {
    atmosphere = `تفتح عينيك وسط صقيع الشمال القارس في **قلعة الرماد**، المعقل الحصين لمملكة الشمال.
رياح جليدية عاتية تعصف بين أبراج البازلت الأسود وأفران صهر الحديد المتوهجة بجمر بركاني لا ينطفئ.
يتصاعد دخان الفحم في الأفق المعتم، وحولك محاربون أشداء من طائفة رماد المعارك يرتدون الفراء السميك ويصقلون أنصالهم.`;
  } else if (landmarkName === 'ميناء الريح الشمالية') {
    atmosphere = `تفتح عينيك على صرخات طيور النورس وتلاطم الأمواج العاتية في **ميناء الريح الشمالية** على الساحل الغربي.
ضباب بحري مالح يلف أرصفة الخشب العتيقة وصواري السفن الحربية الشراعية الراسية في المضيق المزدحم.
رائحة القطران والأسماك المجففة والفولاذ تملأ الهواء، وأمامك أفق بحري هائج يمتد إلى ما لا نهاية.`;
  } else if (landmarkName === 'واحة الأمل') {
    atmosphere = `تفتح عينيك تحت ظلال سعف النخيل الباسقة في **واحة الأمل**، الجوهرة الخضراء في قلب الصحراء الشرقية.
نسيم دافئ محمل بعبق التمر والرمال الذهبية التي تموج كالبحر تحت شمس مشرقة.
أجراس قوافل الحرير ترن في الأفق، والمسافرون يرتشفون الماء البارد بجوار الآبار قبل مسير القفار الشاق.`;
  } else if (landmarkName === 'قلعة المستنقع') {
    atmosphere = `تفتح عينيك في حجرة خشبية مرتفعة فوق المياه الراكدة في **قلعة المستنقع**، معقل الأراضي الرطبة الجنوبية.
ضباب رمادي كثيف ينساب بين نباتات القصب العملاقة وأصوات كائنات الأهوار الغريبة تتردد في السكون.
مقاتلو المستنقعات يتحركون بزوارقهم الرشيقة بصمت كالأشباح بين القنوات المائية المحصنة.`;
  } else {
    atmosphere = `تفتح عينيك مثقلاً بالوهن وسط **${landmarkName}** في إقليم ${regionName}.
الرياح تهب محملة بعبق التربة القاتمة ورائحة الفولاذ والغبار. في جيبك خنجر متواضع وقطع نحاسية، وأمامك قارة بأسرها تموج بالصراعات والحروب والأسرار.`;
  }

  return {
    role: 'assistant',
    content: `${atmosphere}

أنت الآن في بداية رحلتك؛ يمكنك استكشاف محيطك، فتح خريطة العالم للسفر، أو التوجه إلى طوائف المرويم لاختبار قدراتك والانضمام إليها. ما هو أول قرار تتخذه؟`,
    timestamp: Date.now()
  };
}

function createDefaultGameState(spawnLandmarkName: string = 'المدينة العظيمة'): GameState {
  const lm = getLandmark(spawnLandmarkName);
  const regionName = lm ? lm.zone.name : 'السهول الوسطى';

  return {
    version: 3,
    player: {
      name: 'مسافر مجهول',
      rank: 'أفق الولادة',
      level: 1,
      xp: 0,
      strength: 8,
      base_damage: 4,
      defense: 2,
      hp_current: 100,
      hp_max: 100,
      ap_current: 100,
      ap_max: 100,
      m_current: 10,
      m_max: 10,
      s_current: 8,
      s_max: 8,
      weapon_equipped: 'سكين صدئ',
      armor_equipped: 'عباءة صوفية',
      weapons: [...DEFAULT_WEAPONS.slice(0, 1)],
      armors: [...DEFAULT_ARMORS.slice(0, 1)],
      inventory: [
        { id: 'w_rusty_dagger', item: 'سكين صدئ', qty: 1, weight: 0.4, rarity: 'common', damage: 3 },
        { id: 'a_woolen_cloak', item: 'عباءة صوفية', qty: 1, weight: 1.2, rarity: 'common', defense: 1 },
        { id: 'f_dried_meat', item: 'لحم مقدد وتمر جاف', qty: 3, weight: 0.6, rarity: 'common', desc: 'زاد سفر مجفف يمنح 1,200 سعرة حرارية لكل وجبة', special: { type: 'food', desc: '1200 سعرة', value: 1200 } },
        { id: 'f_waterskin', item: 'قربة ماء عذبة', qty: 2, weight: 1.0, rarity: 'common', desc: 'ماء نقي عذب يروي العطش', special: { type: 'water', desc: 'ترطيب 100%', value: 100 } },
        ...COMMON_TOOLS.slice(0, 2)
      ],
      currency: { G: 0, S: 15, C: 45 },
      carry_weight_current: 3.2,
      carry_weight_max: 50,
      calories_current: 8000,
      calories_max: 10000,
      hydration_current: 100,
      hunger_days: 0,
      thirst_days: 0,
      exhaustion: 0,
      blood_infection: 0,
      scars: [],
      faction_relations: {},
      level_challenge: 'تحدي صقل المستوى 3: الصمود أمام مناوشة مع وحش بري أو قاطع طريق والانتصار دون التراجع.',
      level_challenge_done: false,
      skills: [
        { id: 'sk_parry', name: 'صد وتفادي دفاعي', desc: 'استغلال وزن السلاح لتفادي ضربات العدو المباشرة', ap_cost: 6, xp: 0, unlock_level: 1 }
      ],
      current_landmark: spawnLandmarkName,
      in_combat: false
    },
    location: {
      layer: 'surface',
      region: regionName,
      sub_location: spawnLandmarkName
    },
    world_state: {
      day: 1,
      time: 'noon',
      threat_index: 25,
      randomness_index: 15,
      weather: 'رياح جافة معتدلة'
    },
    npcs: [],
    quest_log: [
      { id: 'q_survive', title: 'البقاء واستكشاف أسرار القارة', status: 'active' }
    ],
    story_log: [
      { turn: 1, day: 1, text: `انطلقت الرحلة في ${spawnLandmarkName}. جسد متعب، وذاكرة يغلفها ضباب النسيان.` }
    ],
    event_history: [],
    last_5_narrative: [`استيقظت في ${spawnLandmarkName}`],
    politics: {
      empire: INITIAL_KINGDOMS[0],
      kingdoms: INITIAL_KINGDOMS.slice(1),
      relations: {
        kingdom_north: { kingdom_center: 65, kingdom_west: -45, kingdom_east: -20 },
        kingdom_east: { kingdom_west: 60, kingdom_center: -30, kingdom_north: -20 },
        kingdom_center: { kingdom_north: 65, kingdom_east: -30, kingdom_south: 15 },
        kingdom_south: { empire: 70, kingdom_north: -35 },
        kingdom_west: { kingdom_east: 60, kingdom_north: -45 }
      },
      territories: {
        north_highlands: { owner: 'kingdom_north', name: 'المرتفعات الشمالية', contested: false },
        east_desert: { owner: 'kingdom_east', name: 'الصحراء الشرقية', contested: false },
        central_plains: { owner: 'kingdom_center', name: 'السهول الوسطى', contested: false },
        south_wetlands: { owner: 'kingdom_south', name: 'الأراضي الرطبة الجنوبية', contested: false },
        west_coast: { owner: 'kingdom_west', name: 'الساحل الغربي', contested: false }
      },
      wars: [
        {
          id: 'war_north_west_init',
          attacker: 'kingdom_north',
          defender: 'kingdom_west',
          startDay: 1,
          currentDay: 4,
          status: 'active',
          preparationLeft: 0,
          attackerLosses: 4.1,
          defenderLosses: 4.8,
          totalAttackerKilled: 5800,
          totalDefenderKilled: 5700,
          battles: []
        }
      ],
      politicalEvents: [
        { type: 'war_clash', day: 1, text: '⚔️ اشتعال نزاع السواحل والمرتفعات: معارك ضارية بين مملكة الشمال ومملكة الساحل على الممرات التجارية البحرية.', icon: '⚔️', color: '#d44' },
        { type: 'peace', day: 1, text: '🕊️ هدنة مؤقتة بين مملكة السهول ومملكة الشرق برعاية قوافل الحرير.', icon: '🕊️', color: '#4a8b20' }
      ],
      currentDay: 1,
      lastSimulatedDay: 1
    },
    factions: { ...INITIAL_FACTIONS }
  };
}

export default function App() {
  const [inGame, setInGame] = useState(false);
  const [activeSlotId, setActiveSlotId] = useState<string>('slot_1');
  const [gameState, setGameState] = useState<GameState>(() => createDefaultGameState());
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Modals visibility
  const [showMap, setShowMap] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showPolitics, setShowPolitics] = useState(false);
  const [showSaves, setShowSaves] = useState(false);
  const [showSpawnModal, setShowSpawnModal] = useState(false);
  const [showTradeScale, setShowTradeScale] = useState(false);
  const [pendingSlotId, setPendingSlotId] = useState<string | null>(null);

  // Turn Undo snapshot
  const [turnSnapshot, setTurnSnapshot] = useState<{ state: GameState; messages: ChatMessage[] } | null>(null);

  // Save current game state to localStorage
  const saveCurrentGame = useCallback((stateToSave: GameState, msgsToSave: ChatMessage[]) => {
    try {
      localStorage.setItem(`grim_soil_${activeSlotId}_state`, JSON.stringify(stateToSave));
      localStorage.setItem(`grim_soil_${activeSlotId}_msgs`, JSON.stringify(msgsToSave));

      // Update slots list metadata
      const slotsRaw = localStorage.getItem(SLOTS_LIST_KEY);
      let slots: SaveSlotMeta[] = slotsRaw ? JSON.parse(slotsRaw) : [];
      const existing = slots.find(s => s.id === activeSlotId);
      if (existing) {
        existing.day = stateToSave.world_state.day;
        existing.landmark = stateToSave.player.current_landmark;
        existing.level = stateToSave.player.level;
      } else {
        slots.push({
          id: activeSlotId,
          name: `التخزينة ${slots.length + 1}`,
          created: Date.now(),
          day: stateToSave.world_state.day,
          landmark: stateToSave.player.current_landmark,
          level: stateToSave.player.level
        });
      }
      localStorage.setItem(SLOTS_LIST_KEY, JSON.stringify(slots));
    } catch (e) {
      console.warn('Save failed:', e);
    }
  }, [activeSlotId]);

  // Load existing save on initial mount & Catch up world simulation if days passed
  useEffect(() => {
    try {
      const savedSlot = localStorage.getItem(ACTIVE_SLOT_KEY) || 'slot_1';
      setActiveSlotId(savedSlot);
      const savedStateRaw = localStorage.getItem(`grim_soil_${savedSlot}_state`);
      const savedMessagesRaw = localStorage.getItem(`grim_soil_${savedSlot}_msgs`);

      if (savedStateRaw) {
        let parsed: GameState = JSON.parse(savedStateRaw);
        let parsedMsgs: ChatMessage[] = savedMessagesRaw ? JSON.parse(savedMessagesRaw) : [];

        // Guarantee messages is NEVER empty
        if (parsedMsgs.length === 0) {
          const intro = generateIntroMessage(parsed.player.current_landmark, parsed.location.region);
          parsedMsgs = [intro];
        }

        // Catch up world political simulation if days passed without simulation!
        const lastSim = parsed.politics.lastSimulatedDay || 1;
        const currentDay = parsed.world_state.day || 1;
        if (currentDay > lastSim) {
          const daysToCatchUp = currentDay - lastSim;
          const simRes = simulateWorldDays(parsed, daysToCatchUp);

          parsed.politics.kingdoms = simRes.updatedKingdoms;
          parsed.factions = simRes.updatedFactions;
          parsed.politics.wars = simRes.updatedWars;
          parsed.politics.politicalEvents.push(...simRes.events);
          parsed.politics.lastSimulatedDay = currentDay;
          parsed.politics.currentDay = currentDay;
        }

        setGameState(parsed);
        setMessages(parsedMsgs);
        saveCurrentGame(parsed, parsedMsgs);
      }
    } catch (e) {
      console.warn('Failed to load initial save:', e);
    }
  }, [saveCurrentGame]);

  // Start new game from Title Screen
  const handleStartNewGame = (spawnLandmark: string) => {
    const lm = getLandmark(spawnLandmark);
    const region = lm ? lm.zone.name : 'السهول الوسطى';
    const newState = createDefaultGameState(spawnLandmark);
    const initialMsg = generateIntroMessage(spawnLandmark, region);

    setGameState(newState);
    setMessages([initialMsg]);
    setInGame(true);
    setTurnSnapshot(null);
    saveCurrentGame(newState, [initialMsg]);
  };

  const handleContinueGame = () => {
    // If messages are empty for some reason, ensure an intro exists
    if (messages.length === 0) {
      const intro = generateIntroMessage(gameState.player.current_landmark, gameState.location.region);
      setMessages([intro]);
      saveCurrentGame(gameState, [intro]);
    }
    setInGame(true);
  };

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  // Turn Undo
  const handleUndoLastTurn = () => {
    if (!turnSnapshot) return;
    soundEngine.playClick();
    setGameState(turnSnapshot.state);
    setMessages(turnSnapshot.messages);
    saveCurrentGame(turnSnapshot.state, turnSnapshot.messages);
    setTurnSnapshot(null);
  };

  // Creates a completely new slot (or initializes an empty existing slot) with the chosen spawn point
  const handleCreateNewSlotWithSpawn = (spawnLandmark: string) => {
    setShowSpawnModal(false);
    setShowSaves(false);

    const lm = getLandmark(spawnLandmark);
    const region = lm ? lm.zone.name : 'السهول الوسطى';

    const slotsRaw = localStorage.getItem(SLOTS_LIST_KEY);
    let slots: SaveSlotMeta[] = slotsRaw ? JSON.parse(slotsRaw) : [];
    
    const targetId = pendingSlotId || `slot_${Date.now()}`;
    setPendingSlotId(null);

    const existingIndex = slots.findIndex(s => s.id === targetId);
    const slotName = existingIndex >= 0 ? slots[existingIndex].name : `التخزينة ${slots.length + 1}`;

    const newState = createDefaultGameState(spawnLandmark);
    const introMsg = generateIntroMessage(spawnLandmark, region);

    if (existingIndex >= 0) {
      slots[existingIndex].landmark = spawnLandmark;
      slots[existingIndex].day = 1;
      slots[existingIndex].level = 1;
    } else {
      slots.push({
        id: targetId,
        name: slotName,
        created: Date.now(),
        day: 1,
        landmark: spawnLandmark,
        level: 1
      });
    }

    localStorage.setItem(SLOTS_LIST_KEY, JSON.stringify(slots));
    setActiveSlotId(targetId);
    localStorage.setItem(ACTIVE_SLOT_KEY, targetId);

    setGameState(newState);
    setMessages([introMsg]);
    setTurnSnapshot(null);
    setInGame(true);

    try {
      localStorage.setItem(`grim_soil_${targetId}_state`, JSON.stringify(newState));
      localStorage.setItem(`grim_soil_${targetId}_msgs`, JSON.stringify([introMsg]));
    } catch {}

    soundEngine.playVictoryChime();
  };

  // Main action dispatch: Communicates with backend AI & runs tight mechanical simulation
  const handleSendMessage = async (userPrompt: string) => {
    if (isGenerating || !userPrompt.trim()) return;

    // Save snapshot for potential undo
    setTurnSnapshot({
      state: JSON.parse(JSON.stringify(gameState)),
      messages: [...messages]
    });

    const userMessage: ChatMessage = {
      role: 'user',
      content: userPrompt,
      timestamp: Date.now()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsGenerating(true);

    try {
      const isTravelCommand = /(سافر|أسافر|اذهب|أذهب|توجه|أتوجه|انطلق|أنطلق|رحلة|طريق)/i.test(userPrompt);

      let extraDirective = '';
      if (isTravelCommand) {
        // Guaranteed 100% safe travel as requested by user
        extraDirective = 'السفر سالم ومضمون 100% بدون أي سيناريوهات تعطل أو نرد خطر. صف مشاهد الطريق بجمال والوصول بسلام إلى الوجهة المحددة.';
      } else {
        // For combat or risky deeds, roll dice
        const dice = rollDice(0);
        soundEngine.playDiceRoll();
        extraDirective = `فحص المبادرة أو القتال بنتيجة نرد القدر [${dice.final}/100]. صف النتيجة المنطقية بناء على هذا الرقم.`;
      }

      // Call server-side API using gemini-3.1-flash-lite
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userPrompt,
          model: 'gemini-3.1-flash-lite',
          gameState: {
            player: {
              ...gameState.player,
              inventory: gameState.player.inventory.map(i => ({ item: i.item, qty: i.qty }))
            },
            location: gameState.location,
            world_state: gameState.world_state
          },
          recentHistory: newMessages.slice(-4),
          extraDirective
        })
      });

      const data = await res.json();
      const aiContent = data?.content || '...';

      // Parse JSON updates if returned
      let parsedUpdates: any = null;
      const jsonMatch = aiContent.match(/```json\s*([\s\S]*?)```/);
      if (jsonMatch) {
        try {
          parsedUpdates = JSON.parse(jsonMatch[1]);
        } catch {}
      }

      // Apply mechanical progression
      const updatedState = { ...gameState };
      const p = updatedState.player;
      const w = updatedState.world_state;

      // Gain XP per turn
      const xpGain = parsedUpdates?.playerUpdates?.xpGain || 6;
      p.xp += xpGain;
      const rankInfo = getRankData(p.level);
      if (p.xp >= rankInfo.xpNeeded && p.level < 150) {
        p.xp -= rankInfo.xpNeeded;
        p.level += 1;
        p.strength += 1;
        p.base_damage += 1;
        p.hp_max += 5;
        p.hp_current = p.hp_max;
        p.rank = getRankData(p.level).display;
        soundEngine.playVictoryChime();
      }

      // Apply HP / AP deltas precisely
      if (parsedUpdates?.playerUpdates?.hpDelta) {
        p.hp_current = Math.max(0, Math.min(p.hp_max, p.hp_current + parsedUpdates.playerUpdates.hpDelta));
        if (parsedUpdates.playerUpdates.hpDelta < 0) soundEngine.playImpact(true);
      }
      if (parsedUpdates?.playerUpdates?.apDelta) {
        p.ap_current = Math.max(0, Math.min(p.ap_max, p.ap_current + parsedUpdates.playerUpdates.apDelta));
      }

      // Apply currency changes precisely
      if (parsedUpdates?.playerUpdates?.currencyDelta) {
        const delta = parsedUpdates.playerUpdates.currencyDelta;
        const currentC = currencyToCopper(p.currency);
        const deltaC = (delta.G || 0) * 10000 + (delta.S || 0) * 100 + (delta.C || 0);
        p.currency = copperToCurrency(currentC + deltaC);
      }

      // If buying occurred in prompt, auto-deduct currency
      const buyMatch = userPrompt.match(/(?:اشتري|شراء|ابتياع)\s+(.+?)(?:بـ|بسعر|مقابل|\s+(\d+)\s*(?:نحاس|فضة|ذهب)|$)/i);
      if (buyMatch && buyMatch[2]) {
        const costVal = parseInt(buyMatch[2], 10);
        const isGold = /ذهب/i.test(userPrompt);
        const isSilver = /فضة/i.test(userPrompt);
        const costInCopper = isGold ? costVal * 10000 : (isSilver ? costVal * 100 : costVal);
        const curCopper = currencyToCopper(p.currency);
        if (curCopper >= costInCopper) {
          p.currency = copperToCurrency(curCopper - costInCopper);
        }
      }

      // If days advanced (e.g. from travel or turn cycle), run political simulation!
      let daysPassed = 0;
      if (isTravelCommand) {
        daysPassed = 1;
        w.day += 1;
        p.hunger_days = Math.max(0, p.hunger_days + 1);
        p.thirst_days = Math.max(0, p.thirst_days + 1);
        p.exhaustion = Math.min(100, p.exhaustion + 2);
      } else if (newMessages.length % 5 === 0) {
        daysPassed = 1;
        w.day += 1;
      }

      if (daysPassed > 0) {
        const simResult = simulateWorldDays(updatedState, daysPassed);
        updatedState.politics.kingdoms = simResult.updatedKingdoms;
        updatedState.factions = simResult.updatedFactions;
        updatedState.politics.wars = simResult.updatedWars;
        updatedState.politics.politicalEvents.push(...simResult.events);
        updatedState.politics.lastSimulatedDay = w.day;
        updatedState.politics.currentDay = w.day;
      }

      // Add to story log
      const summaryText = parsedUpdates?.event || userPrompt.slice(0, 100);
      updatedState.story_log.push({
        turn: updatedState.story_log.length + 1,
        day: w.day,
        text: summaryText
      });

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: aiContent,
        timestamp: Date.now()
      };

      const finalMessages = [...newMessages, assistantMessage];
      setGameState(updatedState);
      setMessages(finalMessages);
      saveCurrentGame(updatedState, finalMessages);
    } catch (err) {
      console.error('Action error:', err);
      const errorMsg: ChatMessage = {
        role: 'system',
        content: 'تعذر الاتصال بالخادم، تم حفظ حالتك المحلية للمتابعة.',
        timestamp: Date.now()
      };
      setMessages([...newMessages, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Guaranteed 100% Safe Travel from World Map
  const handleStartTravel = (destinationLandmark: string, transportId: string) => {
    const transport = TRANSPORTS.find(t => t.id === transportId) || TRANSPORTS[0];
    const route = findShortestRoute(gameState.player.current_landmark, destinationLandmark);
    const dist = route.dist;
    const days = Math.max(1, Math.ceil(dist / transport.kmPerDay));
    const costCopper = transport.costCopperPerDay * days;

    const totalCopper = currencyToCopper(gameState.player.currency);
    if (totalCopper < costCopper) {
      alert(`لا تملك نقوداً كافية لهذه الرحلة (${costCopper} نحاس مطلوب).`);
      return;
    }

    const lm = getLandmark(destinationLandmark);
    const regionName = lm ? lm.zone.name : gameState.location.region;

    // Deduct exact cost and advance state
    const updatedState = { ...gameState };
    updatedState.player.currency = copperToCurrency(totalCopper - costCopper);
    updatedState.player.current_landmark = destinationLandmark;
    updatedState.location.sub_location = destinationLandmark;
    updatedState.location.region = regionName;
    updatedState.world_state.day += days;
    updatedState.player.ap_current = Math.max(0, updatedState.player.ap_current - transport.apCostPerDay * days);

    // Apply biological effects of travel
    if (transport.id === 'caravan') {
      updatedState.player.exhaustion = Math.max(0, updatedState.player.exhaustion - 5);
      updatedState.player.hp_current = Math.min(updatedState.player.hp_max, updatedState.player.hp_current + 10);
    } else {
      updatedState.player.hunger_days += Math.min(days, 2);
      updatedState.player.thirst_days += Math.min(days, 2);
      updatedState.player.exhaustion = Math.min(100, updatedState.player.exhaustion + transport.exhaustionPerDay * days);
    }

    // Run world simulation for the travel days elapsed!
    const simResult = simulateWorldDays(updatedState, days);
    updatedState.politics.kingdoms = simResult.updatedKingdoms;
    updatedState.factions = simResult.updatedFactions;
    updatedState.politics.wars = simResult.updatedWars;
    updatedState.politics.politicalEvents.push(...simResult.events);
    updatedState.politics.lastSimulatedDay = updatedState.world_state.day;
    updatedState.politics.currentDay = updatedState.world_state.day;

    setGameState(updatedState);
    handleSendMessage(`أبدأ السفر نحو ${destinationLandmark} بواسطة ${transport.name} لمسافة ${dist} كم مستغرقاً ${days} أيام.`);
  };

  // Equip item
  const handleEquipItem = (item: InventoryItem, slot: 'weapon' | 'armor') => {
    const updated = { ...gameState };
    if (slot === 'weapon') {
      updated.player.weapon_equipped = item.item;
      if (item.damage) updated.player.base_damage = item.damage;
    } else {
      updated.player.armor_equipped = item.item;
      if (item.defense) updated.player.defense = item.defense;
    }
    setGameState(updated);
    saveCurrentGame(updated, messages);
    soundEngine.playClick();
  };

  // Use consumable item — strictly reduces qty and removes completely if qty <= 0
  const handleUseItem = (item: InventoryItem) => {
    const updated = { ...gameState };
    const p = updated.player;

    const itemIndex = p.inventory.findIndex(i => (i.id && i.id === item.id) || i.item === item.item);
    if (itemIndex === -1) return;

    if (item.item.includes('جرعة') || item.item.includes('ترياق')) {
      p.hp_current = Math.min(p.hp_max, p.hp_current + 35);
      p.blood_infection = 0;
    } else if (item.item.includes('ماء')) {
      p.thirst_days = 0;
    } else if (item.item.includes('مؤن') || item.item.includes('خبز') || item.item.includes('طعام')) {
      p.hunger_days = 0;
      p.hp_current = Math.min(p.hp_max, p.hp_current + 15);
    } else if (item.item.includes('عشبة') || item.item.includes('ضماد')) {
      p.hp_current = Math.min(p.hp_max, p.hp_current + 20);
      p.ap_current = Math.min(p.ap_max, p.ap_current + 10);
    }

    p.inventory[itemIndex].qty -= 1;

    // Completely remove from inventory if quantity reached zero!
    if (p.inventory[itemIndex].qty <= 0) {
      p.inventory.splice(itemIndex, 1);
    }

    p.carry_weight_current = Number(p.inventory.reduce((sum, i) => sum + (i.weight || 0.1) * (i.qty || 1), 0).toFixed(2));

    setGameState(updated);
    saveCurrentGame(updated, messages);
    soundEngine.playClick();
  };

  // Drop item — removes completely from inventory
  const handleDropItem = (item: InventoryItem) => {
    const updated = { ...gameState };
    updated.player.inventory = updated.player.inventory.filter(i => (i.id ? i.id !== item.id : i.item !== item.item));
    updated.player.carry_weight_current = Number(updated.player.inventory.reduce((sum, i) => sum + (i.weight || 0.1) * (i.qty || 1), 0).toFixed(2));
    setGameState(updated);
    saveCurrentGame(updated, messages);
    soundEngine.playClick();
  };

  // Murim Sect Joining & Rank Promotion handlers
  const handleJoinFaction = (faction: Faction, initialRank: string) => {
    const updated = { ...gameState };
    updated.player.faction_id = faction.id;
    updated.player.faction_name = faction.name;
    updated.player.faction_rank = initialRank;
    updated.player.faction_contributions = 0;

    setGameState(updated);
    saveCurrentGame(updated, messages);
    handleSendMessage(`أعلنت انضمامي إلى طائفة المرويم "${faction.name}" واجتزت اختبار القبول بنجاح لأصبح برتبة [${initialRank}].`);
  };

  const handlePromoteFactionRank = (faction: Faction, nextRank: string) => {
    const updated = { ...gameState };
    updated.player.faction_rank = nextRank;
    setGameState(updated);
    saveCurrentGame(updated, messages);
    handleSendMessage(`تقدمت في صفوف طائفة "${faction.name}" وحصلت على ترقية رسمية إلى رتبة [${nextRank}].`);
  };

  const handleLeaveFaction = () => {
    const sectName = gameState.player.faction_name;
    const updated = { ...gameState };
    updated.player.faction_id = undefined;
    updated.player.faction_name = undefined;
    updated.player.faction_rank = undefined;
    updated.player.faction_contributions = 0;

    setGameState(updated);
    saveCurrentGame(updated, messages);
    handleSendMessage(`أعلنت مغادرتي وانفصالي رسمياً عن طائفة "${sectName || 'السابقة'}".`);
  };

  const handleAttemptBreakthrough = () => {
    const updated = { ...gameState };
    const p = updated.player;
    const rankData = getRankData(p.level);
    if (p.xp >= rankData.xpNeeded && p.level < 150) {
      p.xp -= rankData.xpNeeded;
      p.level += 1;
      p.strength += 2;
      p.base_damage += 2;
      p.hp_max += 10;
      p.hp_current = p.hp_max;
      p.ap_current = p.ap_max;
      p.rank = getRankData(p.level).display;
      soundEngine.playVictoryChime();
      setGameState(updated);
      saveCurrentGame(updated, messages);
      setShowStatus(false);
      handleSendMessage(`أتممت بنجاح اختبار صقل واختراق المستوى وارتقيت إلى المستوى ${p.level} برتبة "${p.rank}". تدفقت طاقة التشي في عروقي وتضاعفت قدراتي الجسدية.`);
    }
  };

  const handleTravelToSect = (landmarkName: string) => {
    setShowPolitics(false);
    handleStartTravel(landmarkName, 'horse');
  };

  // Save Slots management
  const handleSwitchSlot = (slotId: string) => {
    const savedStateRaw = localStorage.getItem(`grim_soil_${slotId}_state`);
    const savedMsgsRaw = localStorage.getItem(`grim_soil_${slotId}_msgs`);

    if (savedStateRaw) {
      setActiveSlotId(slotId);
      localStorage.setItem(ACTIVE_SLOT_KEY, slotId);
      const parsed: GameState = JSON.parse(savedStateRaw);
      let msgs: ChatMessage[] = savedMsgsRaw ? JSON.parse(savedMsgsRaw) : [];
      if (msgs.length === 0) {
        msgs = [generateIntroMessage(parsed.player.current_landmark, parsed.location.region)];
      }
      setGameState(parsed);
      setMessages(msgs);
      setShowSaves(false);
    } else {
      // Empty slot: Prompt user to choose their starting home & see narrative intro
      setShowSaves(false);
      setPendingSlotId(slotId);
      setShowSpawnModal(true);
    }
  };

  const handleDeleteSlot = (slotId: string) => {
    const slotsRaw = localStorage.getItem(SLOTS_LIST_KEY);
    if (!slotsRaw) return;
    let slots: SaveSlotMeta[] = JSON.parse(slotsRaw);
    slots = slots.filter(s => s.id !== slotId);
    localStorage.setItem(SLOTS_LIST_KEY, JSON.stringify(slots));
    localStorage.removeItem(`grim_soil_${slotId}_state`);
    localStorage.removeItem(`grim_soil_${slotId}_msgs`);

    if (activeSlotId === slotId && slots.length > 0) {
      handleSwitchSlot(slots[0].id);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
      gameState,
      messages
    }, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `grim_soil_save_day_${gameState.world_state.day}.json`);
    dlAnchorElem.click();
  };

  const handleImportJson = (jsonString: string) => {
    const parsed = JSON.parse(jsonString);
    if (parsed.gameState && parsed.gameState.player) {
      setGameState(parsed.gameState);
      let importedMsgs = parsed.messages || [];
      if (importedMsgs.length === 0) {
        importedMsgs = [generateIntroMessage(parsed.gameState.player.current_landmark, parsed.gameState.location.region)];
      }
      setMessages(importedMsgs);
      saveCurrentGame(parsed.gameState, importedMsgs);
      soundEngine.playVictoryChime();
    }
  };

  // Title Screen view
  if (!inGame) {
    const hasExistingSave = Boolean(localStorage.getItem(`grim_soil_${activeSlotId}_state`));
    return (
      <TitleScreen
        hasExistingSave={hasExistingSave}
        onStartNewGame={handleStartNewGame}
        onContinueGame={handleContinueGame}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col bg-[#070709] text-[#c8b8a0] overflow-hidden font-sans select-none">
      {/* Top Header */}
      <Header
        gameState={gameState}
        onOpenMap={() => setShowMap(true)}
        onOpenStatus={() => setShowStatus(true)}
        onOpenInventory={() => setShowInventory(true)}
        onOpenPolitics={() => setShowPolitics(true)}
        onOpenSaves={() => setShowSaves(true)}
        onRequestNewGame={() => setShowSpawnModal(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Narrative Area */}
      <ChatView
        messages={messages}
        isGenerating={isGenerating}
        onSendMessage={handleSendMessage}
        onUndoLastTurn={handleUndoLastTurn}
        hasUndo={Boolean(turnSnapshot)}
      />

      {/* Modals */}
      {showMap && (
        <WorldMapModal
          currentLandmark={gameState.player.current_landmark}
          onClose={() => setShowMap(false)}
          onStartTravel={handleStartTravel}
        />
      )}

      {showStatus && (
        <StatusModal
          player={gameState.player}
          onClose={() => setShowStatus(false)}
          onOpenTradeScale={() => setShowTradeScale(true)}
          onAttemptBreakthrough={handleAttemptBreakthrough}
        />
      )}

      {showInventory && (
        <InventoryModal
          player={gameState.player}
          onClose={() => setShowInventory(false)}
          onEquipItem={handleEquipItem}
          onUseItem={handleUseItem}
          onDropItem={handleDropItem}
          onOpenTradeScale={() => setShowTradeScale(true)}
        />
      )}

      {showPolitics && (
        <PoliticsModal
          politics={gameState.politics}
          factions={gameState.factions}
          player={gameState.player}
          onClose={() => setShowPolitics(false)}
          onJoinFaction={handleJoinFaction}
          onPromoteFactionRank={handlePromoteFactionRank}
          onLeaveFaction={handleLeaveFaction}
          onTravelToSect={handleTravelToSect}
        />
      )}

      {showTradeScale && (
        <TradeScaleModal
          onClose={() => setShowTradeScale(false)}
        />
      )}

      {showSaves && (
        <SaveSlotsModal
          currentSlotId={activeSlotId}
          currentGameState={gameState}
          hasUndoSnapshot={Boolean(turnSnapshot)}
          onClose={() => setShowSaves(false)}
          onSwitchSlot={handleSwitchSlot}
          onRequestNewSlot={() => {
            setShowSaves(false);
            setShowSpawnModal(true);
          }}
          onDeleteSlot={handleDeleteSlot}
          onUndoLastTurn={handleUndoLastTurn}
          onExportJson={handleExportJson}
          onImportJson={handleImportJson}
        />
      )}

      {/* Spawn Selector for New Slot */}
      {showSpawnModal && (
        <SpawnModal
          isOpen={showSpawnModal}
          onClose={() => setShowSpawnModal(false)}
          onSelectSpawn={handleCreateNewSlotWithSpawn}
          title="تخزينة جديدة: اختر موطن البداية"
          subtitle="حدد المعقل الذي ستستيقظ فيه لبدء هذه التخزينة الجديدة:"
        />
      )}
    </div>
  );
}
