import { getProfileID } from '../../profile/profiledata'
import { fetchWithRateLimit } from '../../utils/api';

interface WLData {
    win: number;
    lose: number;
}

interface Match {
    match_id: number;
    duration: number;
    game_mode: number;
    lobby_type: number;
    start_time: number;
    hero_id: number;
    version: number;
    kills: number;
    deaths: number;
    assists: number;
    leaver_status: number;
    party_size: number;
    average_rank: number;
    hero_variant: number;
    item_0: number;
    item_1: number;
    item_2: number;
    item_3: number;
    item_4: number;
    item_5: number;
    player_slot: number;
    radiant_win: boolean;
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
        fetchWithRateLimit<Match[]>(matchesUrl, matchesCacheKey),
        fetchWithRateLimit<WLData>(wlUrl, wlCacheKey)
    ]);

    const total = (wlData.win || 0) + (wlData.lose || 0);

    return {
        matches,
        total
    };
}
