"use client";

import { Handshake, Skull, Sword } from "lucide-react";

export default function FBhistorygame() {
    const placeholderCount = 5

    const GameIcons = () => (
        <div className='flex flex-row gap-2 text-sm'>
            <div className='inline-flex items-center gap-1'>
                <Sword className='size-4' />
            </div>
            <div className='inline-flex items-center gap-1'>
                <Skull className='size-4' />
            </div>
            <div className='inline-flex items-center gap-1'>
                <Handshake className='size-4' />
            </div>
        </div>
    )

    return (
        <div className="w-full space-y-4">
            <div className="space-y-4 animate-pulse">  
            {Array.from({ length: placeholderCount }).map((_, index) => (     
                        <div
                        key={index}
                            className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors
                            hover:cursor-pointer
                            hover:border-primary">
                            <div className="space-y-1">
                                <p className="w-16 h-6 bg-neutral-900 border rounded-md"></p>
                                <GameIcons />
                            </div>
                            <div className="text-right space-y-1">
                                <p className={`w-16 h-6 bg-neutral-900 border rounded-md`}>
                                  
                                </p>
                                <p className="text-sm text-muted-foreground">###########</p>
                            </div>
                        </div>
                    ))}
            </div>
            </div>
    );
}
