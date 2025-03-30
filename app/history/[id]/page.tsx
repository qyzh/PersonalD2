import Breadcrumb from '@/app/component/breadcrumb'
import { NavSide } from '@/app/component/sidemenu'
import { notFound } from 'next/navigation'
import dataitem from '@/app/data/item/item_ID.json';
import itemDetails from '@/app/data/item/itemDetail.json';
import React from 'react';
interface HeroInfo {
    name: string;
    img: string;
}
interface ItemInfo {
    id: number;
    name: string;
    img: string;
}

// 1. Add proper type for player
interface Player {
  last_hits: number;
  denies: number;
  player_slot: number
  personaname: string
  hero_id: number
  level: number
  kills: number
  deaths: number
  assists: number
  gold_per_min: number
  xp_per_min: number
  item_0: number
  item_1: number
  item_2: number
  item_3: number
  item_4: number
  item_5: number
  item_neutral: number  // neutral item
  backpack_0: number
  backpack_1: number
  backpack_2: number
  hero_damage: number
  tower_damage: number
  hero_healing: number
}

// First, update the interface to include bans
interface MatchData {
  match_id: number
  radiant_win: boolean
  duration: number
  game_mode: number
  radiant_score: number
  dire_score: number
  picks_bans: {
    hero_id: number
    team: number // 0 for radiant, 1 for dire
    is_pick: boolean
    order: number
  }[]
  players: Player[]
}

