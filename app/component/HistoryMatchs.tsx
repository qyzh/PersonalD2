"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProfileID } from "@/app/profile/profiledata";
import { getHistoryMatchs } from "@/app/data/game/historymatch";
interface Match {
    match_id: number;
    kills: number;
    deaths: number;
    assists: number;
    hero_id: number;
    radiant_win: boolean; // Add win field
    player_slot: number;
    // Add other relevant fields from the API response
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
export default function HistoryMatch() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [heroNameMap, setHeroNameMap] = useState<Map<number, { name: string; img: string }>>(new Map());

    useEffect(() => {
        async function fetchMatches() {
            try {
                const response = await getHistoryMatchs();
                const matches: Match[] = response.matches;
                setMatches(matches);
            } catch (error) {
                console.error('Error fetching matches:', error);
            }
        }

        async function fetchHeroNames() {
            try {
                const heroNameResponse = await fetch(`https://dummyjson.com/c/be13-4e90-42b4-90b1`);
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
        fetchHeroNames();
    }, []);

    return (
        <div className="font-mono">
            {matches.slice(0, 6).map((match) => {
            const isRadiant = match.player_slot < 127;
            const didWin = (isRadiant && match.radiant_win) || (!isRadiant && !match.radiant_win);
            const BgColor = didWin ? 'border-emerald-500 bg-emerald-100 px-2.5 py-0.5 text-emerald-700' : 'bg-red-100 border-red-500 px-2.5 py-0.5 text-red-700';
                const heroInfo = heroNameMap.get(match.hero_id);
                return (
                    <div
                        key={match.match_id}
                        className="flex flex-row mt-4 justify-between">
                        <div className="space-y-2">
                            <p className="font-semibold">{heroInfo?.name}</p>
                            <p className="whitespace-break-spaces">{match.kills} / {match.deaths} / {match.assists}</p>
                        </div>
                        <div className="text-right space-y-2">
                            <p className={`inline items-center justify-center rounded border px-2.5 py-0.5 ${BgColor}`}>
                            {didWin ? 'Win' : 'Lose'}
                            </p>
                            <p className="">{match.match_id}</p>
                        </div>
                    </div>
                );
            })}
            <div className=''>
                <Link href='/history'>
                <button className="items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-white hover:bg-slate-200 text-black px-4 py-2 w-full mt-8">
                    View All
                </button>
                </Link>
            </div>
        </div>
    );
}
