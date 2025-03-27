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

// Separate component for item details to improve readability and reusability
function ItemDetails({ item }: { item: any }) {
  if (!item) return null

  return (
    <DrawerContent>
      <div className='p-4 mx-auto container max-w-3xs pl-12'>
        <DrawerHeader>
          <DrawerTitle>
            {item.dname?.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()) || 'Unknown Item'}
          </DrawerTitle>
          <DrawerDescription>
            {item.lore && <div className='italic mb-2'>{item.lore}</div>}
            
            {item.cost && (
              <div className="flex items-center gap-1">
                Cost: <span className="text-amber-300 flex items-center">{item.cost}<Coins className="size-4 ml-1" /></span>
              </div>
            )}

            {item.cd && (
              <div className="flex items-center gap-1">
                Cooldown: <span className="text-emerald-300 flex items-center">{item.cd}<Clock9Icon className="size-4 ml-1" /></span>
              </div>
            )}

            {item.mc && (
              <div className="flex items-center gap-1">
                Mana Cost: <span className="text-blue-300 flex items-center">{item.mc}<TestTubeDiagonal className="size-4 ml-1" /></span>
              </div>
            )}

            {item.attrib && (
              <div>
                Attributes:
                <ul className='list-inside list-disc'>
                  {item.attrib.map((attr: { key: string, value: string }) => (
                    <li key={attr.key}>
                      {attr.key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}: {attr.value}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {item.notes && (
              <Alert variant="info" className="mt-2">
                <Info className="h-4 w-4" />
                <AlertTitle>Note!</AlertTitle>
                <AlertDescription>{item.notes}</AlertDescription>
              </Alert>
            )}
          </DrawerDescription>
        </DrawerHeader>
      </div>
    </DrawerContent>
  )
}

export async function ItemList() {
    // Pre-filter and transform the data
    const filteredItems = Object.entries(data)
        .filter(([_, value]) => {
            const name: string = typeof value === 'string' ? value : ''
            return !name.toLowerCase().includes("recipe") && !name.toLowerCase().includes("ability_base")
        })
        .map(([key, value]) => {
            const id: number = typeof value === "number" ? value : parseInt(key)
            const itemDetail = Object.values(itemDetails).find((item) => parseInt(item.id.toString()) === id)
            return { id, itemDetail }
        })
        .sort((a, b) => {
            const qualA = a.itemDetail && 'qual' in a.itemDetail ? a.itemDetail.qual : ''
            const qualB = b.itemDetail && 'qual' in b.itemDetail ? b.itemDetail.qual : ''
            return qualA.localeCompare(qualB)
        })

    // Group items by quality
    const groupedItems = filteredItems.reduce((acc, item) => {
        const qual = item.itemDetail && 'qual' in item.itemDetail ? item.itemDetail.qual : 'Unknown'
        if (!acc[qual]) {
            acc[qual] = []
        }
        acc[qual].push(item)
        return acc
    }, {} as Record<string, typeof filteredItems>)

    return (
        <div className='mx-auto container'>
            {Object.entries(groupedItems).map(([qual, items]) => (
                <div key={qual} className='mb-8'>
                    <h2 className='text-2xl font-bold mb-4 capitalize'>{qual}</h2>
                    <div className='grid grid-cols-5 lg:grid-cols-12 gap-2'>
                        {items.map(({ id, itemDetail }) => (
                            <div key={id} className='flex justify-center'>
                                <Drawer>
                                    <DrawerTrigger>
                                        <img 
                                            src={`https://cdn.cloudflare.steamstatic.com/${itemDetail?.img || ''}`} 
                                            alt={itemDetail && 'dname' in itemDetail ? itemDetail.dname : `Item ${id}`}
                                            className='object-none'
                                        />
                                    </DrawerTrigger>
                                    <ItemDetails item={itemDetail} />
                                </Drawer>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
