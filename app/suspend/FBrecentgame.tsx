
export default function FBrecentgame() {
    return (
        <div className="font-mono">
            <div className="flex flex-row items-center  mt-4">
                <div className="flex items-center justify-center">
                 <div className="bg-zinc-800 h-32 md:h-28 w-64 rounded-md animate-pulse"></div>
                </div>
                <div className="ml-4 animate-pulse space-y-2 flex flex-col justify-center">
                    <div className="w-28 h-6 bg-zinc-800 rounded-md "> </div>
                    <div className=" w-28 h-6 bg-zinc-800 rounded-md "> </div>
                    <div className="w-28 h-6 bg-zinc-800 rounded-md "> </div>
                    <div className="w-28 h-6 bg-zinc-800 rounded-md "> </div>
                    <p className="inline-flex items-center justify-center rounded border px-2.5 py-0.5"> UNKNOWN </p>
                </div>
            </div>
        </div>
    );
}
