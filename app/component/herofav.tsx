import React, { useEffect, useState } from 'react';

const herostatsurl = 'https://dummyjson.com/c/d385-3bc9-4e7e-9352'; // 'https://api.opendota.com/api/players/152850421/heroes'
const heronamesurl = 'https://dummyjson.com/c/be13-4e90-42b4-90b1'; //https://api.opendota.com/api/heroStats

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
                const heroStatsResponse = await fetch(`${herostatsurl}`);
                if (!heroStatsResponse.ok) throw new Error('Failed to fetch hero stats');
                const heroStatsData: HeroStats = await heroStatsResponse.json();
                setHeroStats(heroStatsData);

                // Fetch hero names
                const heroNameResponse = await fetch(`${heronamesurl}`);
                if (!heroNameResponse.ok) throw new Error('Failed to fetch hero names');
                const heroNameData: HeroName = await heroNameResponse.json();

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
                                        <div className="">
                    <div className="size-28 overflow-hidden">
                    <img
                                    src={`https://cdn.cloudflare.steamstatic.com/${heroInfo?.img}`}
                                    alt={heroInfo?.name || 'Unknown'}
                                    className="w-full h-full object-cover rounded-sm"
                                />
                    </div>
                    <p className="font-semibold font-mono text-ellipsis md:text-clip">{heroInfo?.name || 'Unknown'} </p>
                    <p className="font-mono text-sm"> Game play : {hero.games}</p>
                    <p className="font-mono text-sm"> Win : {hero.win}</p>
                        </div>
                        </div>
                );
            })}
        </div>
    );
}
