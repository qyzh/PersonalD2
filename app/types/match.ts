export interface DataMatch {
  match_id: string;
  duration: number;
  radiant_win: boolean;
  radiant_score: number;
  dire_score: number;
  teamfights?: { start: number; end: number }[];
    picks_bans?: {
        is_pick: boolean;
        order: number;
    }[];
  players?: Player[];
}

export interface Player {
  personaname: string;
  account_id: number;
  player_slot: number;
  hero_id: number;
  pred_vict: string;
  kills: number;
  deaths: number;
  assists: number;
  last_hits: number;
  denies: number;
  gold_per_min: number;
  xp_per_min: number;
  hero_damage: number;
  tower_damage: number;
  hero_healing: number;
  level: number;
  item_0?: number;
  item_1?: number;
  item_2?: number;
  item_3?: number;
  item_4?: number;
  item_5?: number;
  backpack_0?: number;
  backpack_1?: number;
  backpack_2?: number;
  neutral_item?: number;
}

export interface HeroInfo {
  name: string;
  img: string;
}

export interface ItemInfo {
  id: number;
  name: string;
  img: string;
}
