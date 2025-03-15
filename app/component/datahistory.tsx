"use client";
import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/app/component/ui/Table"
import { Trophy, ShieldBan } from 'lucide-react';
import { getProfileID } from "@/app/profile/profiledata";

interface Match {
    match_id: number;
    kills: number;
    deaths: number;
    assists: number;
    hero_id: number;
    start_time: number;
    game_mode: number;
    radiant_win: boolean;
    player_slot: number;
    lobby_type: number;
}
type GameMode  = {
    id: number;
    name: string;
    forEach: (arg0: (mode: { id: number; name: string }) => void) => void;
}
type HeroName = {
    id: number;
    localized_name: string;
    primary_attr: string;
    attack_type: string;
    img: string;
    roles: string[];
}[];
const userID = await getProfileID();
const fullhistoryurl = `https://api.opendota.com/api/players/${userID}/matches?significant=0&project=duration&project=game_mode&project=lobby_type&project=start_time&project=hero_id&project=version&project=kills&project=deaths&project=assists&project=leaver_status&project=party_size&project=average_rank&project=hero_variant&project=item_0&project=item_1&project=item_2&project=item_3&project=item_4&project=item_5`;
const heroStatsUrl = 'https://dummyjson.com/c/be13-4e90-42b4-90b1';
const gameModeUrl = `https://dummyjson.com/c/3034-176f-4966-b99e`;

export default function DataHistory() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [heroNameMap, setHeroNameMap] = useState<Map<number, { name: string; img: string }>>(new Map());

    useEffect(() => {
        async function fetchMatches() {
            try {
                const response = await fetch(`${fullhistoryurl}`);
                const matches: Match[] = await response.json();
                setMatches(matches);
            } catch (error) {
                console.error('Error fetching matches:', error);
            }
        }

        async function fetchHeroNames() {
            try {
                const heroNameResponse = await fetch(`${heroStatsUrl}`);
                if (!heroNameResponse.ok) throw new Error('Failed to fetch hero names');
                const heroNameData: HeroName = await heroNameResponse.json();

                const heroNameMap = new Map<number, { name: string; img: string }>();
                heroNameData.forEach((hero) => {
                    heroNameMap.set(hero.id, { name: hero.localized_name, img: hero.img });
                });
                setHeroNameMap(heroNameMap);
            } catch (error) {
                console.error('Error fetching hero names:', error);
            }
        }

        fetchMatches();
        fetchHeroNames()
    }, []);

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString();
    };

    const [gameModeMap, setGameModeMap] = useState<Map<number, { name: string}>>(new Map());

    useEffect(() => {
        async function fetchGameModes() {
            try {
                const gameModeresponse = await fetch(`${gameModeUrl}`);
                if (!gameModeresponse.ok) throw new Error('Failed to fetch game modes');
                const gameModeData: GameMode = await gameModeresponse.json();

                const gameModeMap = new Map<number, { name: string}>();
                gameModeData.forEach((mode) => {
                    gameModeMap.set(mode.id,{ name: mode.name});
                });
                setGameModeMap(gameModeMap);
            } catch (error) {
                console.error('Error fetching game modes:', error);
            }
        }

        fetchGameModes();
    }, []);

    return (
        <div className="">
            <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Hero</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>K</TableHead>
                        <TableHead>D</TableHead>
                        <TableHead>A</TableHead>
                        <TableHead className="text-right">Match ID</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {matches.slice(0, 18).map((match) => {
                        const isRadiant = match.player_slot < 127;
                        const didWin = (isRadiant && match.radiant_win) || (!isRadiant && !match.radiant_win);
                        const BgColor = didWin
                            ? 'border-emerald-500 bg-emerald-100 px-2.5 py-0.5 text-emerald-700'
                            : 'bg-red-100 border-red-500 px-2.5 py-0.5 text-red-700';
                        const heroInfo = heroNameMap.get(match.hero_id);
                        const Game_Mode = gameModeMap.get(match.game_mode);
                        return (
                            <TableRow key={match.match_id} className={`${BgColor}`}>
                                <TableCell >
                                    <div className="flex items-center">
                                        <div className="min-w-12 h-12 pr-2 overflow-hidden object-fill">
                                            {heroInfo && (
                                                <img
                                                    src={`https://cdn.cloudflare.steamstatic.com/${heroInfo?.img}`}
                                                    alt={heroInfo.name}
                                                    className="w-full h-full object-cover rounded-sm"
                                                />
                                            )}
                                        </div>
                                        <div className="flex flex-col pr-2">
                                            <div className="">{heroInfo?.name}</div>
                                            <div className="text-sm text-zinc-400">{formatDate(match.start_time)}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{
                                    didWin ?
                                    <Trophy className="" />
                                    :
                                     <ShieldBan className="" />
                                    }
                                </TableCell>
                                <TableCell>{match.kills}</TableCell>
                                <TableCell>{match.deaths}</TableCell>
                                <TableCell>{match.assists}</TableCell>
                                <TableCell className="text-right">{match.match_id}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
