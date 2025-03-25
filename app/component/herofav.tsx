import React, { useEffect, useState } from 'react';
import { getHeroStat } from '../data/hero/besthero';
import {getHeroData} from '../data/hero/herodata';

export default function Herofav() {
    type HeroStats = {
        hero_id: number;
        games: number;
        win: number;
    }[];

    type HeroName = {
        id: number;
        localized_name: string;
        primary_attr: string;
        attack_type: string;
        img: string;
        roles: string[];
    }[];

    const [heroStats, setHeroStats] = useState<HeroStats>([]);
    const [heroNameMap, setHeroNameMap] = useState<Map<number, { name: string; img: string }>>(new Map());
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch hero stats
                const heroStatsResponse = await getHeroStat();
                const heroStatsData: HeroStats = await heroStatsResponse;
                setHeroStats(heroStatsData);

                // Fetch hero names
                const heroNameResponse = await getHeroData();
                const heroNameData: HeroName = await heroNameResponse;

                // Create a map of hero IDs to hero names and images
                const heroNameMap = new Map<number, { name: string; img: string }>();
                heroNameData.forEach((hero) => {
                    heroNameMap.set(hero.id, { name: hero.localized_name, img: hero.img });
                });
                setHeroNameMap(heroNameMap);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error loading data. Please try again later.');
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 place-items-center mt-4">
            {heroStats.slice(0, 6).map((hero) => {
                const heroInfo = heroNameMap.get(hero.hero_id);
                return (
                    <div key={hero.hero_id} className="justify-center items-center p-2">
                        <div className="flex flex-col items-center">
                            <div className="w-28 h-28 flex-shrink-0">
                                <img
                                    src={`https://cdn.cloudflare.steamstatic.com/${heroInfo?.img}`}
                                    alt={heroInfo?.name || 'Unknown'}
                                    className="w-full h-full object-cover rounded-sm"
                                />
                            </div>
                            <p className="font-semibold font-mono text-center w-28 truncate">{heroInfo?.name || 'Unknown'}</p>
                            <p className="font-mono text-sm"> Game play : {hero.games}</p>
                            <p className="font-mono text-sm"> Win : {hero.win}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
