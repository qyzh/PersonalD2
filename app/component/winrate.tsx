"use client"
import React from 'react';
import { fetchWinrate } from '../data/game/winrate';

// Create the resource outside the component
const winrateResource = fetchWinrate();

export default function WinRate() {
    const data = winrateResource.read();
    const totalMatches = data.win + data.lose;
    const percentage = totalMatches > 0 ? Math.round((data.win / totalMatches) * 100) : 0;

    return (
        <div className="">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <p className="text-sm text-zinc-400">Total Matches</p>
                    <p className="text-sm text-zinc-400">Wins</p>
                    <p className="text-sm text-zinc-400">Losses</p>
                    <p className="text-sm text-zinc-400">Win Rate</p>
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-medium">{totalMatches}</p>
                    <p className="text-sm font-medium text-green-500">{data.win}</p>
                    <p className="text-sm font-medium text-red-500">{data.lose}</p>
                    <p className="text-sm font-medium text-amber-400">{percentage}%</p>
                </div>
            </div>
        </div>
    );
}
