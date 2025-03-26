import { getProfileID } from '@/app/profile/profiledata';
import { fetchWithRateLimit } from '@/app/utils/api';

type HeroStats = {
    hero_id: number;
    games: number;
    win: number;
}[];

export async function getHeroStat() {
    const userID = await getProfileID();
    const url = `https://api.opendota.com/api/players/${userID}/heroes`;
    const cacheKey = `hero_stats_${userID}`;
    return fetchWithRateLimit<HeroStats>(url, cacheKey);
}
