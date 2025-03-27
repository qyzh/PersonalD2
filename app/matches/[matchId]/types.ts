export interface MatchPlayer {
  account_id: number
  player_slot: number
  hero_id: number
  item_0: number
  item_1: number
  item_2: number
  item_3: number
  item_4: number
  item_5: number
  kills: number
  deaths: number
  assists: number
  leaver_status: number
  last_hits: number
  denies: number
  gold_per_min: number
  xp_per_min: number
  gold_spent: number
  hero_damage: number
  tower_damage: number
  hero_healing: number
  level: number
}

export interface Match {
  match_id: number
  radiant_win: boolean
  start_time: number
  duration: number
  radiant_score: number
  dire_score: number
  players: MatchPlayer[]
} 