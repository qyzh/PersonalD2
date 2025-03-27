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

const qualityColors = {
  rare: "#1A87F9",
  artifact: "#E29B01",
  secret_shop: "#FFFFFF",
  consumable: "#1D80E7",
  common: "#2BAB01",
  epic: "#B812F9",
  component: "#FFFFFF"
} as const

// Add these interfaces at the top of the file after the imports
interface ItemQuality {
  rare: string
  artifact: string
  secret_shop: string
  consumable: string
  common: string
  epic: string
  component: string
}

interface ItemAttribute {
  key: string
  value: string
}

interface ItemDetail {
  id: number
  dname?: string
  qual?: keyof ItemQuality
  img?: string
  cost?: number
  cd?: number
  mc?: number
  lore?: string
  attrib?: ItemAttribute[]
  notes?: string
}

function getQualityBorder(item: ItemDetail | null) {
  if (!item?.qual) return { border: '2px solid transparent' }
  const color = qualityColors[item.qual] || '#FFFFFF'
  return { border: `2px solid ${color}` }
}

// Separate component for item details to improve readability and reusability
function ItemDetails({ item }: { item: ItemDetail | null }) {
  if (!item) return null

  return (
    <DrawerContent>
      <div className='p-4 mx-auto container max-w-3xs pl-12'>
        <DrawerHeader>
          <DrawerTitle>
            {item.dname?.replace(/_/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase()) || 'Unknown Item'}
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

    return (
        <div className='mx-auto container'>
            <div className='grid grid-cols-5 lg:grid-cols-12 gap-2'>
                {filteredItems.map(({ id, itemDetail }) => (
                    <div key={id} className='flex justify-center'>
                        <Drawer>
                            <DrawerTrigger>
                                <div className="p-1 rounded-lg" style={getQualityBorder(itemDetail)}>
                                    <img 
                                        src={`https://cdn.cloudflare.steamstatic.com/${itemDetail?.img || ''}`} 
                                        alt={itemDetail && 'dname' in itemDetail ? itemDetail.dname : `Item ${id}`}
                                        className='object-none'
                                    />
                                </div>
                            </DrawerTrigger>
                            <ItemDetails item={itemDetail} />
                        </Drawer>
                    </div>
                ))}
            </div>
        </div>
    );
}
