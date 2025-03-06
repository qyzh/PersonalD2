"use client";
import { FullscreenIcon } from 'lucide-react';
const game_mode = [
    { id: 0, name: 'Unknown' },
    { id: 1, name: 'All Pick' },
    { id: 2, name: 'Captains Mode' },
    { id: 3, name: 'Random Draft' },
    { id: 4, name: 'Single Draft' },
    { id: 5, name: 'All Random' },
    { id: 6, name: 'Intro' },
    { id: 7, name: 'Diretide' },
    { id: 8, name: 'Reverse Captains Mode' },
    { id: 9, name: 'Greeviling' },
    { id: 10, name: 'Tutorial' },
    { id: 11, name: 'Mid Only' },
    { id: 12, name: 'Least Played' },
    { id: 13, name: 'Limited Heroes' },
    { id: 14, name: 'Compendium Matchmaking' },
    { id: 15, name: 'Custom' },
    { id: 16, name: 'Captains Draft' },
    { id: 17, name: 'Balanced Draft' },
    { id: 18, name: 'Ability Draft' },
    { id: 19, name: 'Event' },
    { id: 20, name: 'All Random Death Match' },
    { id: 21, name: '1v1 Mid' },
    { id: 22, name: 'All Draft' },
    { id: 23, name: 'Turbo' },
    { id: 24, name: 'Mutation' },
    { id: 25, name: 'Battle Cup' },
];

export default function FBdatamatch() {
    return (
        <div className="font-mono overflow-x rounded-xl bg-zinc-900/20 border border-zinc-700 p-6 text-sm text-gray-700 w-full">
            <table className="table-auto divide-y-2 divide-zinc-700 overflow-scroll w-full">
                <thead className="h-10 text-left align-middle font-medium text-gray-500 uppercase border-b border-gray-300">
                    <tr className="ltr:text-left rtl:text-right">
                        <th>Hero</th>
                        <th className="text-center">Result</th>
                        <th className="text-center">Game Mode</th>
                        <th className="pl-2">K</th>
                        <th className="pl-2">D</th>
                        <th className="pl-2">A</th>
                        <th className="text-right invisible">Match ID</th>
                    </tr>
                </thead>
                <tbody className="divide-y-2 divide-zinc-700">
                    {game_mode.slice(0,5).map((mode) => (
                        <tr key={mode.id} className="p-2 align-middle text-left animate-pulse">
                            <th className="py-2 md:max-w-24">
                                <div className="flex items-center">
                                    <div className="min-w-12 h-12 pr-2 bg-zinc-800 rounded-md overflow-hidden object-fill">
                                    </div>
                                    <div className="flex flex-col mx-2 gap-2">
                                        <div className='h-4 w-24 bg-zinc-800 '></div>
                                        <div className="h-4 w-10 bg-zinc-800"></div>
                                    </div>
                                </div>
                            </th>
                            <th className='text-center'>
                                <div className={`inline items-center justify-center rounded border px-2.5 py-0.5`}>
                                    unknown
                                </div>
                            </th>
                            <th className="text-center md:max-w-24 text-slate-300">{mode.name}</th>
                            <th className="text-green-600 pl-2">0</th>
                            <th className="text-red-600 pl-2">0</th>
                            <th className="text-yellow-600 pl-2">0</th>
                            <th className="invisible text-right pl-2 md:max-w-24">
                                <div className="flex items-center justify-end">
                                    <div className="text-zinc-500 hover:text-white">1231231231312</div>
                                    <div>
                                        <a href={`https://www.opendota.com/matches/`}>
                                            <FullscreenIcon className="w-5 h-5 ml-2" />
                                        </a>
                                    </div>
                                </div>
                            </th>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
