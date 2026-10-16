export interface Currency {
  G: number; // Gold
  S: number; // Silver
  C: number; // Copper
}

export interface InventoryItem {
  id?: string;
  item: string;
  qty: number;
  weight: number;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'unique' | string;
  desc?: string;
  damage?: number;
  defense?: number;
  calories?: number;
  water?: number;
  special?: { type: string; desc: string; value?: number; chance?: number; calories?: number; water?: number } | null;
  story?: string | null;
}

export interface Skill {
  id?: string;
  name: string;
  desc: string;
  ap_cost: number;
  damage?: string;
  effects?: string[];
  xp: number;
  unlock_level?: number;
}

export interface PlayerStats {
  name: string;
  rank: string;
  level: number;
  xp: number;
  strength: number;
  base_damage: number;
  defense: number;
  hp_current: number;
  hp_max: number;
  ap_current: number;
  ap_max: number;
  m_current: number;
  m_max: number;
  s_current: number;
  s_max: number;
  weapon_equipped: string;
  armor_equipped: string;
  weapons: InventoryItem[];
  armors: InventoryItem[];
  inventory: InventoryItem[];
  currency: Currency;
  carry_weight_current: number;
  carry_weight_max: number;
  calories_current: number;
  calories_max: number;
  hydration_current: number; // 0 - 100%
  hunger_days: number;
  thirst_days: number;
  exhaustion: number;
  blood_infection: number;
  scars: string[];
  skills: Skill[];
  current_landmark: string;
  in_combat?: boolean;
  faction_id?: string;
  faction_name?: string;
  faction_rank?: string;
  faction_contributions?: number;
  faction_relations?: Record<string, number>; // Standing with each faction (-100 to +100)
  level_challenge?: string; // Breakthrough trial required for next rank/level
  level_challenge_done?: boolean;
}

export interface LocationState {
  layer: string;
  region: string;
  sub_location: string;
  environment_modifiers?: { condition: string; penalty: number }[];
}

export interface WorldState {
  day: number;
  time: string;
  threat_index: number;
  randomness_index: number;
  weather: string;
}

export interface NPC {
  id: string;
  name: string;
  rank?: string;
  level: number;
  strength?: number;
  hp?: number;
  hp_max?: number;
  location?: string;
  status?: string;
  relationship: 'friendly' | 'neutral' | 'enemy' | 'unknown';
  ethics: number; // 0 - 100
  F: number; // Friendship
  A: number; // Authority
  weapon?: { name: string; damage: number };
  armor?: { name: string; defense: number };
  player_knows?: string;
  relationship_notes?: string;
}

export interface KingdomCity {
  name: string;
  governor: string;
  garrison: number;
  pop: number;
  type: string;
}

export interface Kingdom {
  id: string;
  name: string;
  nameEn?: string;
  capital: string;
  ruler: string;
  rulerPower: number;
  general?: string;
  generalPower?: number;
  level: number;
  pop: number;
  soldiers: number;
  economy: number;
  morale: number;
  allies: string[];
  enemies: string[];
  emblem: string;
  color: string;
  powerRank?: number;
  vassalOf?: string | null;
  collapsed?: boolean;
  territories?: string[];
  kingdomCities?: KingdomCity[];
}

export interface FactionRankInfo {
  name: string;
  minLevel: number;
  perks: string;
  badge?: string;
}

export interface Faction {
  id: string;
  name: string;
  type: string;
  lordName: string;
  lordLevel: number;
  members: number;
  alignment: 'صالح' | 'محايد' | 'شرير' | string;
  emblem: string;
  zone: string;
  landmark: string;
  power: number;
  powerTrend?: number;
  status: 'active' | 'emerging' | 'destroyed';
  allies?: string[];
  enemies?: string[];
  player_standing?: number;
  events?: string[];
  minJoinLevel?: number;
  requiredAffinity?: number; // Minimum relationship score needed to join (-100 to +100)
  joinRequirements?: string;
  trialDesc?: string;
  exclusivePerk?: string;
  ranks?: FactionRankInfo[];
  description?: string;
}

export interface WarBattle {
  day: number;
  attacker: string;
  defender: string;
  atkKilled: number;
  defKilled: number;
  winner: string;
  summary: string;
}

export interface War {
  id: string;
  attacker: string;
  defender: string;
  startDay: number;
  currentDay: number;
  status: 'preparing' | 'active' | 'ended';
  preparationLeft: number;
  attackerLosses: number;
  defenderLosses: number;
  totalAttackerKilled: number;
  totalDefenderKilled: number;
  battles: WarBattle[];
  winner?: string | null;
}

export interface PoliticalEvent {
  type: string;
  day: number;
  text: string;
  icon?: string;
  color?: string;
}

export interface PoliticsState {
  empire: Kingdom;
  kingdoms: Kingdom[];
  relations: Record<string, Record<string, number>>;
  territories: Record<string, { owner: string; name: string; contested: boolean }>;
  wars: War[];
  politicalEvents: PoliticalEvent[];
  currentDay: number;
  lastSimulatedDay: number;
}

export interface StoryLogEntry {
  turn: number;
  day: number;
  text: string;
}

export interface GameState {
  version: number;
  player: PlayerStats;
  location: LocationState;
  world_state: WorldState;
  npcs: NPC[];
  quest_log: { id: string; title: string; status: 'active' | 'completed' | 'failed' }[];
  story_log: StoryLogEntry[];
  event_history: { turn: number; day: number; summary: string; outcome: string }[];
  last_5_narrative: string[];
  session_notes?: string;
  politics: PoliticsState;
  factions: Record<string, Faction>;
  faction_relations?: Record<string, Record<string, number>>;
  last_updated?: string;
}
