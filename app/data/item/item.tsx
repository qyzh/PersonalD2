import data from './item_ID.json';
import itemDetails from './itemDetail.json';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/app/component/ui/Drawer"
  import { Alert, AlertDescription, AlertTitle } from "@/app/component/ui/Alert"

import { Clock9Icon, Coins, Info, TestTubeDiagonal } from "lucide-react";

export async function ItemList() {
    return (
        <div className='mx-auto container '>
            <div className='grid grid-cols-5 lg:grid-cols-12 gap-2'>
            {Object.entries(data).filter(([key, value]) => {
                const name: string = typeof value === 'string' ? value : `Item ${key}`;
                return !name.toLowerCase().includes("recipe") && !name.toLowerCase().includes("ability_base");
            }).map(([key, value]) => {
                const id: number = typeof value === "number" ? value : parseInt(key);
                const name: string = typeof value === 'string' ? value : `Item ${key}`;
                const iName = Object.values(itemDetails).find((item) => parseInt(item.id.toString()) === id);
                return (
                    <div key={id} className='flex justify-center'>
                                    <Drawer>
                                        <DrawerTrigger>
                                        <img src={`https://cdn.cloudflare.steamstatic.com/${iName?.img}`} alt={name} className=' object-none' />
                                        </DrawerTrigger>
                                        <DrawerContent>
                                            <div className='p-4 mx-auto container max-w-3xs pl-12'>

                                                <DrawerHeader>
                                                    <DrawerTitle>{iName && 'dname' in iName ? iName.dname.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()) : 'Unknown Item'}</DrawerTitle>

                                                    <DrawerDescription>

                                                    {iName?.lore && <div className='italic mb-2'>{iName.lore}</div>}

                                                        {iName?.cost && <div><span>Cost : <span className="inline-flex items-center text-amber-300">{iName.cost} <Coins className="ml-1 size-4" /></span></span></div>}


                                                        {iName?.cd && <div>Cooldown : <span className="inline-flex items-center text-emerald-300"> {iName.cd}<Clock9Icon className="ml-1 size-4"/></span></div>}

                                                        {iName?.mc && <div>Mana Cost : <span className='inline-flex items-center text-blue-300'>{iName.mc}<TestTubeDiagonal className="ml-1 size-4"/></span></div>}

                                                        {iName?.attrib && <div>Attributes :
                                                                <ul className='list-inside list-disc'>{iName.attrib.map((attr) => (
                                                                    <li key={attr.key}>
                                                                        {attr.key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}: {attr.value}
                                                                    </li>
                                                                ))}</ul>
                                                        </div>}

                                                        {iName?.notes &&
                                                        <Alert variant="info" className="mt-2">
                                                            <Info className="h-4 w-4" />
                                                            <AlertTitle>Note!</AlertTitle>
                                                            <AlertDescription>
                                                            {iName.notes}
                                                            </AlertDescription>
                                                        </Alert>
                                                        }

                                                        </DrawerDescription>
                                                </DrawerHeader>
                                            </div>
                                        </DrawerContent>
                                    </Drawer>
                    </div>
                );
            })}
            </div>
        </div>
    );
}
