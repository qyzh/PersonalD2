
export default function FBWinrate() {
    return (

        <div className="">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <p className="text-sm text-zinc-400">Total Matches</p>
                    <p className="text-sm text-zinc-400">Wins</p>
                    <p className="text-sm text-zinc-400">Losses</p>
                    <p className="text-sm text-zinc-400">Win Rate</p>
                </div>
                <div className="space-y-2 animate-pulse">
                    <p className="text-sm font-medium">...</p>
                    <p className="text-sm font-medium text-green-500">...</p>
                    <p className="text-sm font-medium text-red-500">...</p>
                    <p className="text-sm font-medium text-amber-400">... %</p>
                </div>
            </div>
        </div>
    );
}
