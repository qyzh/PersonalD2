import { getProfileID } from '../../profile/profiledata'
import { fetchWithRateLimit } from '../../utils/api';

// Add API key to your requests
const API_KEY = process.env.NEXT_PUBLIC_OPENDOTA_API_KEY;

interface WLData {
    win: number;
    lose: number;
}

export async function getHistoryMatchs(page: number = 1, limit: number = 10) {
    const userID = await getProfileID();
    const offset = (page - 1) * limit;
    
    const matchesUrl = `https://api.opendota.com/api/players/${userID}/matches?significant=0&limit=${limit}&offset=${offset}&project=duration&project=game_mode&project=lobby_type&project=start_time&project=hero_id&project=version&project=kills&project=deaths&project=assists&project=leaver_status&project=party_size&project=average_rank&project=hero_variant&project=item_0&project=item_1&project=item_2&project=item_3&project=item_4&project=item_5`;
    const wlUrl = `https://api.opendota.com/api/players/${userID}/wl`;

    const matchesCacheKey = `matches_${userID}_${page}_${limit}`;
    const wlCacheKey = `wl_${userID}`;

    // Make both requests with rate limiting
    const [matches, wlData] = await Promise.all([
        fetchWithRateLimit<any>(matchesUrl, matchesCacheKey),
        fetchWithRateLimit<WLData>(wlUrl, wlCacheKey)
    ]);

    const total = (wlData.win || 0) + (wlData.lose || 0);

    return {
        matches,
        total
    };
}
