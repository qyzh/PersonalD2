"use client";
import React from 'react';
import { getHeroStat } from '../data/hero/besthero';
import { getHeroData } from '../data/hero/herodata';

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

const heroResource = {
    heroStats: null as HeroStats | null,
    heroNameMap: null as Map<number, { name: string; img: string }> | null,
    promise: null as Promise<void> | null,

    async load() {
        if (this.promise) return this.promise;

        this.promise = (async () => {
            try {
                // Fetch hero stats
                const heroStatsResponse = await getHeroStat();
                if (!heroStatsResponse) throw new Error('Failed to fetch hero stats');
                this.heroStats = heroStatsResponse;

                // Fetch hero names
                const heroNameResponse = await getHeroData();
                if (!heroNameResponse) throw new Error('Failed to fetch hero data');
                const heroNameData = heroNameResponse;
                if (!Array.isArray(heroNameData)) throw new Error('Invalid hero data format');

                this.heroNameMap = new Map<number, { name: string; img: string }>();
                heroNameData.forEach((hero) => {
                    if (hero && typeof hero.id === 'number' && hero.localized_name && hero.img) {
                        this.heroNameMap?.set(hero.id, { name: hero.localized_name, img: hero.img });
                    }
                });

                if (!this.heroNameMap) throw new Error('Failed to create hero map');
            } catch (error) {
                this.heroStats = null;
                this.heroNameMap = null;
                this.promise = null;
                console.error('Error fetching data:', error);
                throw error;
            }
        })();
        return this.promise;
    },

    read() {
        if (!this.heroStats || !this.heroNameMap) {
            throw this.load();
        }
        return {
            heroStats: this.heroStats,
            heroNameMap: this.heroNameMap
        };
    }
};

export default function Herofav() {
    const { heroStats, heroNameMap } = heroResource.read();

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
                            <p className="font-semibold  text-center w-28 truncate">{heroInfo?.name || 'Unknown'}</p>
                            <p className="text-sm"> Game play : {hero.games}</p>
                            <p className="text-sm"> Win : {hero.win}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
