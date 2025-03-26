"use client";
import React from 'react';
import Link from 'next/link';
import { getProfileID } from "@/app/profile/profiledata";
import { getHistoryMatchs } from "@/app/data/game/historymatch";
import { Sword, Skull, Handshake } from "lucide-react";

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
                if (!response || !response.matches) throw new Error('Failed to fetch matches');
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
            <div className='inline-flex items-center gap-1'><Sword className='size-4'/>{kills}</div>
            <div className='inline-flex items-center gap-1'><Skull className='size-4'/>{deaths}</div>
            <div className='inline-flex items-center gap-1'><Handshake className='size-4'/>{assists}</div>
        </div>
    )
);

export default function HistoryMatch() {
    const { matches, heroNameMap } = historyResource.read();

    return (
        <div className="w-full space-y-4">
            <div className="space-y-4">
                {matches.slice(0, 5).map((match) => {
                    const isRadiant = match.player_slot < 127;
                    const didWin = (isRadiant && match.radiant_win) || (!isRadiant && !match.radiant_win);
                    const statusColor = didWin ? 'text-emerald-500' : 'text-red-500';
                    const heroInfo = heroNameMap.get(match.hero_id);
                    
                    return (
                        <Link
                            key={match.match_id}
                            href={`/matches/${match.match_id}`}
                            className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors
                            hover:cursor-pointer
                            hover:border-primary">
                            <div className="space-y-1">
                                <p className="font-medium">{heroInfo?.name}</p>
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
