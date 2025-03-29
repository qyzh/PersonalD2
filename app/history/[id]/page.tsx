import Breadcrumb from "../../component/breadcrumb"
import Footer from "../../component/footer"
import SHeader from "../../component/sheader"
import { NavSide } from "../../component/sidemenu"
import { Card, CardContent, CardHeader, CardTitle } from "../../component/ui/Card"
import { Badge } from "../../component/ui/Badge"
import { formatDuration } from "../../../lib/utils"

async function getMatchDetails(matchId: string) {
  const res = await fetch(`https://api.opendota.com/api/matches/${matchId}`, {
    next: { revalidate: 3600 } // Cache for 1 hour
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch match details')
  }

  return res.json()
}

export default async function Match({ params }: { params: { id: string } }) {
  const { id } = await params
  const match = await getMatchDetails(id)

  return (
    <div className="flex h-screen">
      <div className='flex flex-col min-w-[49px]'>
        <NavSide />
      </div>
      <main className="flex flex-1 flex-col">
        <Breadcrumb />
        <div className='mx-auto container px-6 py-6'>
          <SHeader 
            header={`Match #${match.match_id}`} 
            desc={`${formatDuration(match.duration)} • ${new Date(match.start_time * 1000).toLocaleDateString()}`} 
          />
          
          <div className="grid gap-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Match Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Radiant Victory</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant={match.radiant_win ? "default" : "destructive"}>
                        {match.radiant_win ? "Victory" : "Defeat"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Game Mode</h3>
                    <p>{match.game_mode}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Radiant</h3>
                    <p>Kills: {match.radiant_score}</p>
                    <p>Towers: {match.tower_status_radiant}</p>
                    <p>Barracks: {match.barracks_status_radiant}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Dire</h3>
                    <p>Kills: {match.dire_score}</p>
                    <p>Towers: {match.tower_status_dire}</p>
                    <p>Barracks: {match.barracks_status_dire}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Player Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  {/* Radiant Team */}
                  <div>
                    <h3 className="font-semibold text-green-600 mb-4">Radiant {match.radiant_win ? '(Winner)' : ''}</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Hero</th>
                            <th className="text-left p-2">Player</th>
                            <th className="text-center p-2">K/D/A</th>
                            <th className="text-center p-2">GPM/XPM</th>
                          </tr>
                        </thead>
                        <tbody>
                          {match.players.slice(0, 5).map((player: any, index: number) => (
                            <tr key={index} className="border-b hover:bg-green-50">
                              <td className="p-2">
                                <div className="flex items-center gap-2">
                                  <img 
                                    src={`https://cdn.dota2.com/apps/dota2/images/heroes/${player.hero_id}.png`} 
                                    alt="Hero" 
                                    className="w-10 h-10 rounded"
                                  />
                                  <div className="flex gap-1">
                                    {[player.item_0, player.item_1, player.item_2].map((itemId, idx) => (
                                      itemId ? (
                                        <img 
                                          key={idx}
                                          src={`https://cdn.dota2.com/apps/dota2/images/items/${itemId}.png`}
                                          alt="Item"
                                          className="w-6 h-6"
                                        />
                                      ) : null
                                    ))}
                                  </div>
                                </div>
                                <div className="flex gap-1 mt-1">
                                  {[player.item_3, player.item_4, player.item_5].map((itemId, idx) => (
                                    itemId ? (
                                      <img 
                                        key={idx}
                                        src={`https://cdn.dota2.com/apps/dota2/images/items/${itemId}.png`}
                                        alt="Item"
                                        className="w-6 h-6"
                                      />
                                    ) : null
                                  ))}
                                </div>
                              </td>
                              <td className="p-2">
                                <div>{player.personaname || 'Anonymous'}</div>
                                <div className="text-sm text-gray-500">Lane {player.lane_role || '-'}</div>
                              </td>
                              <td className="text-center p-2">
                                <div className="font-medium">{player.kills}/{player.deaths}/{player.assists}</div>
                              </td>
                              <td className="text-center p-2">
                                <div>{player.gold_per_min}</div>
                                <div>{player.xp_per_min}</div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Dire Team */}
                  <div>
                    <h3 className="font-semibold text-red-600 mb-4">Dire {!match.radiant_win ? '(Winner)' : ''}</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Hero</th>
                            <th className="text-left p-2">Player</th>
                            <th className="text-center p-2">K/D/A</th>
                            <th className="text-center p-2">GPM/XPM</th>
                          </tr>
                        </thead>
                        <tbody>
                          {match.players.slice(5, 10).map((player: any, index: number) => (
                            <tr key={index} className="border-b hover:bg-red-50">
                              <td className="p-2">
                                <div className="flex items-center gap-2">
                                  <img 
                                    src={`https://cdn.dota2.com/apps/dota2/images/heroes/${player.hero_id}.png`} 
                                    alt="Hero" 
                                    className="w-10 h-10 rounded"
                                  />
                                  <div className="flex gap-1">
                                    {[player.item_0, player.item_1, player.item_2].map((itemId, idx) => (
                                      itemId ? (
                                        <img 
                                          key={idx}
                                          src={`https://cdn.dota2.com/apps/dota2/images/items/${itemId}.png`}
                                          alt="Item"
                                          className="w-6 h-6"
                                        />
                                      ) : null
                                    ))}
                                  </div>
                                </div>
                                <div className="flex gap-1 mt-1">
                                  {[player.item_3, player.item_4, player.item_5].map((itemId, idx) => (
                                    itemId ? (
                                      <img 
                                        key={idx}
                                        src={`https://cdn.dota2.com/apps/dota2/images/items/${itemId}.png`}
                                        alt="Item"
                                        className="w-6 h-6"
                                      />
                                    ) : null
                                  ))}
                                </div>
                              </td>
                              <td className="p-2">
                                <div>{player.personaname || 'Anonymous'}</div>
                                <div className="text-sm text-gray-500">Lane {player.lane_role || '-'}</div>
                              </td>
                              <td className="text-center p-2">
                                <div className="font-medium">{player.kills}/{player.deaths}/{player.assists}</div>
                              </td>
                              <td className="text-center p-2">
                                <div>{player.gold_per_min}</div>
                                <div>{player.xp_per_min}</div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  )
}   