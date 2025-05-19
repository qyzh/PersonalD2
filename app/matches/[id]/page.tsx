"use client"
import React, { useState } from 'react';
import { useParams } from "next/navigation";
import { NavSide } from "@/app/component/sidemenu";
import Breadcrumb from "@/app/component/breadcrumb";
import { useMatchData } from '@/app/hooks/useMatchData';
import MatchSummary from '@/app/component/match/MatchSummary';
import TeamSection from '@/app/component/match/TeamSection';
import DraftSection from '@/app/component/match/DraftSection';

export default function MatchDetailsPage() {
  const params = useParams();
  const matchId = params?.id as string;
  const [expandedPlayerId, setExpandedPlayerId] = useState<number | null>(null);

  const { data, loading, error, heroNameMap, itemNameMap } = useMatchData(matchId);

  const togglePlayerExpand = (playerId: number) => {
    setExpandedPlayerId(expandedPlayerId === playerId ? null : playerId);
  };

  if (loading) return <div>Loading match details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No match data found</div>;

  // Filter players by team
  const radiantPlayers = data.players?.filter(player => player.player_slot < 128) || [];
  const direPlayers = data.players?.filter(player => player.player_slot >= 128) || [];

  return (
    <div className="flex h-screen">
      <div className='flex flex-col min-w-[49px]'>
         <NavSide />
      </div>
      <main className="flex flex-1 flex-col">
        <Breadcrumb />
        <div className='mx-auto container px-6 py-6'>
          <MatchSummary
            matchId={data.match_id}
            duration={data.duration}
            radiantWin={data.radiant_win}
            radiantScore={data.radiant_score}
            direScore={data.dire_score}

                     />

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-white mb-2">Players</h3>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Radiant Team */}
            <TeamSection
              teamName="Radiant"
              players={radiantPlayers}
              heroNameMap={heroNameMap}
              itemNameMap={itemNameMap}
              expandedPlayerId={expandedPlayerId}
              togglePlayerExpand={togglePlayerExpand}
            />

            {/* Dire Team */}
            <TeamSection
              teamName="Dire"
              players={direPlayers}
              heroNameMap={heroNameMap}
              itemNameMap={itemNameMap}
              expandedPlayerId={expandedPlayerId}
              togglePlayerExpand={togglePlayerExpand}
            />
</div>
          </div>

          {/* Drafting */}
<DraftSection
  picks_bans={data && Array.isArray(data.picks_bans)
    ? data.picks_bans.filter(
        (pb): pb is { order: number; hero_id: number; is_pick: boolean; team: number } =>
          pb &&
          typeof pb.order === 'number' &&
          'hero_id' in pb && typeof pb.hero_id === 'number' &&
          typeof pb.is_pick === 'boolean' &&
          'team' in pb && typeof pb.team === 'number'
      )
    : []
  }
  heroNameMap={heroNameMap}
/>
        </div>
      </main>
    </div>
  );
}
