"use client";

export default function FBhistorygame() {

    return (
        <div className="font-mono">
                    <div
                        className="flex flex-row mt-4 justify-between">
                        <div className="space-y-2">
                            <div className="w-24 h-6 bg-zinc-800 rounded-md animate-pulse"></div>
                            <div className="flex flex-row space-x-2">
                                <div className="w-10 h-6 bg-zinc-800 rounded-md animate-pulse"></div>
                                /<div className="w-10 h-6 bg-zinc-800 rounded-md animate-pulse"></div>
                                 /<div className="w-10 h-6 bg-zinc-800 rounded-md animate-pulse"></div>
                                </div>
                        </div>
                        <div className="text-right space-y-2 animate-pulse">
                            <div className={`inline items-center justify-center rounded border px-2.5 py-0.5`}>
                          UNKNOWN
                            </div>
                            <div className="">no data</div>
                        </div>
                    </div>
        </div>
    );
}
