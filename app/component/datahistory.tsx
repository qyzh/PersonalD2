"use client";
import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/app/component/ui/Table"
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getHistoryMatchs } from "@/app/data/game/historymatch";
import { Icon } from '../public/svg/icon';
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
const heroStatsUrl = 'https://dummyjson.com/c/be13-4e90-42b4-90b1';
const gameModeUrl = `https://dummyjson.com/c/3034-176f-4966-b99e`;

export default function DataHistory() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [heroNameMap, setHeroNameMap] = useState<Map<number, { name: string; img: string }>>(new Map());
    const [currentPage, setCurrentPage] = useState(1);
    const [totalMatches, setTotalMatches] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const matchesPerPage = 10;

    // Calculate total pages based on total matches count
    const totalPages = Math.ceil(totalMatches / matchesPerPage);

    // Load matches for current page
    const loadMatchesForPage = async (page: number) => {
        setIsLoading(true);
        try {
            const response = await getHistoryMatchs(page, matchesPerPage);
            const { matches: pageMatches, total } = response;
            setMatches(pageMatches);
            setTotalMatches(total);
        } catch (error) {
            console.error('Error fetching matches:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Pagination controls
    const nextPage = () => {
        const newPage = Math.min(currentPage + 1, totalPages);
        setCurrentPage(newPage);
        loadMatchesForPage(newPage);
    };

    const prevPage = () => {
        const newPage = Math.max(currentPage - 1, 1);
        setCurrentPage(newPage);
        loadMatchesForPage(newPage);
    };

    useEffect(() => {
        loadMatchesForPage(currentPage);

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

        fetchHeroNames();
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
        <div className="w-full space-y-4 px-2 sm:px-0">
            <div className="w-full overflow-x-auto relative rounded-lg">
                {isLoading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-800"></div>
                    </div>
                )}
                <Table className="min-w-[300px] sm:min-w-[650px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[140px] sm:w-[200px] lg:w-[250px]">Hero</TableHead>
                            <TableHead className="w-[40px] sm:w-[80px]">Result</TableHead>
                            <TableHead className="w-[40px] sm:w-[60px]">K</TableHead>
                            <TableHead className="w-[40px] sm:w-[60px]">D</TableHead>
                            <TableHead className="w-[40px] sm:w-[60px]">A</TableHead>
                            <TableHead className="text-right">Match ID</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {matches.map((match) => {
                            const isRadiant = match.player_slot < 127;
                            const didWin = (isRadiant && match.radiant_win) || (!isRadiant && !match.radiant_win);
                            const heroInfo = heroNameMap.get(match.hero_id);
                            return (
                                <TableRow key={match.match_id} className={``}>
                                    <TableCell className="min-w-[140px] sm:min-w-[200px] lg:min-w-[250px]">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 flex-shrink-0">
                                                {heroInfo && (
                                                    <img
                                                        src={`https://cdn.cloudflare.steamstatic.com/${heroInfo?.img}`}
                                                        alt={heroInfo.name}
                                                        className="w-full h-full object-contain rounded-sm"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="text-xs sm:text-sm lg:text-base font-medium">{heroInfo?.name}</div>
                                                <div className="text-[10px] sm:text-xs lg:text-sm text-zinc-400">{formatDate(match.start_time)}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="w-[40px] sm:w-[80px]">{
                                        didWin ?
                                        <Icon name="win" size={20} className="h-5 w-5 flex-shrink-0 fill-green-500 hover:fill-green-800" />
                                        :
                                        <Icon name="lose" size={20} className="h-5 w-5 flex-shrink-0 fill-red-500 hover:fill-red-800" />
                                        }
                                    </TableCell>
                                    <TableCell className="w-[40px] sm:w-[60px] text-xs sm:text-sm">{match.kills}</TableCell>
                                    <TableCell className="w-[40px] sm:w-[60px] text-xs sm:text-sm">{match.deaths}</TableCell>
                                    <TableCell className="w-[40px] sm:w-[60px] text-xs sm:text-sm">{match.assists}</TableCell>
                                    <TableCell className="text-right text-xs sm:text-sm">{match.match_id}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between">
                <div className="text-xs sm:text-sm text-zinc-500">
                    Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1 || isLoading}
                        className="p-1 sm:p-2 rounded-md hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages || isLoading}
                        className="p-1 sm:p-2 rounded-md hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
