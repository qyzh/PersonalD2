import React from 'react';
import PlayerCard from './PlayerCard';

interface TeamSectionProps {
  players: any[];
  teamName: 'Radiant' | 'Dire';
  heroNameMap: Map<number, { name: string; img: string }>;
  itemNameMap: Map<number, { id: number; name: string; img: string }>;
  expandedPlayerId: number | null;
  togglePlayerExpand: (playerId: number) => void;
}

const TeamSection: React.FC<TeamSectionProps> = ({
  players,
  teamName,
  heroNameMap,
  itemNameMap,
  expandedPlayerId,
  togglePlayerExpand
}) => {
  const isRadiant = teamName === 'Radiant';

  return (
    <div className={`mb-4 ${isRadiant ? 'bg-emerald-700/30 border-emerald-500' : 'bg-red-700/30 border-red-500'} p-4 rounded-lg border-2`}>
      <h4 className={`text-md font-medium ${isRadiant ? 'text-green-400' : 'text-red-400'} mb-2`}>
        {teamName}
      </h4>

      {players.map((player) => (
        <PlayerCard
          key={player.account_id || player.hero_id}
          player={player}
          heroNameMap={heroNameMap}
          itemNameMap={itemNameMap}
          expandedPlayerId={expandedPlayerId}
          togglePlayerExpand={togglePlayerExpand}
        />
      ))}
    </div>
  );
};

export default TeamSection;
