import React from 'react';
import Icon from "@/public/svg/icon";
import { CustomItemGrid } from './ItemDisplay';

interface PlayerCardProps {
  player: any;
  heroNameMap: Map<number, { name: string; img: string }>;
  itemNameMap: Map<number, { id: number; name: string; img: string }>;
  expandedPlayerId: number | null;
  togglePlayerExpand: (playerId: number) => void;
}

// Extract player items into array
const getPlayerItems = (player: any) => {
  return [
    player.item_0,
    player.item_1,
    player.item_2,
    player.item_3,
    player.item_4,
    player.item_5
  ].filter(item => item !== undefined && item !== 0);
};

// Extract player backpack items into array
const getPlayerBackpack = (player: any) => {
  return [
    player.backpack_0,
    player.backpack_1,
    player.backpack_2
  ].filter(item => item !== undefined && item !== 0);
};

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  heroNameMap,
  itemNameMap,
  expandedPlayerId,
  togglePlayerExpand
}) => {
  const heroInfo = heroNameMap.get(player.hero_id);
  const playerItems = getPlayerItems(player);
  const playerBackpack = getPlayerBackpack(player);

  return (
    <button
      className="flex flex-col bg-black/50 p-2 rounded-lg mb-2 cursor-pointer hover:bg-black/80 transition-colors"
      onClick={() => togglePlayerExpand(player.account_id)}
      type="button"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/icons/${player.hero_id}.png`}
            alt={heroInfo?.name || `Hero ${player.hero_id}`}
            className="w-8 h-8 rounded-full mr-2"
            loading="lazy"
          />
<div className="flex flex-row items-center justify-between gap-8 px-4">
    <div>
  <span className="text-white">{player.personaname || player.account_id || heroInfo?.name}</span>
    </div>
    <div className='hidden sm:block'>
<CustomItemGrid
  items={playerItems}
  itemNameMap={itemNameMap}
  className="p-2"
  itemSize="md"
  gap="gap-2"
/>
    </div>
</div>
        </div>
        <Icon
          name={expandedPlayerId === player.account_id === player.hero_id ? 'chevronUp' : 'chevronDown'}
          className="w-5 h-5 text-gray-300 fill-current"
        />
      </div>

      {/* Expanded content */}
      {expandedPlayerId === player.account_id && (
        <div className="mt-2 pt-2 border-t border-gray-600 text-gray-300">
          <p className='font-bold'>{heroInfo?.name}</p>
          <div>
            <p className="text-sm">
              Prediction:
              <span className={player.pred_vict === 'true' ? 'text-green-400' : 'text-red-400'}>
                {player.pred_vict === 'true' ? ' Yes' : ' No'}
              </span>
            </p>
          </div>
        <p>stats:</p>
          <div className="grid grid-cols-2 gap-2 bg-black text-white border  pt-2">
            <div>
              <p className="text-sm">KDA : {player.kills}/{player.deaths}/{player.assists}</p>
              <p className="text-sm">LH/DN: {player.last_hits}/{player.denies}</p>
            <p className="text-sm">GPM: {player.gold_per_min}</p>
              <p className="text-sm">XPM: {player.xp_per_min}</p>
            </div>
            <div>
              <p className="text-sm">Damage to Hero: {player.hero_damage}</p>
              <p className="text-sm">Damage to Tower/building: {player.tower_damage}</p>
              <p className="text-sm">Healing to Team: {player.hero_healing}</p>
            </div>
          </div>

          <div className="mt-3">
            <h5 className="text-sm font-medium mb-1">
                <Icon name='boxitem' className='w-5 h-5 fill-current text-white inline-block mr-1' />
                Items</h5>
            <CustomItemGrid
  items={playerItems}
  itemNameMap={itemNameMap}
    itemSize="xxl"
  gap="gap-2"
/>
          </div>

          {playerBackpack.length > 0 && (
            <div className="mt-3">
              <h5 className="text-sm font-medium mb-1">
                <Icon name='Backpack' className='w-5 h-5 fill-current text-white inline-block mr-1' />
                Backpack</h5>
              <CustomItemGrid items={playerBackpack} itemNameMap={itemNameMap} />
            </div>
          )}

{player.item_neutral !== undefined && (
  <div className="mt-3">
    <h5 className="text-sm font-medium mb-1">Neutral Item</h5>
    <div className="flex">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-12 h-12 flex items-center justify-center">
        {itemNameMap.get(player.item_neutral) ? (
          <img
            src={`https://cdn.cloudflare.steamstatic.com/${itemNameMap.get(player.item_neutral)?.img}`}
            alt={itemNameMap.get(player.item_neutral)?.name}
            className="w-10 h-10 object-contain rounded-md"
            loading="lazy"
          />
        ) : (
          <div className="w-10 h-10 flex items-center justify-center text-xs text-gray-400 bg-gray-800 rounded-md">
            {player.item_neutral === 0 ? "None" : `Item ${player.item_neutral}`}
          </div>
        )}
      </div>
    </div>
  </div>
)}
        </div>
      )}
    </button>
  );
};

export default PlayerCard;
