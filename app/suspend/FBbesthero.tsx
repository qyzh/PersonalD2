export default function FBbesthero() {

    const placeholderCount = 6

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 place-items-center mt-4">
            {Array.from({ length: placeholderCount }).map((_, index) => (
                <div key={index} className="justify-center items-center p-2">
                    <div className="flex flex-col items-center">
                        <div className="w-28 h-28 flex-shrink-0">
                            <div className="animate-pulse bg-neutral-900 w-full h-full border rounded-md"></div>
                        </div>
                        <p className="font-semibold text-center w-28 truncate"></p>
                        <p className="text-sm"> Game play : ...</p>
                        <p className="text-sm"> Win : ...</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
