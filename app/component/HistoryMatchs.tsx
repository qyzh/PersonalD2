"use client";
import React from 'react';
import Link from 'next/link';
import { getHistoryMatchs } from "@/app/data/game/historymatch";
import { Icon } from '../../public/svg/icon';

interface Match {
    match_id: number;
    kills: number;
    deaths: number;
    assists: number;
    hero_id: number;
    radiant_win: boolean;
    player_slot: number;
}

type HeroName = {
    id: number;
    localized_name: string;
    primary_attr: string;
    attack_type: string;
    img: string;
    roles: string[];
}[];

const historyResource = {
    matches: null as Match[] | null,
    heroNameMap: null as Map<number, { name: string; img: string }> | null,
    promise: null as Promise<void> | null,

    async load() {
        if (this.promise) return this.promise;

        this.promise = (async () => {
            try {
                const response = await getHistoryMatchs();
                if (!response.matches) throw new Error('Failed to fetch matches data');
                this.matches = response.matches;

                const heroNameResponse = await fetch(`https://dummyjson.com/c/be13-4e90-42b4-90b1`);
                if (!heroNameResponse.ok) throw new Error('Failed to fetch hero names');
                const heroNameData = await heroNameResponse.json();
                if (!Array.isArray(heroNameData)) throw new Error('Invalid hero data format');

                this.heroNameMap = new Map<number, { name: string; img: string }>();
                heroNameData.forEach((hero) => {
                    if (hero && typeof hero.id === 'number' && hero.localized_name && hero.img) {
                        this.heroNameMap?.set(hero.id, { name: hero.localized_name, img: hero.img });
                    }
                });

                if (!this.heroNameMap) throw new Error('Failed to create hero map');
            } catch (error) {
                this.matches = null;
                this.heroNameMap = null;
                this.promise = null;
                console.error('Error fetching data:', error);
                throw error;
            }
        })();
        return this.promise;
    },

    read() {
        if (!this.matches || !this.heroNameMap) {
            throw this.load();
        }
        return {
            matches: this.matches,
            heroNameMap: this.heroNameMap
        };
    }
};

const MatchStats: React.FC<{ kills: number; deaths: number; assists: number }> = React.memo(
    ({ kills, deaths, assists }) => (
        <div className='flex flex-row gap-2 text-sm'>
           <div className='inline-flex items-center'>
           <Icon name='sword' size={20} className='w-5 h-5 fill-green-800 group-hover:fill-green-600'/>:{kills}</div>
            <div className='inline-flex items-center'>
                <Icon name='skull' size={20} className='w-5 h-5 fill-red-800 group-hover:fill-red-600'/> :{deaths}</div>
            <div className='inline-flex items-center'>
            <Icon name='assist' size={20} className='w-5 h-5 fill-amber-800 group-hover:fill-amber-600'/>:{assists}</div>
        </div>
    )
);
MatchStats.displayName = 'MatchStats';

export default function HistoryMatch() {
    const { matches, heroNameMap } = historyResource.read();

    return (
        <div className="w-full space-y-4">
            <div className="space-y-4">
                {matches.slice(0, 5).map((match) => {
                    const isRadiant = match.player_slot < 127;
                    const didWin = (isRadiant && match.radiant_win) || (!isRadiant && !match.radiant_win);
                    const statusColor = didWin ? 'text-emerald-800 group-hover:text-emerald-500' : 'text-red-800 group-hover:text-red-500';
                    const heroInfo = heroNameMap.get(match.hero_id);

                    return (
                        <Link
                            key={match.match_id}
                            href={`/matches/${match.match_id}`}
                            className="flex group items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors
                            hover:cursor-pointer
                            hover:border-primary">
                            <div className="space-y-1">
                                <p className="font-bold">{heroInfo?.name}</p>
                                <MatchStats kills={match.kills} deaths={match.deaths} assists={match.assists} />
                            </div>
                            <div className="text-right space-y-1">
                                <p className={`font-medium ${statusColor}`}>
                                    {didWin ? 'Win' : 'Lose'}
                                </p>
                                <p className="text-sm text-muted-foreground">#{match.match_id}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
            <Link href='/history' className="block">
                <button className="w-full px-4 py-2 text-sm font-medium rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors">
                    View All Matches
                </button>
            </Link>
        </div>
    );
}
