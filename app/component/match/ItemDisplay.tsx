import React from 'react';

interface ItemInfo {
  id: number;
  name: string;
  img: string;
}

interface CustomItemGridProps {
  items: number[];
  itemNameMap: Map<number, ItemInfo>;
  className?: string;
  itemSize?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  gap?: string;
}

export const CustomItemGrid: React.FC<CustomItemGridProps> = React.memo(
  ({ items, itemNameMap, className = '', gap = 'gap-1', itemSize = 'md' }) => (
    <div className={`flex flex-wrap ${gap} mt-2 w-full ${className}`}>
      {items.map((itemId: number, index: number) => (
        <CustomItemIcon
          key={index}
          itemId={itemId}
          itemNameMap={itemNameMap}
          size={itemSize}
        />
      ))}
    </div>
  )
);

interface CustomItemIconProps {
  itemId: number;
  itemNameMap: Map<number, ItemInfo>;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  tooltipPosition?: 'bottom' | 'top' | 'none';
  className?: string;
}

export const CustomItemIcon: React.FC<CustomItemIconProps> = React.memo(
  ({
    itemId,
    itemNameMap,
    size = 'md',
    tooltipPosition = 'bottom',
    className = ''
  }) => {
    const itemInfo = itemNameMap.get(itemId);
    if (!itemInfo) return null;

    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
      xl: 'w-14 h-14',
      xxl: 'w-16 h-16'
    };

    const tooltipClasses = {
      bottom: "absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-[10px] py-0.5 px-1 rounded-b-md",
      top: "absolute top-0 left-0 right-0 bg-black bg-opacity-75 text-white text-[10px] py-0.5 px-1 rounded-t-md"
    };

    return (
      <div className={`rounded relative group ${sizeClasses[size]} ${className}`}>
        <img
          src={`https://cdn.cloudflare.steamstatic.com/${itemInfo.img}`}
          alt={itemInfo.name}
          className='w-full h-full object-contain rounded-md'
          loading="lazy"
        />
        {tooltipPosition !== 'none' && (
          <div className={`${tooltipClasses[tooltipPosition]} opacity-0 group-hover:opacity-100 transition-opacity truncate text-center`}>
            {itemInfo.name}
          </div>
        )}
      </div>
    );
  }
);

CustomItemGrid.displayName = 'CustomItemGrid';
CustomItemIcon.displayName = 'CustomItemIcon';
