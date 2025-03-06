
export default function FBWinrate() {
    return (

        <div className="font-mono md:min-h-[157px]">
            <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="place-content-center space-y-2">
                <p className="">Total Matches</p>
                <p className="">Win</p>
                <p className="">Lose</p>
                <p className="">Percentage</p>
            </div>
            <div className="place-content-center space-y-2 ">
                <div><span className="animate-pulse">...</span> Matches</div>
                <div><span className="animate-pulse text-green-500">...</span> Win</div>
                <div><span className="animate-pulse text-red-500">...</span> Lose</div>
                <div><span className="animate-pulse">...</span> %</div>
            </div>
            </div>

        </div>
    );
}
