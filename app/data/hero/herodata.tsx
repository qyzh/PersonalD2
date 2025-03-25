import { cache } from '../../utils/cache';
import { fetchWithRateLimit } from '../../utils/api';

type HeroName = {
    id: number;
    localized_name: string;
    primary_attr: string;
    attack_type: string;
    img: string;
    roles: string[];
}[];

export async function getHeroData(): Promise<HeroName> {
    const cacheKey = 'hero_stats';
    return fetchWithRateLimit<HeroName>('https://api.opendota.com/api/heroStats', cacheKey);
}

export async function getHeroNames() {
    const cacheKey = 'hero_names_map';
    const cachedMap = cache.get<Map<number, { name: string; img: string }>>(cacheKey);
    
    if (cachedMap) {
        return cachedMap;
    }

    const heroNameData = await getHeroData();
    const heroNameMap = new Map<number, { name: string; img: string }>();
    
    heroNameData.forEach((hero) => {
        heroNameMap.set(hero.id, { name: hero.localized_name, img: hero.img });
    });

    cache.set(cacheKey, heroNameMap);
    return heroNameMap;
}
