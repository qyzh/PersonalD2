import React from 'react';

type Player = {
  account_id: number;
  player_slot: number;
  hero_id: number;
  pred_vict?: string;
};

type PlayerListProps = {
  players: Player[];
  team: 'radiant' | 'dire';
};

export default function PlayerList({ players, team }: PlayerListProps) {
  const isRadiant = team === 'radiant';
  const bgColor = isRadiant ? 'bg-emerald-700/30' : 'bg-red-700/30';
  const borderColor = isRadiant ? 'border-emerald-500' : 'border-red-500';
  const textColor = isRadiant ? 'text-green-400' : 'text-red-400';
  const teamName = isRadiant ? 'Radiant' : 'Dire';

  const filteredPlayers = isRadiant
    ? players.filter(player => player.player_slot < 128)
    : players.filter(player => player.player_slot >= 128);

  return (
    <div className={`mb-4 ${bgColor} p-4 rounded-lg border-2 ${borderColor}`}>
      <h4 className={`text-md font-medium ${textColor} mb-2`}>{teamName}</h4>
      {filteredPlayers.map((player) => (
        <div key={player.account_id} className="flex items-center justify-between bg-gray-700 p-2 rounded-lg mb-2">
          <div className="flex items-center">
            <img
              src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/icons/${player.hero_id}.png`}
              alt={`Hero ${player.hero_id}`}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-white">{player.account_id}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