async function getMatchData(matchId: string) {
  try {
    const [response, heroNameResponse] = await Promise.all([
      fetch(`https://api.opendota.com/api/matches/${matchId}?significant=0`, {
        next: { revalidate: 3600 }
      }),
      fetch(`https://dummyjson.com/c/be13-4e90-42b4-90b1`)
    ]);

    if (!heroNameResponse.ok) throw new Error('Failed to fetch hero names');
    const heroNameData = await heroNameResponse.json();
    if (!Array.isArray(heroNameData)) throw new Error('Invalid hero data format');

    // Process hero data
    const heroNameMap = new Map<number, HeroInfo>();
    heroNameData.forEach((hero) => {
        if (hero?.id && hero.localized_name && hero.img) {
            heroNameMap.set(hero.id, { 
                name: hero.localized_name, 
                img: hero.img 
            });
        }
    });

    // Process item data
    const itemNameMap = new Map<number, ItemInfo>();
    Object.entries(dataitem).forEach(([key, value]) => {
        const id = typeof value === "number" ? value : parseInt(key);
        if (id === 0) return;
        
        const name = typeof value === 'string' ? value : `Item ${key}`;
        const itemDetail = Object.values(itemDetails).find(
            (item) => parseInt(item.id.toString()) === id
        );
        
        if (itemDetail?.img) {
            itemNameMap.set(id, {
                id,
                name,
                img: itemDetail.img
            });
        }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch match data')
    }

    const matchData = await response.json()
    return { matchData, itemNameMap, heroNameMap }
  } catch (error) {
    console.error('Error fetching match data:', error)
    return null
  }
}

// Update ItemGrid for better mobile display
const ItemGrid: React.FC<{ 
    items: number[]; 
    backpackItems: number[]; 
    neutralItem: number;
    itemNameMap: Map<number, ItemInfo> 
}> = React.memo(
    ({ items, backpackItems, neutralItem, itemNameMap }) => (
        <div className='flex gap-1'>
            {/* Main items */}
            <div className='grid grid-cols-3 grid-rows-2 gap-0.5'>
                {items.map((itemId: number, index: number) => {
                    const itemInfo = itemNameMap.get(itemId);
                    return (
                        <div key={index} className="w-7 h-7 rounded bg-black/50 flex items-center justify-center">
                            {itemInfo && (
                                <img 
                                    src={`https://cdn.cloudflare.steamstatic.com/${itemInfo.img}`} 
                                    alt={itemInfo.name} 
                                    className='w-full h-full object-contain'
                                    loading="lazy"
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Neutral item */}
            <div className="flex items-center self-center">
                <div className="w-7 h-7 rounded bg-purple-900/50 flex items-center justify-center">
                    {neutralItem > 0 && itemNameMap.get(neutralItem) && (
                        <img 
                            src={`https://cdn.cloudflare.steamstatic.com/${itemNameMap.get(neutralItem)?.img}`} 
                            alt={itemNameMap.get(neutralItem)?.name} 
                            className='w-full h-full object-contain'
                            loading="lazy"
                        />
                    )}
                </div>
            </div>

            {/* Backpack items */}
            <div className='grid grid-rows-3 gap-0.5'>
                {backpackItems.map((itemId: number, index: number) => {
                    const itemInfo = itemNameMap.get(itemId);
                    return (
                        <div key={`backpack-${index}`} className="w-7 h-7 rounded bg-black/50 flex items-center justify-center">
                            {itemInfo && (
                                <img 
                                    src={`https://cdn.cloudflare.steamstatic.com/${itemInfo.img}`} 
                                    alt={itemInfo.name} 
                                    className='w-full h-full object-contain'
                                    loading="lazy"
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    )
);

// First update the PlayerCard component to match the table layout
const PlayerCard = React.memo(({ 
  player, 
  itemNameMap, 
  heroNameMap,
  duration
}: { 
  player: Player, 
  itemNameMap: Map<number, ItemInfo>,
  heroNameMap: Map<number, HeroInfo>,
  duration: number
}) => {
  const playerItems = [
    player.item_0, player.item_1, player.item_2,
    player.item_3, player.item_4, player.item_5
  ]
  const backpackItems = [
    player.backpack_0, player.backpack_1, player.backpack_2
  ]
  const heroInfo = heroNameMap.get(player.hero_id)

  return (
    <div className="grid grid-cols-[2fr,0.5fr,1fr,1fr,1fr,1fr,1fr,2fr] items-center gap-2 p-2 hover:bg-muted/50 rounded">
      {/* Player & Hero */}
      <div className="flex items-center gap-2">
        {heroInfo && (
          <img 
            src={`https://cdn.cloudflare.steamstatic.com/${heroInfo.img}`}
            alt={heroInfo.name}
            className="w-12 h-12 rounded object-cover"
            loading="lazy"
          />
        )}
        <div>
          <p className="font-medium text-sm">{player.personaname || 'Anonymous'}</p>
          <p className="text-xs text-muted-foreground">{heroInfo?.name || `Unknown (${player.hero_id})`}</p>
        </div>
      </div>

      {/* Level */}
      <div className="text-center">
        <span className="text-sm">{player.level}</span>
      </div>

      {/* K/D/A */}
      <div className="text-center">
        <span className="text-sm">
          <span className="text-green-500">{player.kills}</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-red-500">{player.deaths}</span>
          <span className="text-muted-foreground">/</span>
          <span>{player.assists}</span>
        </span>
      </div>

      {/* LH/DN */}
      <div className="text-center">
        <span className="text-sm">{player.last_hits}/{player.denies}</span>
      </div>

      {/* NET - now using passed duration */}
      <div className="text-center text-yellow-500">
        <span className="text-sm">{((player.gold_per_min * duration) / 60000).toFixed(1)}k</span>
      </div>

      {/* GPM/XPM */}
      <div className="text-center">
        <span className="text-sm">{player.gold_per_min}/{player.xp_per_min}</span>
      </div>

      {/* DMG column */}
      <div className="text-center flex flex-col">
        <span className="text-sm text-muted-foreground">{(player.hero_damage / 1000).toFixed(1)}k</span>
        <span className="text-sm text-muted-foreground">{(player.tower_damage / 1000).toFixed(1)}k</span>
        <span className="text-sm text-muted-foreground">
          {player.hero_healing > 0 ? `${(player.hero_healing / 1000).toFixed(1)}k` : '-'}
        </span>
      </div>

      {/* Items */}
      <div>
        <ItemGrid 
          items={playerItems} 
          backpackItems={backpackItems}
          neutralItem={player.item_neutral}
          itemNameMap={itemNameMap} 
        />
      </div>
    </div>
  )
})

// Update the team section layout
const TeamSection = ({ 
  title, 
  players, 
  itemNameMap, 
  heroNameMap, 
  isWinner,
  duration 
}: { 
  title: string, 
  players: Player[], 
  itemNameMap: Map<number, ItemInfo>,
  heroNameMap: Map<number, HeroInfo>,
  isWinner: boolean,
  duration: number
}) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2 mb-2">
      <h3 className={`text-base font-medium ${title === 'Radiant' ? 'text-green-500' : 'text-red-500'}`}>
        {title} {isWinner && <span className="text-yellow-500 text-sm">WINNER</span>}
      </h3>
    </div>
    {/* Header */}
    <div className="grid grid-cols-[2fr,0.5fr,1fr,1fr,1fr,1fr,1fr,2fr] gap-2 px-2 py-1 text-xs text-muted-foreground">
      <div>PLAYER</div>
      <div className="text-center">LVL</div>
      <div className="text-center">K/D/A</div>
      <div className="text-center">LH/DN</div>
      <div className="text-center">NET</div>
      <div className="text-center">GPM/XPM</div>
      <div className="text-center flex flex-col">
        <div>HD</div>
        <div>TD</div>
        <div>HH</div>
      </div>
      <div>ITEMS</div>
    </div>
    {/* Players */}
    <div className="space-y-0.5">
      {players.map((player: Player) => (
        <PlayerCard 
          key={player.player_slot}
          player={player}
          itemNameMap={itemNameMap}
          heroNameMap={heroNameMap}
          duration={duration}
        />
      ))}
    </div>
  </div>
)

// First, let's add a helper function to separate players by team
const separatePlayersByTeam = (players: Player[]) => {
  return {
    radiant: players.filter(player => player.player_slot < 128),
    dire: players.filter(player => player.player_slot >= 128)
  }
}

// Add the BanSection component
const BanSection = ({ 
  bans, 
  heroNameMap 
}: { 
  bans: { hero_id: number, team: number }[], 
  heroNameMap: Map<number, HeroInfo> 
}) => {
  const radiantBans = bans.filter(ban => ban.team === 0)
  const direBans = bans.filter(ban => ban.team === 1)

  const BanList = ({ bans, teamClass }: { bans: typeof radiantBans, teamClass: string }) => (
    <div className="space-y-2">
      <div className={`text-sm font-medium ${teamClass}`}>
        {teamClass.includes('green') ? 'Radiant' : 'Dire'} Bans
      </div>
      <div className="flex gap-1">
        {bans.map((ban, index) => {
          const hero = heroNameMap.get(ban.hero_id)
          return hero ? (
            <div key={index} className="relative w-10 h-10">
              <img
                src={`https://cdn.cloudflare.steamstatic.com/${hero.img}`}
                alt={hero.name}
                className="w-full h-full rounded object-cover opacity-50"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-0.5 bg-red-500 rotate-45 transform origin-center" />
              </div>
            </div>
          ) : null
        })}
      </div>
    </div>
  )

  return (
    <div className='bg-card border border-border p-4 rounded-lg w-full max-w-2xl mx-auto'>
      <h3 className="text-base font-medium mb-4">Banned Heroes</h3>
      <div className='grid grid-cols-2 gap-4'>
        <BanList bans={radiantBans} teamClass="text-green-500" />
        <BanList bans={direBans} teamClass="text-red-500" />
      </div>
    </div>
  )
}

export default async function MatchDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const data = await getMatchData(id)

  if (!data) {
    notFound()
  }

  const { matchData, itemNameMap, heroNameMap } = data
  const { radiant, dire } = separatePlayersByTeam(matchData.players)
  
  // Filter bans from picks_bans
  const bans = matchData.picks_bans?.filter((pb: { hero_id: number, team: number, is_pick: boolean }) => !pb.is_pick) || []

  return (
    <div className="flex min-h-screen">
      <div className='hidden sm:flex flex-col min-w-[49px]'>
        <NavSide />
      </div>
      <main className="flex flex-1 flex-col">
        <Breadcrumb />
        <div className='px-4 sm:px-6 py-4 sm:py-6'>
          <h1 className="text-xl sm:text-2xl font-bold mb-4">Match {id}</h1>
          
          <div className="grid gap-4">
            {/* Match Overview */}
            <div className="rounded-lg bg-card p-4">
              <h2 className="text-lg sm:text-xl font-semibold mb-3">Match Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <p className="text-sm sm:text-base">Match ID: {matchData.match_id}</p>
                  <p className="text-sm sm:text-base">Duration: {Math.floor(matchData.duration / 60)}:{(matchData.duration % 60).toString().padStart(2, '0')}</p>
                  <p className="text-sm sm:text-base">Game Mode: {matchData.game_mode}</p>
                </div>
                <div className="space-y-2">
                  
                </div>
              </div>
            </div>

            {/* Players - Updated to grid layout */}
            <div className="rounded-lg bg-card p-4">
              <div className="flex justify-center items-center gap-4 mb-6">
                <div className="text-4xl font-bold text-green-500">{matchData.radiant_score}</div>
                <div className="text-2xl font-bold text-muted-foreground">-</div>
                <div className="text-4xl font-bold text-red-500">{matchData.dire_score}</div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TeamSection 
                  title="Radiant" 
                  players={radiant} 
                  itemNameMap={itemNameMap}
                  heroNameMap={heroNameMap}
                  isWinner={matchData.radiant_win}
                  duration={matchData.duration}
                />
                <TeamSection 
                  title="Dire" 
                  players={dire} 
                  itemNameMap={itemNameMap}
                  heroNameMap={heroNameMap}
                  isWinner={!matchData.radiant_win}
                  duration={matchData.duration}
                />
              </div>
              <div className='flex items-center gap-4 mb-6'>
                <div className='bg-card border border-border p-4 rounded-lg'>
                    <div className='grid grid-cols-1 gap-2'>
                        <div>
                            {matchData.picks_bans?.map((pb: { hero_id: number, team: number, is_pick: boolean, order: number }) => {
                                const hero = heroNameMap.get(pb.hero_id)
                                return (
                                    <div key={pb.hero_id} className={`${pb.is_pick ? 'text-red-500' : 'text-green-500'}`}>
                                        {hero?.name || `Unknown (${pb.hero_id})`} {' '}
                                        <span className={pb.team === 0 ? 'text-green-500' : 'text-red-500'}>
                                            {pb.team === 0 ? 'Radiant' : 'Dire'}
                                        </span>
                                        {' '}{pb.is_pick ? 'Pick' : 'Ban'} {pb.order}
                                    </div>
                                )
                            })}
                        </div>
                        <div>

                        </div>
                    </div>
                </div>
              </div>

              {/* Bans section */}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
