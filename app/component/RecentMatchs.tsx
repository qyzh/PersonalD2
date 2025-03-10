import React, { useEffect, useState } from 'react';
import { Sword, Skull, Handshake } from 'lucide-react';
import dataitem from '../data/item/item_ID.json';
import itemDetails from '../data/item/itemDetail.json';

type Match = {
    match_id: number;
    kills: number;
    deaths: number;
    assists: number;
    hero_id: number;
    radiant_win: boolean;
    player_slot: number;
    item_0: number;
    item_1: number;
    item_2: number;
    item_3: number;
    item_4: number;
    item_5: number;
};

type HeroName = {
    id: number;
    localized_name: string;
    primary_attr: string;
    attack_type: string;
    img: string;
    roles: string[];
}[];

type Item = {
    id: number;
    name: string;
    img: string;
}[];

const matches_full = 'https://api.opendota.com/api/players/152850421/matches?significant=0&project=duration&project=game_mode&project=lobby_type&project=start_time&project=hero_id&project=version&project=kills&project=deaths&project=assists&project=leaver_status&project=party_size&project=average_rank&project=hero_variant&project=item_0&project=item_1&project=item_2&project=item_3&project=item_4&project=item_5';

export default function Recent_match() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [heroNameMap, setHeroNameMap] = useState<Map<number, { name: string; img: string }>>(new Map());
    const [itemNameMap, setItemNameMap] = useState<Map<number, { id: number; name: string; img: string }>>(new Map());

    useEffect(() => {
        async function fetchMatches() {
            try {
                const response = await fetch(`${matches_full}`);
                const matches: Match[] = await response.json();
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

        async function fetchItemNames() {
            try {
            const itemResponse = dataitem;
            const itemData: Item = Object.entries(itemResponse).map(([key, value]) => {
                const id: number = typeof value === "number" ? value : parseInt(key);
                if (id === 0) return null; // Skip items with id 0
                const name: string = typeof value === 'string' ? value : `Item ${key}`;
                const itemDetail =  Object.values(itemDetails).find((item) => parseInt(item.id.toString()) === id);
                const img: string = itemDetail ? itemDetail.img : '';
                return { id, name, img };
            }).filter(item => item !== null) as Item;
            const itemNameMap = new Map<number, { id: number; name: string; img: string }>();
            itemData.forEach((item) => {
                itemNameMap.set(item.id, { id: item.id, name: item.name, img: item.img });
            });
            setItemNameMap(itemNameMap);
            } catch (error) {
            console.error('Error fetching item names:', error);
            }
        }

        fetchMatches();
        fetchHeroNames();
        fetchItemNames();
    }, []);

    return (
        <div className="">
            <div className="mt-4">
                {matches.slice(0, 1).map((match) => {
                    const isRadiant = match.player_slot < 127;
                    const didWin = (isRadiant && match.radiant_win) || (!isRadiant && !match.radiant_win);
                    const BgColor = didWin ? 'border-emerald-500 bg-emerald-100 px-2.5 py-0.5 text-emerald-700' : 'bg-red-100 border-red-500 px-2.5 py-0.5 text-red-700';
                    const heroInfo = heroNameMap.get(match.hero_id);
                    return (
                        <div key={match.match_id} className="">
                            <div className="flex flex-col md:flex-row gap-2">
                                <div className="h-32 md:h-28 overflow-hidden object-fill ">
                                    {heroInfo && <img src={`https://cdn.cloudflare.steamstatic.com/${heroInfo?.img}`} alt={heroInfo.name} className='w-full h-full object-cover rounded-md' />}
                                </div>
                            <div className="flex flex-col content-center mt-2">
                                 <div className="font-semibold text-2xl"> {heroInfo?.name}</div>
                                 <div className='flex flex-row gap-2'>
                                <div className='inline-flex items-center'><Sword className='size-4'/>:{match.kills} </div>
                                <div className='inline-flex items-center'><Skull className='size-4'/>:{match.deaths}</div>
                                <div className='inline-flex items-center'><Handshake className='size-4'/>:{match.assists}</div>
                                </div>
                                <p className={`inline items-center justify-center rounded border px-2.5 py-0.5 ${BgColor}`}>
                                    {didWin ? 'Win' : 'Lose'}
                                </p>
                            </div>
                            </div>
                            <div className='mt-2'>
                                <div className='grid grid-cols-6 gap-1'>
                                    {[match.item_0, match.item_1, match.item_2, match.item_3, match.item_4, match.item_5].map((itemId, index) => {
                                        const itemInfo = itemNameMap.get(itemId);
                                        return (
                                            <div key={index} className="
                                                rounded-xl
                                                border bg-card
                                                text-card-foreground
                                                shadow
                                                p-2
                                                ">
                                                {itemInfo && <img src={`https://cdn.cloudflare.steamstatic.com/${itemInfo.img}`} alt={itemInfo.name} className='size-12 rounded-xl object-fill' />}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}

            </div>
        </div>
    );
}
