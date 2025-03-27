import { Metadata } from "next";
import { notFound } from "next/navigation";
import { NavSide } from "../../component/sidemenu";
import Footer from "../../component/footer";
import Breadcrumb from "../../component/breadcrumb";
import SHeader from "../../component/sheader";
import { Clock, Calendar } from "lucide-react";

interface MatchPlayer {
  account_id: number;
  player_slot: number;
  hero_id: number;
  item_0: number;
  item_1: number;
  item_2: number;
  item_3: number;
  item_4: number;
  item_5: number;
  kills: number;
  deaths: number;
  assists: number;
  leaver_status: number;
  last_hits: number;
  denies: number;
  gold_per_min: number;
  xp_per_min: number;
  gold_spent: number;
  hero_damage: number;
  tower_damage: number;
  hero_healing: number;
  level: number;
}

interface Match {
  match_id: number;
  radiant_win: boolean;
  start_time: number;
  duration: number;
  radiant_score: number;
  dire_score: number;
  players: MatchPlayer[];
}

type Props = {
  params: {
    matchId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

async function getMatch(matchId: string): Promise<Match> {
  const res = await fetch(`https://api.opendota.com/api/matches/${matchId}`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!res.ok) {
    throw new Error("Failed to fetch match data");
  }

  return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const matchId = params.matchId;
  
  if (!matchId) {
    return {
      title: "Invalid Match - Dota 2 Stats",
      description: "Invalid match ID provided.",
    };
  }

  try {
    const match = await getMatch(matchId);
    const matchDuration = `${Math.floor(match.duration / 60)}:${(match.duration % 60).toString().padStart(2, "0")}`;
    const winner = match.radiant_win ? "Radiant" : "Dire";
    const score = `${match.radiant_score} - ${match.dire_score}`;
    
    return {
      title: `Dota 2 Match ${match.match_id} - ${winner} Victory`,
      description: `Watch the Dota 2 match between Radiant and Dire. ${winner} won with a score of ${score} in ${matchDuration}.`,
      openGraph: {
        title: `Dota 2 Match ${match.match_id} - ${winner} Victory`,
        description: `Watch the Dota 2 match between Radiant and Dire. ${winner} won with a score of ${score} in ${matchDuration}.`,
        type: 'article',
        publishedTime: new Date(match.start_time * 1000).toISOString(),
        modifiedTime: new Date((match.start_time + match.duration) * 1000).toISOString(),
      },
      twitter: {
        card: 'summary_large_image',
        title: `Dota 2 Match ${match.match_id} - ${winner} Victory`,
        description: `Watch the Dota 2 match between Radiant and Dire. ${winner} won with a score of ${score} in ${matchDuration}.`,
      },
    };
  } catch (error) {
    return {
      title: "Match Not Found - Dota 2 Stats",
      description: "The requested match could not be found.",
    };
  }
}

export default async function MatchPage({ params }: Props) {
  try {
    const matchId = params.matchId;
    const match = await getMatch(matchId);

    return (
      <div className="flex h-screen">
        <div className='flex flex-col min-w-[49px]'>
          <NavSide />
        </div>
        <main className="flex flex-1 flex-col">
          <Breadcrumb />
          <div className='mx-auto container px-6 py-6'>
            <SHeader header={`${match.radiant_win ? "Radiant" : "Dire"} Victory`} desc={`Match ID: ${match.match_id}`} />
            <div className="bg-card rounded-lg shadow-lg p-6">
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
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Duration:</span>{" "}
                    <span>{Math.floor(match.duration / 60)}:{(match.duration % 60).toString().padStart(2, "0")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Start Time:</span>{" "}
                    <span>{new Date(match.start_time * 1000).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Players</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Radiant Team */}
                  <div>
                    <h3 className="text-lg font-medium text-green-500 mb-3">Radiant</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {match.players
                        .filter((player) => player.player_slot < 128)
                        .map((player) => (
                          <div
                            key={`${match.match_id}-${player.player_slot}`}
                            className="p-4 rounded-lg bg-green-500/10 border border-green-500/20"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-semibold">Player {player.player_slot + 1}</div>
                                <div className="text-sm text-muted-foreground">Hero ID: {player.hero_id}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">
                                  {player.kills}/{player.deaths}/{player.assists}
                                </div>
                                <div className="text-sm text-muted-foreground">KDA</div>
                              </div>
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">GPM:</span> {player.gold_per_min}
                              </div>
                              <div>
                                <span className="text-muted-foreground">XPM:</span> {player.xp_per_min}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Last Hits:</span> {player.last_hits}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Denies:</span> {player.denies}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Dire Team */}
                  <div>
                    <h3 className="text-lg font-medium text-red-500 mb-3">Dire</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {match.players
                        .filter((player) => player.player_slot >= 128)
                        .map((player) => (
                          <div
                            key={`${match.match_id}-${player.player_slot}`}
                            className="p-4 rounded-lg bg-red-500/10 border border-red-500/20"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-semibold">Player {(player.player_slot % 128) + 1}</div>
                                <div className="text-sm text-muted-foreground">Hero ID: {player.hero_id}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">
                                  {player.kills}/{player.deaths}/{player.assists}
                                </div>
                                <div className="text-sm text-muted-foreground">KDA</div>
                              </div>
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">GPM:</span> {player.gold_per_min}
                              </div>
                              <div>
                                <span className="text-muted-foreground">XPM:</span> {player.xp_per_min}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Last Hits:</span> {player.last_hits}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Denies:</span> {player.denies}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </main>
      </div>
    );
  } catch (error) {
    notFound();
  }
} 