import { Match } from '../types'

interface MatchDetailsProps {
  match: Match
}

export function MatchDetails({ match }: MatchDetailsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="text-xl font-bold text-green-500">{match.radiant_score}</div>
          <div className="text-sm text-muted-foreground">Radiant</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-red-500">{match.dire_score}</div>
          <div className="text-sm text-muted-foreground">Dire</div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Match Details</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Duration:</span>{" "}
            <span>
              {Math.floor(match.duration / 60)}:
              {(match.duration % 60).toString().padStart(2, "0")}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Start Time:</span>{" "}
            <span>{new Date(match.start_time * 1000).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </>
  )
} 