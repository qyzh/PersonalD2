import React from 'react';

interface DraftProps {
  picks_bans: {
    order: number;
    hero_id: number;
    is_pick: boolean;
    team: number;
  }[];
  heroNameMap: Map<number, { name: string; img: string }>;
}

const DraftSection: React.FC<DraftProps> = ({ picks_bans, heroNameMap }) => {
  if (!picks_bans || picks_bans.length === 0) {
    return null;
  }

  const sortedDraft = [...picks_bans].sort((a, b) => a.order - b.order);

  return (
    <div className="mt-4 mb-4 bg-neutral-700/30 p-4 rounded-lg border-2 border-neutral-500">
      <h4 className="text-md font-medium text-neutral-400 mb-2">Draft</h4>

      {sortedDraft.map((draft, index) => {
        const heroInfo = heroNameMap.get(draft.hero_id);

        return (
          <div
            key={index}
            className={`flex items-center justify-between bg-gray-700 p-2 rounded-lg mb-2 ${!draft.is_pick ? 'opacity-75' : ''}`}
          >
            <div className="flex items-center">
              <div className={`relative ${!draft.is_pick ? 'grayscale' : ''}`}>
                <img
                  src={`https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/icons/${draft.hero_id}.png`}
                  alt={heroInfo?.name || `Hero ${draft.hero_id}`}
                  className="w-8 h-8 rounded-full mr-2"
                  loading="lazy"
                />
                {!draft.is_pick && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-red-500 transform rotate-45"></div>
                  </div>
                )}
              </div>
              <span className="text-white">{heroInfo?.name || `Hero ${draft.hero_id}`}</span>
            </div>
            <div className="flex items-center">
              <span className={`text-sm ${draft.team === 0 ? 'text-green-500' : 'text-red-500'} mr-2`}>
                {draft.team === 0 ? 'Radiant' : 'Dire'}
              </span>
              <span className={`text-sm ${draft.is_pick ? 'text-green-400' : 'text-red-400'}`}>
                {draft.is_pick ? 'Pick' : 'Ban'}
              </span>
              <span className="text-neutral-400 text-xs ml-2">
                #{draft.order + 1}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DraftSection;
