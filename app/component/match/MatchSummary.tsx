import React from 'react';
import Icon from "@/public/svg/icon";

interface MatchSummaryProps {
  matchId: string;
  duration: number;
  radiantWin: boolean;
  radiantScore: number;
  direScore: number;
  playerCount?: number;
  picks_bans: any[];
}

const MatchSummary: React.FC<MatchSummaryProps> = ({
  matchId,
  duration,
  radiantWin,
  radiantScore,
  direScore,
  picks_bans
}) => {
  return (
    <div className="flex flex-col w-full p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-white">Match {matchId}</h2>
      <div className="text-gray-300 mt-4">
        <p>Duration: {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}</p>
        <p>Result: {radiantWin ? (
            <span className="text-green-500">
              <Icon name='win' className='w-5 h-5 fill-current text-green-500 inline-block mr-1' />
              Radiant Victory
            </span>
          ) : (
            <span className='text-red-500'>
              <Icon name='win' className='w-5 h-5 fill-current inline-block mr-1' />
              Dire Victory
            </span>
          )}
        </p>
        <p>Score: {radiantScore} - {direScore}</p>
        <p>{picks_bans}</p>
      </div>
    </div>
  );
};

export default MatchSummary;
