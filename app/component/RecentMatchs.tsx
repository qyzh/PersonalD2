"use client";
import React, { useMemo } from 'react';
import { Sword, Skull, Handshake } from 'lucide-react';
import dataitem from '../data/item/item_ID.json';
import itemDetails from '../data/item/itemDetail.json';
import { getHistoryMatchs } from '../data/game/historymatch';
import { Icon } from '../public/svg/icon';

// Types moved to separate interfaces for better organization
interface Match {
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
}

interface HeroInfo {
    name: string;
    img: string;
}

interface ItemInfo {
    id: number;
    name: string;
    img: string;
}

interface MatchResourceData {
    matches: Match[];
    heroNameMap: Map<number, HeroInfo>;
    itemNameMap: Map<number, ItemInfo>;
}

// Separate data fetching logic
const matchResource = {
    data: null as MatchResourceData | null,
    promise: null as Promise<void> | null,

    async load() {
        if (this.promise) return this.promise;

        this.promise = (async () => {
            try {
                // Fetch matches
                const response = await getHistoryMatchs();
                if (!response?.matches) throw new Error('Failed to fetch matches');

                // Fetch hero names
                const heroNameResponse = await fetch(`https://dummyjson.com/c/be13-4e90-42b4-90b1`);
                if (!heroNameResponse.ok) throw new Error('Failed to fetch hero names');
                const heroNameData = await heroNameResponse.json();
                if (!Array.isArray(heroNameData)) throw new Error('Invalid hero data format');

                // Process hero data
                const heroNameMap = new Map<number, HeroInfo>();
                heroNameData.forEach((hero) => {
                    if (hero?.id && hero.localized_name && hero.img) {
                        heroNameMap.set(hero.id, {
                            name: hero.localized_name,
                            img: hero.img
                        });
                    }
                });

                // Process item data
                const itemNameMap = new Map<number, ItemInfo>();
                Object.entries(dataitem).forEach(([key, value]) => {
                    const id = typeof value === "number" ? value : parseInt(key);
                    if (id === 0) return;

                    const name = typeof value === 'string' ? value : `Item ${key}`;
                    const itemDetail = Object.values(itemDetails).find(
                        (item) => parseInt(item.id.toString()) === id
                    );

                    if (itemDetail?.img) {
                        itemNameMap.set(id, {
                            id,
                            name,
                            img: itemDetail.img
                        });
                    }
                });

                this.data = {
                    matches: response.matches,
                    heroNameMap,
                    itemNameMap
                };
            } catch (error) {
                console.error('Error fetching data:', error);
                this.data = null;
                this.promise = null;
                throw error;
            }
        })();
        return this.promise;
    },

    read(): MatchResourceData {
        if (!this.data) {
            throw this.load();
        }
        return this.data;
    }
};

const MatchStats: React.FC<{ kills: number; deaths: number; assists: number }> = React.memo(
    ({ kills, deaths, assists }) => (
        <div className='flex flex-row gap-2'>
            <div className='inline-flex items-center'>
            <Icon name='sword' size={20} className='w-6 h-6 fill-green-500'/>:{kills}</div>
            <div className='inline-flex items-center'>
                <Icon name='skull' size={20} className='w-6 h-6 fill-red-500'/>:{deaths}</div>
            <div className='inline-flex items-center'>
                <Icon name='assist' size={20} className='w-6 h-6 fill-amber-500'/>:{assists}</div>
        </div>
    )
);
MatchStats.displayName = 'MatchStats';

const ItemGrid: React.FC<{ items: number[]; itemNameMap: Map<number, ItemInfo> }> = React.memo(
    ({ items, itemNameMap }) => (
        <div className='grid grid-cols-6 gap-2 mt-3 max-w-2xl'>
            {items.map((itemId: number, index: number) => {
                const itemInfo = itemNameMap.get(itemId);
                return (
                    <div key={index} className="rounded-lg border bg-card text-card-foreground shadow-sm aspect-square flex items-center justify-center p-1">
                        {itemInfo && (
                            <img
                                src={`https://cdn.cloudflare.steamstatic.com/${itemInfo.img}`}
                                alt={itemInfo.name}
                                className='w-full h-full object-contain rounded-md'
                                loading="lazy"
                            />
                        )}
                    </div>
                );
            })}
        </div>
    )
);
ItemGrid.displayName = 'ItemGrid';

export default function RecentMatch() {
    const { matches, heroNameMap, itemNameMap } = matchResource.read();

    const latestMatch = useMemo(() => matches[0], [matches]);

    if (!latestMatch) return null;

    const isRadiant = latestMatch.player_slot < 127;
    const didWin = (isRadiant && latestMatch.radiant_win) || (!isRadiant && !latestMatch.radiant_win);
    const bgColor = didWin
        ? 'border-emerald-500 bg-emerald-100 px-2.5 py-0.5 text-emerald-700'
        : 'bg-red-100 border-red-500 px-2.5 py-0.5 text-red-700';
    const heroInfo = heroNameMap.get(latestMatch.hero_id);

    const items = [
        latestMatch.item_0,
        latestMatch.item_1,
        latestMatch.item_2,
        latestMatch.item_3,
        latestMatch.item_4,
        latestMatch.item_5
    ];

    return (
        <div className="max-w-3xl">
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="w-32 h-32 md:w-28 md:h-28 overflow-hidden rounded-lg shadow-md flex-shrink-0">
                    {heroInfo && (
                        <img
                            src={`https://cdn.cloudflare.steamstatic.com/${heroInfo.img}`}
                            alt={heroInfo.name}
                            className='w-full h-full object-cover'
                            loading="lazy"
                        />
                    )}
                </div>

                <div className="flex flex-col items-center md:items-start gap-2 flex-grow">
                    <div className="flex flex-row gap-2">

                        <div className="font-semibold text-xl lg:text-lg">
                            {heroInfo?.name}
                        </div>

                        <p className={`inline-flex items-center justify-center rounded-md border text-sm ${bgColor}`}>
                            {didWin ? 'Win' : 'Lose'}
                        </p>
                    </div>

                    <MatchStats
                        kills={latestMatch.kills}
                        deaths={latestMatch.deaths}
                        assists={latestMatch.assists}
                    />

                    <div className='grid grid-cols-6 gap-1 mt-2 max-w-lg'>
                {items.map((itemId: number, index: number) => {
                    const itemInfo = itemNameMap.get(itemId);
                    return (
                        <div key={index} className="rounded-md border bg-card text-card-foreground shadow-sm aspect-square flex items-center justify-center w-10 h-10">
                            {itemInfo && (
                                <img
                                    src={`https://cdn.cloudflare.steamstatic.com/${itemInfo.img}`}
                                    alt={itemInfo.name}
                                    className='w-9 h-9 object-contain rounded-sm'
                                    loading="lazy"
                                />
                            )}
                        </div>
                    );
                })}
            </div>

                </div>
            </div>

        </div>
    );
}
